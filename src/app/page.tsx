/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  CreditCard,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Navigation } from "@/components/layouts/Navigation";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (session) {
    return <AuthenticatedHomepage session={session} />;
  }

  return <UnauthenticatedHomepage />;
}

function AuthenticatedHomepage({ session }: { session: any }) {
  const isManager = session.user.role === "manager";
  const dashboardLink = isManager ? "/dashboard/manager" : "/dashboard/member";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {session.user.name || session.user.email}!
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge
              variant={isManager ? "default" : "secondary"}
              className="text-sm"
            >
              {session.user.role}
            </Badge>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isManager
              ? "Manage your organization's contributions, track member payments, and oversee the entire system."
              : "Track your share commitments, make payments, and monitor your contribution progress."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {isManager ? "Manage Shares" : "My Shares"}
              </CardTitle>
              <CardDescription>
                {isManager
                  ? "Configure share pricing and view all commitments"
                  : "View and manage your share commitments"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={
                  isManager
                    ? "/dashboard/manager/shares"
                    : "/dashboard/member/shares"
                }
              >
                <Button className="w-full">
                  View Shares <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payments
              </CardTitle>
              <CardDescription>
                {isManager
                  ? "Track all member payments and outstanding balances"
                  : "Make payments and view your payment history"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={
                  isManager
                    ? "/dashboard/manager/payments"
                    : "/dashboard/member/payments"
                }
              >
                <Button className="w-full bg-transparent" variant="outline">
                  {isManager ? "View All Payments" : "Make Payment"}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {isManager && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Invite new members and manage user roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/manager/users">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Users <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dashboard Link */}
        <div className="text-center">
          <Link href={dashboardLink}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function UnauthenticatedHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="font-semibold text-gray-900">
                Contribution Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Contribution Management
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline member contributions, track payments, and manage share
            commitments with our intuitive platform designed for organizations
            and their members.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with role-based access control
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Tracking</CardTitle>
              <CardDescription>
                Automated payment tracking and outstanding balance alerts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Easy Management</CardTitle>
              <CardDescription>
                Intuitive dashboards for both managers and members
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Flexible Payment Plans</h3>
                <p className="text-gray-600">
                  Members can make partial or full payments with flexible
                  scheduling
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Real-time Dashboards</h3>
                <p className="text-gray-600">
                  Live updates on contributions, payments, and member activity
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Email Invitations</h3>
                <p className="text-gray-600">
                  Seamless onboarding with secure email invitation system
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Role-based Access</h3>
                <p className="text-gray-600">
                  Managers and members see exactly what they need to see
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
