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
import { auth } from "@/app/firebase/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from '@/components/ui/toast'
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const signUp = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                toast.add({
                    type: "success",
                    title: "User Created",
                    description: "You have successfully created an account.",
                })
                router.push('/dashboard')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.add({
                    type: "error",
                    title: `Sign Up Failed ${errorCode}`,
                    description: errorMessage,
                })
            });
    }

    return (
        <div className="align-center flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign up for an account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to create an account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={() => router.push('/sign-in')}>
                            Sign In
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
                    <Button type="submit" className="w-full" onClick={() => signUp(email, password)}>
                        Sign Up
                    </Button>
                    <Button variant="outline" className="w-full">
                        Sign Up with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default page