import { Megaphone } from 'lucide-react';

export function LiveUpdatesBanner() {
  return (
    <div className="bg-primary/10 text-primary-foreground p-3 text-center text-sm">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <p className="text-foreground">
          <span className="font-bold">Live Updates:</span> Registrations are now open! The event schedule has been updated.
        </p>
      </div>
    </div>
  );
}
