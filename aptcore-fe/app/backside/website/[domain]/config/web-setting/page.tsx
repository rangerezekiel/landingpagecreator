'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useDomain } from "@/app/_providers/DomainContext"
import { keyData, keyDataUpdate } from "@/app/_services/websiteSetting"
import { formatLabel } from "@/app/_utils/objectTransformers"
import LoadingContent from "@/components/element/loading-section"
import SpinnerCaption from "@/components/element/spinner-caption"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { ArrowBigLeft } from 'lucide-react';
import DomainTitle from "@/components/element/domain-title"

const moduleTitle = 'Website Setting'

export default function WebsiteConfigWebSetting() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [keys, setKeys] = useState<Record<string, string>>({})

    const form = useForm<{ [key: string]: string }>({
        defaultValues: {},
    })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await keyData(domain)
        const raw = res.data as unknown as Record<string, string | null>
        // A setting with no value comes back as null, which would make its input
        // uncontrolled and warn on first keystroke. Blank it out instead.
        const data = Object.fromEntries(
          Object.entries(raw ?? {}).map(([key, value]) => [key, value ?? ""])
        ) as Record<string, string>
        setKeys(data)
        form.reset(data)
      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
            setLoading(false)
        }, 300)
      }
    }
    fetchData()
  }, [domain, form])

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Website Config', href: `/backside/website/${domain}/config` },
      { label: moduleTitle },
    ])
  }, [setBreadcrumbs, domain])

  const onSubmit = async (payload: { [key: string]: string }) => {
      setLoadingSave(true)
      try {
        const res = await keyDataUpdate(domain, payload)
        if (res.status === 200) {
            toast.success('Update data successfully');
        } else {
            toast.warning('Update data failed');
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingSave(false)
      }
  }

  const backToWebsite = () => {
    router.push(`/backside/website/${domain}/config`);
  }

  return (
    <div className="lg:px-0 px-5 pb-5">
        <DomainTitle domain={domain} loading={loading} />
        <h1 className="mb-6 text-2xl font-bold text-center">{moduleTitle}</h1>

        <div className="container max-w-full sm:max-w-4xl mx-auto">
            {loading || !keys ? (
                <LoadingContent />
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                {Object.keys(keys).map((key) => (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={key}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{formatLabel(key)}</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder={key} disabled={loadingSave} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => backToWebsite()}>
                                    <ArrowBigLeft />Back to Sections
                                </Button>

                                <Button type="submit" disabled={loadingSave}>
                                    <SpinnerCaption loading={loadingSave} loadingValue="Saving.." defaultValue="Save Changes" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            )}
        </div>
    </div>
  )
}
