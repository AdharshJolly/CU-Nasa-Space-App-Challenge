
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Rocket } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const userRole = idTokenResult.claims.role || 'viewer'; // Default role if none is set

      // Role-based redirection
      switch (userRole) {
        case 'superadmin':
        case 'admin':
          router.push("/admin/dashboard");
          break;
        case 'faculty':
          router.push("/faculties");
          break;
        case 'volunteer':
        case 'poc':
          router.push("/volunteers");
          break;
        default:
          // For any other roles or if no role, redirect to the homepage
          toast({
            title: "Login Successful",
            description: "Welcome! Redirecting to homepage.",
          });
          router.push("/");
          break;
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background bg-grid-pattern p-4">
      <Card className="w-full max-w-md shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-4">
              <Rocket className="h-10 w-10 text-primary" />
           </div>
          <CardTitle className="font-headline text-3xl">Universal Login</CardTitle>
          <CardDescription>Enter your credentials to access your designated portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                    </>
                ) : (
                    "Login"
                )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
