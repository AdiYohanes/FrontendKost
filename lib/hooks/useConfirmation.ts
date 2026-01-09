"use client";

import { useState } from "react";

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: "",
    description: "",
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const confirm = (
    opts: ConfirmationOptions,
    callback: () => void | Promise<void>
  ) => {
    setOptions(opts);
    setOnConfirmCallback(() => callback);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      await onConfirmCallback();
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
    setIsOpen,
  };
}
