
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Megaphone } from "lucide-react";

interface LiveBannerProps {
    liveBannerText: string;
    setLiveBannerText: (text: string) => void;
    onSave: () => void;
    isSaving: boolean;
}

export function LiveBanner({ liveBannerText, setLiveBannerText, onSave, isSaving }: LiveBannerProps) {
    return (
        <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-6 w-6" />
                <CardTitle>Live Banner</CardTitle>
              </div>
              <CardDescription>
                Update the announcement banner at the top of the site. Leave
                empty to hide it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter banner text here..."
                value={liveBannerText}
                onChange={(e) => setLiveBannerText(e.target.value)}
                disabled={isSaving}
              />
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Banner"
                )}
              </Button>
            </CardContent>
        </Card>
    )
}
