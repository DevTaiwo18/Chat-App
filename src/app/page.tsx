import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-pink-50 to-pink-100 p-8">
      <div className="w-full max-w-md text-center space-y-12">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold">
            Heart<span className="text-[#FF6B6B]">Link</span>
          </h1>
          <p className="text-gray-600 text-xl">
            Find love, make connections
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full">
          <Button 
            asChild
            className="w-full h-14 text-lg bg-[#FF6B6B] hover:bg-[#ff5252] rounded-xl"
          >
            <Link href="/auth/register">
              Create Account
            </Link>
          </Button>

          <Button 
            asChild
            variant="outline"
            className="w-full h-14 text-lg rounded-xl"
          >
            <Link href="/auth/login">
              Sign In
            </Link>
          </Button>
        </div>

        {/* Features List */}
        <div className="space-y-4 text-lg">
          <div className="flex items-center justify-center space-x-2">
            <span>✨</span>
            <span className="text-gray-700">Match with like-minded people</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>🔒</span>
            <span className="text-gray-700">Safe and secure</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>💝</span>
            <span className="text-gray-700">Find meaningful connections</span>
          </div>
        </div>
      </div>
    </main>
  );
}