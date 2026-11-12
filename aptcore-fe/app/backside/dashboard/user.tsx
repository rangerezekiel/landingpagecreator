'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  FileText,
  FileCheck,
  LayoutDashboard,
  Activity,
  Calendar,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { setInitialName } from "@/app/_utils/objectTransformers"
import { useGlobalContext } from "@/app/_providers/GlobalContextProvider"
import { useMemo, useEffect, useState } from "react"
import { indexData } from "@/app/_services/dashboard";
import { FetchApiResponse } from "@/app/_types/fetch";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type ThisType = {
  totalUser: number;
  totalWebsite: number;
  totalSubmission: number;
  totalSubmissionUnread: number;
  websiteSubmissionCounts?: Array<{
    title: string;
    totalSubmissions: number;
    unreadSubmissions: number;
    websiteId?: string;
  }>;
  recentUnreadSubmissions?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    createdAt: string;
    websiteId?: string;
    website: {
      title: string;
      domain: string;
    };
  }>;
};

export default function DashboardUser() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ThisType | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await indexData() as unknown as FetchApiResponse<ThisType>
        if (res.status === 200 && res.data) {
          setData(res.data)
        } else {
          toast.error("Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
        toast.error("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats()
  }, [])

  const greetingMessage = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  const context = useGlobalContext()
  const authUser = context?.user

  const displayedUser = useMemo(() => ({
    fullName: authUser?.fullName,
    email: authUser?.email,
    avatar: authUser?.avatar,
    username: authUser?.username,
    phone: authUser?.phone,
  }), [authUser])

  const stats = [
    {
      title: "Unread Submissions",
      value: data?.totalSubmissionUnread ?? 0,
      icon: FileText,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      change: "+12%",
      changeType: "increase" as const,
      link: "/backside/form-submission#unread",
    },
    {
      title: "Total Submissions",
      value: data?.totalSubmission ?? 0,
      icon: FileCheck,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: "+8%",
      changeType: "increase" as const,
      link: "/backside/form-submission",
    },
    {
      title: "Total Websites",
      value: data?.totalWebsite || 0,
      icon: LayoutDashboard,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+3%",
      changeType: "increase" as const,
      link: "/backside/website",
    },
  ]

  const filteredWebsiteSubmissionCounts = useMemo(() => {
    return data?.websiteSubmissionCounts?.map(count => ({
      title: count.title,
      totalSubmissions: count.totalSubmissions,
      unreadSubmissions: count.unreadSubmissions,
    })) || [];
  }, [data?.websiteSubmissionCounts]);

  const filteredRecentUnreadSubmissions = useMemo(() => {
    return data?.recentUnreadSubmissions?.map(submission => ({
      ...submission,
      website: {
        title: submission.website?.title || "N/A",
        domain: submission.website?.domain || "N/A",
      },
    })) || [];
  }, [data?.recentUnreadSubmissions]);

  return (
    <div className="min-h-screen transition-colors">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here&apos;s what&apos;s happening with your submissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-300 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-20 w-20 rounded-full shadow-lg border-4 border-white/20">
                {displayedUser?.avatar ? (
                  <AvatarImage
                    src={displayedUser.avatar}
                    alt={displayedUser.fullName ?? ""}
                  />
                ) : (
                  <AvatarFallback className="rounded-full bg-white/20 text-white text-2xl font-semibold">
                    {displayedUser?.fullName
                      ? setInitialName(displayedUser.fullName)
                      : ""}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {greetingMessage}, {displayedUser?.fullName?.split(" ")[0] ?? "there"} 👋
                </h2>
                <p className="text-blue-100 mt-1">{displayedUser?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {displayedUser?.username}
                  </Badge>
                  {displayedUser?.phone && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {displayedUser.phone}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Card key={i} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300">
                    <a href={stat.link} className="w-full h-full">
                      <CardContent className="px-6 py-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <div className="">
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {stat.value.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {stat.title}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </a>
                  </Card>
                );
              })}
        </div>

        {/* Website Submission Counts Chart */}
        {filteredWebsiteSubmissionCounts.length > 0 && (
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Form Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredWebsiteSubmissionCounts}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="title" 
                    className="dark:text-gray-300"
                    stroke="#6b7280"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    className="dark:text-gray-300"
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar 
                    dataKey="totalSubmissions" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Total Submissions"
                  />
                  <Bar 
                    dataKey="unreadSubmissions" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Unread Submissions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Unread Submissions */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Unread Form Submissions 
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRecentUnreadSubmissions && filteredRecentUnreadSubmissions.length > 0 ? (
              <div className="space-y-4">
                {filteredRecentUnreadSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {submission.name}
                        </span>
                        <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                          {submission.website.title}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700">
                          {submission.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {submission.email} • {submission.phone}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {submission.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {submission.website.domain}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No unread submissions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
