'use client'

import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState, useCallback } from "react"
import { Website as ThisType } from "@/app/_types/website"
import { updateData as updateDataApi } from "@/app/_services/website"
import { FetchApiResponse } from "@/app/_types/fetch"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import ThisFields, { formSchema } from "@/app/backside/website/_fields"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoadingSection from "@/components/element/loading-section"
import { toast } from "sonner"
import { storageUrl } from "@/app/_utils/objectTransformers"
import { toastAndLog } from '@/lib/activity-log/client'
import SpinnerCaption from "@/components/element/spinner-caption"
import { useRouter } from "next/navigation"

export default function WebsiteConfigDetail() {
  const { domain } = useDomain()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingShow, setLoadingShow] = useState(true)
  const [websiteData, setWebsiteData] = useState<ThisType | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [favicon, setFavicon] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      title: "",
      theme: "T01",
      metaTitle: "",
      metaDescription: "",
      apiKey: "",
    },
  })

  const fetchWebsiteData = useCallback(async () => {
    setLoadingShow(true)
    try {
      // Get token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/${domain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      })

      const data = await response.json()
      
      if (response.status === 200 && data) {
        setWebsiteData(data)
        form.reset({
          domain: data.domain ?? "",
          title: data.title ?? "",
          theme: data.theme ?? "T01",
          metaTitle: data.metaTitle ?? "",
          metaDescription: data.metaDescription ?? "",
          apiKey: data.apiKey ?? "",
        })
      } else {
        toast.error("Failed to fetch website data")
      }
    } catch (err) {
      console.error("Error fetching website data:", err)
      toast.error("Failed to fetch website data")
    } finally {
      setLoadingShow(false)
    }
  }, [domain, form])

  useEffect(() => {
    if (domain) {
      fetchWebsiteData()
    }
  }, [domain, fetchWebsiteData])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!websiteData?.id) {
      toast.error("Website data not found")
      return
    }

    setLoading(true)
    try {
      const payload = { ...values, logo, favicon } as unknown as ThisType
      const updateData = await updateDataApi(websiteData.id, payload) as FetchApiResponse<ThisType>
      
      // Toast and Log START
      const LogInfo = {
        success: updateData.status === 200,
        module: 'WEBSITE',
        action: 'UPDATE',
        msg: 'UPDATED',
        title: values.domain ?? null,
        payload: { ...values },
        payloadFailed: { ...values },
      }

      await toastAndLog(LogInfo)
      // Toast and Log END

      if (updateData.status === 200) {
        toast.success("Website updated successfully")
        
        // Check if domain has changed
        if (values.domain !== domain) {
          // Redirect to new domain URL
          router.push(`/backside/website/${values.domain}/config`)
        } else {
          // Refresh the data if domain hasn't changed
          await fetchWebsiteData()
        }
      } else {
        toast.error("Failed to update website")
      }
    } catch (err) {
      console.error("Error updating website:", err)
      toast.error("Failed to update website")
    } finally {
      setLoading(false)
    }
  }

  if (loadingShow) {
    return <LoadingSection />
  }

  return (
    <div className="w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Website Details</CardTitle>
          <CardDescription>
            Update your website information, theme, and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ThisFields 
                control={form.control} 
                loading={loading}
                onCropLogo={setLogo} 
                onCropFavicon={setFavicon}
                imageDefaultLogo={storageUrl(websiteData?.logo ?? "")}
                imageDefaultFavicon={storageUrl(websiteData?.favicon ?? "")}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  <SpinnerCaption 
                    loading={loading} 
                    loadingValue="Saving..." 
                    defaultValue="Save Changes" 
                  />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
