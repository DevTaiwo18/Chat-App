'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
      <div className="fixed top-12 left-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Link>
      </div>

      <div className="min-h-screen flex flex-col justify-center px-6">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-600">
            Join HeartLink and find your perfect match
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}