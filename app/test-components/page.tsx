import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function TestComponentsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">shadcn/ui Components Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>Button Components</CardTitle>
          <CardDescription>Testing different button variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badge Components</CardTitle>
          <CardDescription>Testing different badge variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input Components</CardTitle>
          <CardDescription>Testing input fields with labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
