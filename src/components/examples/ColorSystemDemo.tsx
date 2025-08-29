import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { colors } from "@/lib/colors";

const ColorSystemDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Fal Parts Color System
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          A comprehensive color palette based on the brand colors: Gold
          (#b3984a), Black (#272627), and Red (#e62626)
        </p>
      </div>

      {/* Logo Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">Logo Colors</CardTitle>
          <CardDescription>Primary brand colors from the logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-logo-gold"></div>
              <div>
                <p className="font-medium text-secondary-900">Gold</p>
                <p className="text-sm text-neutral-500">#b3984a</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-logo-black"></div>
              <div>
                <p className="font-medium text-secondary-900">Black</p>
                <p className="text-sm text-neutral-500">#272627</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-logo-red"></div>
              <div>
                <p className="font-medium text-secondary-900">Red</p>
                <p className="text-sm text-neutral-500">#e62626</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">
            Primary Colors (Gold)
          </CardTitle>
          <CardDescription>Main brand color variations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="text-center">
                <div
                  className={`w-full h-16 rounded-lg mb-2 bg-primary-${shade}`}
                  style={{
                    backgroundColor:
                      colors.primary[shade as keyof typeof colors.primary],
                  }}
                ></div>
                <p className="text-xs font-medium text-secondary-900">
                  {shade}
                </p>
                <p className="text-xs text-neutral-500">
                  {colors.primary[shade as keyof typeof colors.primary]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">
            Secondary Colors (Black)
          </CardTitle>
          <CardDescription>Text and structure color variations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="text-center">
                <div
                  className={`w-full h-16 rounded-lg mb-2 bg-secondary-${shade}`}
                  style={{
                    backgroundColor:
                      colors.secondary[shade as keyof typeof colors.secondary],
                  }}
                ></div>
                <p className="text-xs font-medium text-secondary-900">
                  {shade}
                </p>
                <p className="text-xs text-neutral-500">
                  {colors.secondary[shade as keyof typeof colors.secondary]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accent Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">
            Accent Colors (Red)
          </CardTitle>
          <CardDescription>Calls to action and highlights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="text-center">
                <div
                  className={`w-full h-16 rounded-lg mb-2 bg-accent-${shade}`}
                  style={{
                    backgroundColor:
                      colors.accent[shade as keyof typeof colors.accent],
                  }}
                ></div>
                <p className="text-xs font-medium text-secondary-900">
                  {shade}
                </p>
                <p className="text-xs text-neutral-500">
                  {colors.accent[shade as keyof typeof colors.accent]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">Status Colors</CardTitle>
          <CardDescription>
            Success, warning, error, and info states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-full h-16 rounded-lg mb-2 bg-success-main"></div>
              <p className="text-sm font-medium text-secondary-900">Success</p>
              <p className="text-xs text-neutral-500">#4caf50</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 rounded-lg mb-2 bg-warning-main"></div>
              <p className="text-sm font-medium text-secondary-900">Warning</p>
              <p className="text-xs text-neutral-500">#ff9800</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 rounded-lg mb-2 bg-error-main"></div>
              <p className="text-sm font-medium text-secondary-900">Error</p>
              <p className="text-xs text-neutral-500">#e62626</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 rounded-lg mb-2 bg-info-main"></div>
              <p className="text-sm font-medium text-secondary-900">Info</p>
              <p className="text-xs text-neutral-500">#2196f3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">Button Examples</CardTitle>
          <CardDescription>
            Different button styles using the color system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badge Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">Badge Examples</CardTitle>
          <CardDescription>Status and category badges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex flex-wrap gap-4">
            <Badge className="bg-success-main text-white">Success</Badge>
            <Badge className="bg-warning-main text-white">Warning</Badge>
            <Badge className="bg-error-main text-white">Error</Badge>
            <Badge className="bg-info-main text-white">Info</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Text Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">
            Text Color Examples
          </CardTitle>
          <CardDescription>Different text color usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-primary font-bold">Primary Text (Gold)</h3>
            <h3 className="text-secondary-900 font-bold">
              Secondary Text (Black)
            </h3>
            <h3 className="text-accent font-bold">Accent Text (Red)</h3>
            <p className="text-neutral-600">Neutral Text (Gray)</p>
            <p className="text-muted-foreground">Muted Text</p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary-900">Usage Guidelines</CardTitle>
          <CardDescription>When to use each color</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">
                Primary (Gold)
              </h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Main brand elements</li>
                <li>• Primary buttons</li>
                <li>• Active navigation</li>
                <li>• Important highlights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                Secondary (Black)
              </h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Main text content</li>
                <li>• Headers and titles</li>
                <li>• Secondary buttons</li>
                <li>• Borders and dividers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2">Accent (Red)</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Calls to action</li>
                <li>• Error states</li>
                <li>• Sale badges</li>
                <li>• Important alerts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorSystemDemo;
