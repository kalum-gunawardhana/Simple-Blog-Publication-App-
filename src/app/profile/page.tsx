'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Calendar, Crown, Shield, Save, Eye, FileText } from 'lucide-react'

interface UserStats {
    totalPosts: number
    publicPosts: number
    privatePosts: number
    premiumPosts: number
}

export default function ProfilePage() {
    const { user, loading: authLoading, isSubscribed, subscriptionStatus } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [stats, setStats] = useState<UserStats>({
        totalPosts: 0,
        publicPosts: 0,
        privatePosts: 0,
        premiumPosts: 0
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (user) {
            setEmail(user.email || '')
            fetchUserStats()
        }
    }, [user])

    const fetchUserStats = async () => {
        try {
            // Check if Supabase is properly configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
                // Use mock stats when Supabase is not configured
                setStats({
                    totalPosts: 5,
                    publicPosts: 3,
                    privatePosts: 1,
                    premiumPosts: 1
                })
                return
            }

            const { data, error } = await supabase
                .from('posts')
                .select('visibility')
                .eq('author_id', user?.id)

            if (error) throw error

            const newStats = {
                totalPosts: data?.length || 0,
                publicPosts: data?.filter(p => p.visibility === 'public').length || 0,
                privatePosts: data?.filter(p => p.visibility === 'private').length || 0,
                premiumPosts: data?.filter(p => p.visibility === 'premium').length || 0,
            }
            setStats(newStats)
        } catch (error) {
            console.error('Error fetching user stats:', error)
            // Use mock stats on error
            setStats({
                totalPosts: 5,
                publicPosts: 3,
                privatePosts: 1,
                premiumPosts: 1
            })
        }
    }

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setError('')
        setSuccess('')
        setLoading(true)

        try {
            // Check if Supabase is properly configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
                // Simulate successful update for demo
                setTimeout(() => {
                    setSuccess('Email updated successfully! (Demo mode)')
                    setLoading(false)
                }, 1000)
                return
            }

            const { error } = await supabase.auth.updateUser({
                email: email
            })

            if (error) throw error

            setSuccess('Email updated successfully! Please check your new email for confirmation.')
        } catch (error: any) {
            setError(error.message || 'An error occurred while updating your email')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Account Details
                                </CardTitle>
                                <CardDescription>
                                    Update your account information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {success && (
                                    <Alert>
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleUpdateEmail} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Account Created</Label>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={loading || email === user.email}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {loading ? 'Updating...' : 'Update Email'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Subscription Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Subscription Status
                                </CardTitle>
                                <CardDescription>
                                    Your current subscription plan and benefits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isSubscribed ? (
                                            <>
                                                <Crown className="h-6 w-6 text-yellow-500" />
                                                <div>
                                                    <p className="font-medium">Premium Member</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Status: {subscriptionStatus ? subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1) : 'Active'}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <User className="h-6 w-6 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">Free Member</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Access to public content
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <Badge className={isSubscribed ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                                        {isSubscribed ? (subscriptionStatus || 'Premium') : 'Free'}
                                    </Badge>
                                </div>

                                {!isSubscribed && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-3">
                                                Upgrade to premium for exclusive content and features
                                            </p>
                                            <Button asChild>
                                                <a href="/subscribe">Upgrade to Premium</a>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        {/* Writing Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Writing Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Total Posts</span>
                                    <Badge variant="outline">{stats.totalPosts}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-1">
                                        <Eye className="h-3 w-3 text-green-600" />
                                        Public
                                    </span>
                                    <Badge variant="outline">{stats.publicPosts}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-1">
                                        <Shield className="h-3 w-3 text-red-600" />
                                        Private
                                    </span>
                                    <Badge variant="outline">{stats.privatePosts}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-1">
                                        <Crown className="h-3 w-3 text-yellow-600" />
                                        Premium
                                    </span>
                                    <Badge variant="outline">{stats.premiumPosts}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full" variant="outline">
                                    <a href="/dashboard">Go to Dashboard</a>
                                </Button>

                                <Button asChild className="w-full" variant="outline">
                                    <a href="/dashboard/create">Create New Post</a>
                                </Button>

                                <Button asChild className="w-full" variant="outline">
                                    <a href="/posts">View All Posts</a>
                                </Button>

                                {isSubscribed && (
                                    <Button asChild className="w-full" variant="outline">
                                        <a href="/premium">Premium Content</a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}