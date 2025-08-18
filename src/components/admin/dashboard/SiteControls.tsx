
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Settings, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface RegistrationSettings {
    enabled: boolean;
    isScheduled: boolean;
    scheduledChange: Date | null;
    scheduledState: boolean;
}

interface SiteControlsProps {
    problemsReleased: boolean;
    onReleaseToggle: (checked: boolean) => void;
    settings: RegistrationSettings;
    onSettingsChange: (newSettings: RegistrationSettings) => void;
    isSuperAdmin: boolean;
}

export function SiteControls({
    problemsReleased,
    onReleaseToggle,
    settings,
    onSettingsChange,
    isSuperAdmin,
}: SiteControlsProps) {
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(settings.scheduledChange || undefined);
    const [scheduledTime, setScheduledTime] = useState<string>(settings.scheduledChange ? format(settings.scheduledChange, "HH:mm") : "09:00");
    const [scheduledState, setScheduledState] = useState<"true" | "false">(String(settings.scheduledState));

    const handleManualToggle = (checked: boolean) => {
        onSettingsChange({
            ...settings,
            enabled: checked,
            isScheduled: false, // Manual override cancels schedule
            scheduledChange: null,
        });
    };

    const handleSchedule = () => {
        if (!scheduledDate) return;
        
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const combinedDateTime = new Date(scheduledDate);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        onSettingsChange({
            ...settings,
            isScheduled: true,
            scheduledChange: combinedDateTime,
            scheduledState: scheduledState === "true",
        });
    };

    const handleCancelSchedule = () => {
        setScheduledDate(undefined);
        onSettingsChange({
            ...settings,
            isScheduled: false,
            scheduledChange: null,
        });
    };

    return (
        <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <CardTitle>Site Controls</CardTitle>
              </div>
              <CardDescription>
                Control feature visibility and registration status on the main website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {isSuperAdmin && (
                  <>
                    <Separator />
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Open Registrations Manually
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Use this switch to immediately open or close event registrations.
                            </p>
                        </div>
                        <Switch
                            checked={settings.enabled}
                            onCheckedChange={handleManualToggle}
                            aria-label="Toggle Registrations"
                        />
                    </div>

                    <div className="space-y-4 rounded-md border p-4">
                        <h4 className="font-medium">Schedule Registration Status Change</h4>
                        {settings.isScheduled && settings.scheduledChange && (
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary-foreground flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-primary" />
                                <div className="text-sm">
                                    <span className="font-bold text-foreground">A change is scheduled:</span> Registrations will be set to <b className="text-foreground">{settings.scheduledState ? 'OPEN' : 'CLOSED'}</b> on {format(settings.scheduledChange, "PPP 'at' h:mm a")}.
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !scheduledDate && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={scheduledDate}
                                        onSelect={setScheduledDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="time" className="text-sm font-medium">Time (24-hour)</label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="state" className="text-sm font-medium">Future State</label>
                                <Select value={scheduledState} onValueChange={(value: "true" | "false") => setScheduledState(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Set state..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Open</SelectItem>
                                        <SelectItem value="false">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSchedule} disabled={!scheduledDate}>Schedule Change</Button>
                            {settings.isScheduled && (
                                <Button variant="destructive" onClick={handleCancelSchedule}>Cancel Schedule</Button>
                            )}
                        </div>
                    </div>
                  </>
              )}
            </CardContent>
          </Card>
    );
}
