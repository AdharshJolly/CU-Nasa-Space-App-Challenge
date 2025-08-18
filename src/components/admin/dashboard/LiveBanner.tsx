
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
                <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center cursor-pointer p-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <Megaphone className="h-6 w-6" />
                                <CardTitle>Live Banner</CardTitle>
                            </div>
                            <CardDescription>
                                Update the announcement banner at the top of the site. Leave
                                empty to hide it.
                            </CardDescription>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}
