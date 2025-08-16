
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface SiteControlsProps {
    problemsReleased: boolean;
    onReleaseToggle: (checked: boolean) => void;
}

export function SiteControls({ problemsReleased, onReleaseToggle }: SiteControlsProps) {
    return (
        <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <CardTitle>Site Controls</CardTitle>
              </div>
              <CardDescription>
                Control feature visibility on the main website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Release Problem Statements
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Make the challenges visible to all participants on the main
                    page.
                  </p>
                </div>
                <Switch
                  id="release-problems"
                  checked={problemsReleased}
                  onCheckedChange={onReleaseToggle}
                />
              </div>
            </CardContent>
          </Card>
    );
}
