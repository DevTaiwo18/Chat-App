'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('https://chat-app-api-4srj.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
        
            const data = await response.json();
            console.log(data);
            
        
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
        
            localStorage.setItem('token', data.token);
            router.push('/auth/verify-email-sent');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full">
            <div className="space-y-4">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    className="w-full h-12 bg-white/60 border-none"
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    className="w-full h-12 bg-white/60 border-none"
                />
                <p className="text-xs text-gray-500">
                    Password must be at least 8 characters
                </p>
            </div>
            
            {error && (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                    {error}
                </p>
            )}
            
            <Button
                type="submit"
                className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/auth/login" className="text-[#FF6B6B]">
                    Sign In
                </Link>
            </div>
        </form>
    );
}