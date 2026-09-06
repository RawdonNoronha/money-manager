"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth, provider } from "@/app/firebase/firebase"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from '@/components/ui/toast'
import { useRouter } from "next/navigation";

const SignInPage = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const signIn = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast.add({
                    type: "success",
                    title: `${user.displayName} Signed In`,
                    description: "You have successfully signed in to your account.",
                })
                router.push('/dashboard')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.add({
                    type: "error",
                    title: `Sign In Failed ${errorCode}`,
                    description: errorMessage,
                })
            });
    }

    const signInWithGoogle = (auth: any, provider: any) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                toast.add({
                    type: "success",
                    title: `${user.displayName} Signed In`,
                    description: "You have successfully signed in to your account.",
                })
                router.push('/dashboard')
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                toast.add({
                    type: "error",
                    title: `Sign In Failed ${errorCode}`,
                    description: errorMessage,
                })
            });
    }

    return (
        <div className="align-center flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={() => router.push('/sign-up')}>
                            Sign Up
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" onClick={() => signIn(email, password)}>
                        Login
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => signInWithGoogle(auth, provider)}>
                        Login with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignInPage