'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener in FirebaseProvider will handle the redirect
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <BrainCircuit className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Welcome to AfgAiHub</CardTitle>
          <CardDescription>
            Your modular AI ecosystem. Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full">
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
