'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || "User created. Please verify your email.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-2 text-center">
          <CheckCircle className="w-16 h-16" style={{ color: '#FF6B6B' }} />
          <h1 className="text-2xl font-bold">
            Account Created Successfully!
          </h1>
          <p className="text-gray-500">
            Check your email to verify your account
          </p>
        </div>
        <Link href="/auth/signin" className="w-full">
          <Button className="w-full" style={{ backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' }}>Next</Button>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailSentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}