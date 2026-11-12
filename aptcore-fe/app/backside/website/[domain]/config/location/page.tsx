'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import WebsiteConfigLocationHighlight from "./_highlight/page"
import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState } from "react"
import DomainTitle from "@/components/element/domain-title"
import { indexData } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { LocationContent, Section } from "@/app/_types/section"
import { LocationPayload as ThisType } from "@/app/_types/section"
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
import WebsiteConfigLocationList from "./_list/page"
import { toastAndLog } from "@/lib/activity-log/client"
import UpdateDialog from "@/components/dialog/update-dialog"

const moduleTitle = 'Location'
const thisSection = 'LOCATION'
const updateConfirm = true

const formSchema = z.object({
    title: z.string().min(3, "Title must have at least 3 characters"),
    buttonLink: z.string().min(1, "Button Link must have at least 1 characters"),
    buttonTitle: z.string().min(3, "Button Title must have at least 3 characters"),
})

export default function WebsiteConfigLocation() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [detailData, setDetailData] = useState<LocationContent | null>(null)
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
        buttonTitle: "",
        buttonLink: "",
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
                setDetailData(data as unknown as LocationContent)
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
    }, [domain])

    useEffect(() => {
        if (detailData) {
            form.reset({
                title: detailData?.details?.TITLE?.value ?? "",
                buttonLink: detailData?.details?.BUTTON?.jsonValue.LINK ?? "",
                buttonTitle: detailData?.details?.BUTTON?.jsonValue.TITLE ?? "",
            });
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
            const payload = { ...values, sectionType: thisSection } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload) as unknown as FetchApiResponse<ThisType>;
            
            // Toast and Log START
            const payloadLog: Partial<typeof values> = { ...values };
            const LogInfo = {
                success: updateData.status === 200,
                module : 'LOCATION',
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
                    <TabsTrigger value="highlight">Highlight</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
                <TabsContent value="index" className="p-5 border border-t-0 rounded-b">
                            
                    {loading ? (
                        <LoadingContent />
                    ) : (
                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(openConfirmation)} className="space-y-5">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Register for VVIP Access" disabled={loadingSave} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <div className="flex gap-5 w-full">
                                            <FormField
                                                control={form.control}
                                                name="buttonTitle"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                    <FormLabel>Button Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Book Showflat Viewing Today" disabled={loading} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                            control={form.control}
                                            name="buttonLink"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                <FormLabel>Button Link</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="#contact" disabled={loading} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        </div>

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
                    <UpdateDialog
                        open={openUpdateDialog}
                        loading={loadingUpdate}
                        onConfirm={handleConfirmUpdate}
                        title={moduleTitle}
                        onClose={() => setOpenUpdateDialog(false)}
                    />
                </TabsContent>
                <TabsContent value="highlight" className="p-5 border border-t-0 rounded-b">
                    <WebsiteConfigLocationHighlight />
                </TabsContent>
                <TabsContent value="list" className="p-5 border border-t-0 rounded-b">
                    <WebsiteConfigLocationList />
                </TabsContent>
            </Tabs>

        </div>
    </div>
  )
}
