
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket } from "lucide-react";

export const DashboardSkeleton = () => (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-7 w-7 text-primary" />
            <Skeleton className="h-7 w-48" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto grid gap-8 animate-pulse">
          {/* Card Skeleton Structure */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="p-6 pt-0 grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
              </div>
          </div>
          {[...Array(3)].map((_, i) => (
             <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                 <div className="flex flex-col space-y-1.5 p-6">
                      <Skeleton className="h-6 w-1/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                 </div>
                 <div className="p-6 pt-0">
                      <Skeleton className="h-20 w-full" />
                 </div>
             </div>
          ))}
        </div>
      </main>
    </div>
  );
  
