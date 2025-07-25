import { SecondaryBodyBackground } from '@/client/components/SecondaryBodyBackground'
import { Text } from '@/client/components/Text'
import { SignInForm } from './SignInForm'

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Text className="text-gray-900" variant="h1">
                        Sign in to your account
                    </Text>
                    <Text className="mt-2 text-gray-600">
                        Enter your credentials below to access your account
                    </Text>
                </div>
                <SignInForm />
                <SecondaryBodyBackground />
            </div>
        </div>
    )
}
