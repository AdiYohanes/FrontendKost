import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { logger } from "@/lib/utils/logger";

interface ExpensesByCategory {
  MAINTENANCE: number;
  UTILITIES: number;
  TRASH_FEE: number;
  SUPPLIES: number;
  OTHER: number;
}

interface FinancialReportData {
  period: {
    startDate: string;
    endDate: string;
  };
  rentRevenue: number;
  laundryRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  breakdown: {
    paidInvoices: number;
    paidLaundryTransactions: number;
    expenseRecords: number;
  };
  expensesByCategory: ExpensesByCategory;
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Category display names
const categoryNames: Record<string, string> = {
  MAINTENANCE: "Maintenance",
  UTILITIES: "Utilities",
  TRASH_FEE: "Trash Fee",
  SUPPLIES: "Supplies",
  OTHER: "Other",
};

export async function generatePDFReport(
  report: FinancialReportData,
  startDate: string,
  endDate: string
): Promise<void> {
  // Create PDF document
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Add company branding/header
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, pageWidth, 40, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Kost Management", margin, 20);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Financial Report", margin, 30);

  yPosition = 50;

  // Report title and period
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Financial Report", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `Period: ${format(new Date(startDate), "MMM dd, yyyy")} - ${format(new Date(endDate), "MMM dd, yyyy")}`,
    margin,
    yPosition
  );
  yPosition += 3;

  pdf.text(
    `Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`,
    margin,
    yPosition
  );
  yPosition += 15;

  // Key Metrics Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Key Metrics", margin, yPosition);
  yPosition += 10;

  // Draw metrics boxes
  const boxWidth = (pageWidth - 2 * margin - 10) / 2;
  const boxHeight = 25;

  // Total Revenue
  pdf.setFillColor(240, 253, 244); // Light green
  pdf.roundedRect(margin, yPosition, boxWidth, boxHeight, 3, 3, "F");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Total Revenue", margin + 5, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(22, 163, 74); // Green
  pdf.setFont("helvetica", "bold");
  pdf.text(formatCurrency(report.totalRevenue), margin + 5, yPosition + 18);

  // Total Expenses
  pdf.setFillColor(254, 242, 242); // Light red
  pdf.roundedRect(
    margin + boxWidth + 10,
    yPosition,
    boxWidth,
    boxHeight,
    3,
    3,
    "F"
  );
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Total Expenses", margin + boxWidth + 15, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(220, 38, 38); // Red
  pdf.setFont("helvetica", "bold");
  pdf.text(
    formatCurrency(report.totalExpenses),
    margin + boxWidth + 15,
    yPosition + 18
  );

  yPosition += boxHeight + 5;

  // Net Profit
  const profitColor = report.netProfit >= 0 ? [22, 163, 74] : [220, 38, 38];
  const profitBgColor =
    report.netProfit >= 0 ? [240, 253, 244] : [254, 242, 242];

  pdf.setFillColor(profitBgColor[0], profitBgColor[1], profitBgColor[2]);
  pdf.roundedRect(margin, yPosition, boxWidth, boxHeight, 3, 3, "F");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Net Profit", margin + 5, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
  pdf.setFont("helvetica", "bold");
  pdf.text(formatCurrency(report.netProfit), margin + 5, yPosition + 18);

  // Profit Margin
  const profitMargin =
    report.totalRevenue > 0
      ? (report.netProfit / report.totalRevenue) * 100
      : 0;
  pdf.setFillColor(profitBgColor[0], profitBgColor[1], profitBgColor[2]);
  pdf.roundedRect(
    margin + boxWidth + 10,
    yPosition,
    boxWidth,
    boxHeight,
    3,
    3,
    "F"
  );
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Profit Margin", margin + boxWidth + 15, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `${profitMargin.toFixed(1)}%`,
    margin + boxWidth + 15,
    yPosition + 18
  );

  yPosition += boxHeight + 15;

  checkPageBreak(60);

  // Revenue Breakdown Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Revenue Breakdown", margin, yPosition);
  yPosition += 10;

  // Revenue table
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const revenueData = [
    ["Rent Revenue", formatCurrency(report.rentRevenue)],
    ["Laundry Revenue", formatCurrency(report.laundryRevenue)],
    ["Total Revenue", formatCurrency(report.totalRevenue)],
  ];

  revenueData.forEach(([label, value]) => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, margin + 5, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text(value, pageWidth - margin - 5, yPosition, { align: "right" });
    pdf.setFont("helvetica", "normal");
    yPosition += 8;
  });

  yPosition += 10;

  checkPageBreak(80);

  // Expense Breakdown Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Expense Breakdown", margin, yPosition);
  yPosition += 10;

  // Expense table
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  if (
    report.expensesByCategory &&
    Object.keys(report.expensesByCategory).length > 0
  ) {
    Object.entries(report.expensesByCategory).forEach(([category, amount]) => {
      const percentage =
        report.totalExpenses > 0
          ? ((amount / report.totalExpenses) * 100).toFixed(1)
          : "0.0";

      pdf.setTextColor(100, 100, 100);
      pdf.text(categoryNames[category] || category, margin + 5, yPosition);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${percentage}%`, pageWidth / 2, yPosition);
      pdf.setFont("helvetica", "bold");
      pdf.text(formatCurrency(amount), pageWidth - margin - 5, yPosition, {
        align: "right",
      });
      pdf.setFont("helvetica", "normal");
      yPosition += 8;

      checkPageBreak(20);
    });
  } else {
    pdf.setTextColor(100, 100, 100);
    pdf.text("No expense data available", margin + 5, yPosition);
    yPosition += 8;
  }

  yPosition += 10;

  checkPageBreak(60);

  // Transaction Summary Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Transaction Summary", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const summaryData = [
    ["Paid Invoices", report.breakdown.paidInvoices.toString()],
    [
      "Paid Laundry Transactions",
      report.breakdown.paidLaundryTransactions.toString(),
    ],
    ["Expense Records", report.breakdown.expenseRecords.toString()],
    [
      "Total Transactions",
      (
        report.breakdown.paidInvoices +
        report.breakdown.paidLaundryTransactions +
        report.breakdown.expenseRecords
      ).toString(),
    ],
  ];

  summaryData.forEach(([label, value]) => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, margin + 5, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text(value, pageWidth - margin - 5, yPosition, { align: "right" });
    pdf.setFont("helvetica", "normal");
    yPosition += 8;
  });

  yPosition += 15;

  // Footer
  const footerY = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    "This is a computer-generated report from Kost Management System",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Save PDF
  const fileName = `Financial_Report_${format(new Date(startDate), "yyyy-MM-dd")}_to_${format(new Date(endDate), "yyyy-MM-dd")}.pdf`;
  pdf.save(fileName);
}

export async function generatePDFReportWithCharts(
  elementId: string,
  report: FinancialReportData,
  startDate: string,
  endDate: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Report element not found");
  }

  // Create PDF document
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Add company branding/header
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, pageWidth, 40, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Kost Management", margin, 20);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Financial Report", margin, 30);

  // Report period
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.text(
    `Period: ${format(new Date(startDate), "MMM dd, yyyy")} - ${format(new Date(endDate), "MMM dd, yyyy")}`,
    margin,
    55
  );
  pdf.text(`Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, margin, 62);

  // Capture the report content as image
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 70;

    // Add first page of image
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position - margin;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin;
    }

    // Save PDF
    const fileName = `Financial_Report_${format(new Date(startDate), "yyyy-MM-dd")}_to_${format(new Date(endDate), "yyyy-MM-dd")}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    logger.error("Error generating PDF with charts:", error);
    // Fallback to text-only PDF
    await generatePDFReport(report, startDate, endDate);
  }
}
