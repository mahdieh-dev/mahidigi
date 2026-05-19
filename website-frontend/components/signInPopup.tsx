"use client"

import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { User } from 'lucide-react'
import { useAtom } from 'jotai'
import { accountMenuOpenAtom } from '@/store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
import { Input } from './ui/input'

function SignInPopup() {
    const [accountMenuOpen, setAccountMenuOpen] = useAtom(accountMenuOpenAtom)
    const handleOnClickAccountMenu = () => {
        setAccountMenuOpen(prev => !prev)
    }

    return (
        <Dialog open={accountMenuOpen} onOpenChange={handleOnClickAccountMenu}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size="icon" className='lg:flex' onClick={handleOnClickAccountMenu} >
                    <User size={24} />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-106.25'>
                <DialogTitle className='heading text-center'>Login/SingUp</DialogTitle>
                <Card>
                    <Tabs defaultValue='login'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value='login'>
                            <form>
                                <CardHeader>
                                    <CardTitle>Login</CardTitle>
                                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4 mt-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='email-login'>Email</Label>
                                        <Input id="email-login" name="email" type='email' placeholder='m@example.com' required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='password-login'>Password</Label>
                                        <Input id="password-login" name="password" type='password' required />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type='submit' className='w-full mt-4'>Login</Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                        <TabsContent value='signup'>
                            <form>
                                <CardHeader>
                                    <CardTitle>Sign Up</CardTitle>
                                    <CardDescription>Fill in the form to signup.</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4 mt-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='name'>Name</Label>
                                        <Input id="name" name="name" type='name' placeholder='John Doe' required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='email-signup'>Email</Label>
                                        <Input id="email-signup" name="email" type='email' placeholder='m@example.com' required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='password-signup'>Password</Label>
                                        <Input id="password-signup" name="password" type='password' required />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type='submit' className='w-full mt-4'>Sign Up</Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default SignInPopup
