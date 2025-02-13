'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type ApiResponse = {
  message: string;
};

export default function VerifyEmailPage() {
  const params = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email/${params.token}`);
        
        const data: ApiResponse = await response.json();
        
        setStatus(response.ok ? 'success' : 'error');
        setMessage(data.message);
      } catch (error) {
        setStatus('error');
        setMessage('Network error occurred');
      }
    };

    if (params.token && !verificationAttempted.current) {
      verificationAttempted.current = true;
      verifyEmail();
    }
  }, [params.token]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
        <div className="min-h-screen flex flex-col justify-center items-center px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 bg-white/60 rounded-full mx-auto" />
            <div className="h-8 bg-white/60 rounded-lg mx-auto w-3/4" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
      <div className="min-h-screen flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-md text-center space-y-6">
          {status === 'success' ? (
            <>
              <div className="bg-white/60 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Success!
                </h1>
                <p className="text-sm text-gray-600">
                  {message}
                </p>
              </div>
              <Button
                asChild
                className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
              >
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            </>
          ) : (
            <>
              <div className="bg-white/60 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Verification Failed
                </h1>
                <p className="text-sm text-gray-600">
                  {message}
                </p>
              </div>
              <Button
                asChild
                className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
              >
                <Link href="/auth/login">
                  Return to Login
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}