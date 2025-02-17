'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfileCreatedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
      <div className="min-h-screen flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="bg-white/60 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Created Successfully!
            </h1>
            <p className="text-sm text-gray-600">
              Your profile has been set up and you're ready to start matching
            </p>
          </div>
          <Button
            asChild
            className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
          >
            <Link href="/auth/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}