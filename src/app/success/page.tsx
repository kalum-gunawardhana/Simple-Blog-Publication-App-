'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
    const { user, isSubscribed } = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Give some time for the webhook to process
        const timer = setTimeout(() => {
            setLoading(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700">
                        Payment Successful!
                    </CardTitle>
                    <CardDescription>
                        {loading
                            ? 'Processing your subscription...'
                            : isSubscribed
                                ? 'Your premium subscription is now active.'
                                : 'Your payment has been processed successfully.'
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {isSubscribed && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-center gap-2 text-yellow-800">
                                        <Crown className="h-5 w-5" />
                                        <span className="font-medium">Premium Member</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Link href={isSubscribed ? "/premium" : "/posts"}>
                                    <Button className="w-full">
                                        {isSubscribed ? 'Explore Premium Content' : 'Browse Posts'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>

                                <Link href="/dashboard">
                                    <Button variant="outline" className="w-full">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}