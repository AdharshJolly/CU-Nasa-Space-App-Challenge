
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DuplicateInfo } from "@/app/admin/dashboard/page";
import { AlertCircle, ScanSearch } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";

interface DuplicatesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    duplicates: DuplicateInfo[];
}

export function DuplicatesDialog({ isOpen, onClose, duplicates }: DuplicatesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                 <div className="flex justify-center items-center mb-4">
                    <ScanSearch className="h-10 w-10 text-primary" />
                 </div>
                <DialogTitle className="text-center text-2xl font-headline">Duplicate Scan Results</DialogTitle>
                <DialogDescription className="text-center">
                    {duplicates.length > 0 
                        ? `Found ${duplicates.length} potential duplicate entries. Review the items below.`
                        : "No duplicate emails, phone numbers, or register numbers found. All entries appear to be unique."}
                </DialogDescription>
            </DialogHeader>
            
            {duplicates.length > 0 && (
                <ScrollArea className="max-h-[60vh] pr-4">
                    <Accordion type="multiple" className="w-full space-y-2">
                        {duplicates.map((duplicate, index) => (
                            <AccordionItem value={`item-${index}`} key={index} className="bg-card/50 backdrop-blur-sm rounded-lg px-4 border">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-destructive" />
                                        <div className="flex flex-col text-left">
                                            <span className="font-semibold">{duplicate.type}: <span className="font-normal text-muted-foreground">{duplicate.value}</span></span>
                                            <span className="text-sm text-muted-foreground">Found in {duplicate.teams.length} teams</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                                        {duplicate.teams.map((team, teamIndex) => (
                                            <li key={teamIndex}>
                                                <span className="font-semibold text-foreground">{team.memberName}</span> in team <span className="font-semibold text-foreground">{team.teamName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            )}

            <DialogFooter className="mt-4">
                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
