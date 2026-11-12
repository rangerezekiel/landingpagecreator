'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import WebsiteConfigWhatIsNextList from "./_list/page"
import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState } from "react"
import DomainTitle from "@/components/element/domain-title"
import { indexData } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { WhatIsNextContent, Section } from "@/app/_types/section"
import { WhatIsNextPayload as ThisType } from "@/app/_types/section"
import { updateDataApi } from "@/app/_services/section"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import z from "zod"
import LoadingContent from "@/components/element/loading-section"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ArrowBigLeft } from "lucide-react"
import SpinnerCaption from "@/components/element/spinner-caption"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import AlertValidations from "@/components/element/errors/alert-validations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toastAndLog } from "@/lib/activity-log/client"
import UpdateDialog from "@/components/dialog/update-dialog"

const moduleTitle = 'What Is Next'
const thisSection = 'WHAT_IS_NEXT'
const updateConfirm = true

const formSchema = z.object({
    title: z.string().min(3, "Title must have at least 3 characters"),
})

export default function WebsiteConfigWhatIsNext() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [detailData, setDetailData] = useState<WhatIsNextContent | null>(null)
    const [loadingSave, setLoadingSave] = useState(false)
    const [errorMsg, setErrorMsg] = useState<ValidationError>();
    // Set breadcrumbs
    useEffect(() => {
        setBreadcrumbs([
        { label: 'Website Config', href: `/backside/website/${domain}/config` },
        { label: moduleTitle },
        ])
    }, [setBreadcrumbs, domain])

    const mappedInitialData = {
        title: "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    });
  
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await indexData(domain, thisSection) as unknown as FetchApiResponse<Section>
                const data = res.data
                setDetailData(data as unknown as WhatIsNextContent)
            } catch (error) {
                console.error(error)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 300)
            }
        }
        if(domain){
        fetchData()
        }
    }, [detailData?.details?.TITLE?.value, domain])

    useEffect(() => {
        if (detailData) {
            form.reset(
                {
                    title: detailData?.details?.TITLE?.value ?? "",
                }
            );
        }
    }, [detailData, form]);


    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleConfirmUpdate = async () => {
        setOpenUpdateDialog(false);
        setLoadingUpdate(true);
        await onUpdate(form.getValues());
        setLoadingUpdate(false);
    }

    const openConfirmation = () => {
        if (updateConfirm) {
            setOpenUpdateDialog(true);
        } else {
            onUpdate(form.getValues());
        }
    }

    async function onUpdate(values: z.infer<typeof formSchema>) {
        setLoadingSave(true);
        try {
            const payload = { ...values, sectionType: 'WHAT_IS_NEXT' } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload) as unknown as FetchApiResponse<ThisType>;

            // Toast and Log START
            const payloadLog: Partial<typeof values> = { ...values };
            const LogInfo = {
                success: updateData.status === 200,
                module : 'WHAT_IS_NEXT',
                action : 'UPDATE',
                msg : 'UPDATED',
                title: payloadLog.title ?? null,
                payload : payloadLog,
                payloadFailed : payloadLog,
            }
    
            await toastAndLog(LogInfo)
            // Toast and Log END

            if (updateData.status === 200) {
                setErrorMsg(undefined);
            } else {
                setErrorMsg(updateData.error as ValidationError);
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingSave(false)
        }
    }
      
    const backToWebsite = () => {
        router.push(`/backside/website/${domain}/config`);
    }
  return (
    <div className="lg:px-0 px-5 pb-5">
        <DomainTitle domain={domain}/>
        <h1 className="mb-6 text-2xl font-bold text-center">{moduleTitle}</h1>

        <div className="container max-w-full sm:max-w-4xl mx-auto">
            <Tabs defaultValue="index" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="index">Index</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
                <TabsContent value="index" className="p-5 border border-t-0 rounded-b">
                            
                    {loading ? (
                        <LoadingContent />
                    ) : (
                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(openConfirmation)}>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                            <Input placeholder="What Is Next Title" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                        {errorMsg && 
                                        (
                                            <>
                                            <AlertValidations {...errorMsg} />
                                            </>
                                        )
                                        }
                                    <div className="flex justify-end gap-3 mt-5">
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
                </TabsContent>
                <TabsContent value="list" className="p-5 border border-t-0 rounded-b">
                    <WebsiteConfigWhatIsNextList />
                </TabsContent>
            </Tabs>

        </div>
        
        <UpdateDialog
            open={openUpdateDialog}
            loading={loadingUpdate}
            onConfirm={handleConfirmUpdate}
            title={moduleTitle}
            onClose={() => setOpenUpdateDialog(false)}
        />
    </div>
  )
}
