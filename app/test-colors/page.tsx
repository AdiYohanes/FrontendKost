export default function TestColors() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        TailwindCSS Color Palette Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Background & Foreground */}
        <div className="bg-background text-foreground border border-border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Background & Foreground</h3>
          <p>Default background and text colors</p>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground border border-border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Card</h3>
          <p>Card background with foreground text</p>
        </div>

        {/* Primary */}
        <div className="bg-primary text-primary-foreground p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Primary</h3>
          <p>Primary color with foreground</p>
        </div>

        {/* Secondary */}
        <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Secondary</h3>
          <p>Secondary color with foreground</p>
        </div>

        {/* Muted */}
        <div className="bg-muted text-muted-foreground p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Muted</h3>
          <p>Muted color with foreground</p>
        </div>

        {/* Accent */}
        <div className="bg-accent text-accent-foreground p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Accent</h3>
          <p>Accent color with foreground</p>
        </div>

        {/* Destructive */}
        <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Destructive</h3>
          <p>Destructive/error color</p>
        </div>

        {/* Border & Input */}
        <div className="bg-background border-2 border-border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Border</h3>
          <input
            type="text"
            placeholder="Input with border"
            className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>

        {/* Chart Colors */}
        <div className="bg-background border border-border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Chart Colors</h3>
          <div className="flex gap-2 mt-2">
            <div className="w-8 h-8 bg-[hsl(var(--chart-1))] rounded"></div>
            <div className="w-8 h-8 bg-[hsl(var(--chart-2))] rounded"></div>
            <div className="w-8 h-8 bg-[hsl(var(--chart-3))] rounded"></div>
            <div className="w-8 h-8 bg-[hsl(var(--chart-4))] rounded"></div>
            <div className="w-8 h-8 bg-[hsl(var(--chart-5))] rounded"></div>
          </div>
        </div>
      </div>

      {/* Border Radius Test */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Border Radius</h2>
        <div className="flex gap-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-sm">
            Small (sm)
          </div>
          <div className="bg-primary text-primary-foreground p-4 rounded-md">
            Medium (md)
          </div>
          <div className="bg-primary text-primary-foreground p-4 rounded-lg">
            Large (lg)
          </div>
        </div>
      </div>
    </div>
  );
}
