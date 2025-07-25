import { createAuthClient } from 'better-auth/react'

const authClient = createAuthClient()

async function signInWithEmailPassword(email: string, password: string) {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
    })

    if (data) {
        return {
            success: true,
        }
    } else {
        return {
            success: false,
            error: {
                message: error.message,
            },
        }
    }
}

async function signUpWithEmailPassword(
    email: string,
    password: string,
    name: string
) {
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
    })

    if (data) {
        return {
            success: true,
        }
    } else {
        return {
            success: false,
            error: {
                message: error.message,
            },
        }
    }
}

async function signOut() {
    await authClient.signOut()
}

export const clientAuth = {
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signOut,
}
