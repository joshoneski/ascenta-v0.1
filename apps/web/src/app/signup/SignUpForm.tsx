'use client'

import { clientAuth } from '@/client/client-auth'
import { Alert, AlertDescription } from '@/client/components/ui/alert'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter } from '@/client/components/ui/card'
import { Input } from '@/client/components/ui/input'
import { Label } from '@/client/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'

export function SignUpForm() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string

        try {
            const { error, success } = await clientAuth.signUpWithEmailPassword(
                email,
                password,
                name
            )
            if (success) {
                router.push('/organisations')
            } else {
                setError(error?.message ?? 'Unable to signup.')
            }
        } catch (err) {
            setError('An error occurred during sign up. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4 pt-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="**********"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Sign up'}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="text-primary font-medium hover:underline"
                        >
                            Sign in
                        </a>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
