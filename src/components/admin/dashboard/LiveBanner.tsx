
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown, Loader2, Megaphone } from "lucide-react";
import { useState } from "react";

interface LiveBannerProps {
    liveBannerText: string;
    setLiveBannerText: (text: string) => void;
    onSave: () => void;
    isSaving: boolean;
}

export function LiveBanner({ liveBannerText, setLiveBannerText, onSave, isSaving }: LiveBannerProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <div className="flex items-center justify-between p-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Megaphone className="h-6 w-6" />
                            <CardTitle>Live Banner</CardTitle>
                        </div>
                        <CardDescription className="mt-1.5">
                            Update the announcement banner at the top of the site. Leave
                            empty to hide it.
                        </CardDescription>
                    </div>
                     <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
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
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}
