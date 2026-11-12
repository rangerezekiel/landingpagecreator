'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import WebsiteConfigFAQList from "./_list/page"
import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState } from "react"
import DomainTitle from "@/components/element/domain-title"
import { indexData } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { FAQContent, Section } from "@/app/_types/section"
import { FAQPayload as ThisType } from "@/app/_types/section"
import { updateDataApi } from "@/app/_services/section"
import { Form } from "@/components/ui/form"
import z from "zod"
import LoadingContent from "@/components/element/loading-section"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ArrowBigLeft } from "lucide-react"
import SpinnerCaption from "@/components/element/spinner-caption"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import ImageCropper from "@/components/image-cropper"
import InputValidation from "@/components/element/errors/input-validation"
import { storageUrl } from "@/app/_utils/objectTransformers"
import AlertValidations from "@/components/element/errors/alert-validations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toastAndLog } from "@/lib/activity-log/client"
import UpdateDialog from "@/components/dialog/update-dialog"

const moduleTitle = 'FAQ'
const thisSection = 'FAQ'
const updateConfirm = true

const formSchema = z.object({
    image: z.string().optional().nullable()
})

export default function WebsiteConfigFAQ() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [detailData, setDetailData] = useState<FAQContent | null>(null)
    const [loadingSave, setLoadingSave] = useState(false)
    const [errorMsg, setErrorMsg] = useState<ValidationError>();
    const [image, setImage] = useState<string | null>(null);
    const [imageDefault, setImageDefault] = useState<string | null>(null);
    // Set breadcrumbs
    useEffect(() => {
        setBreadcrumbs([
        { label: 'Website Config', href: `/backside/website/${domain}/config` },
        { label: moduleTitle },
        ])
    }, [setBreadcrumbs, domain])

    const mappedInitialData = {
        image: "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    });
    const { setValue, formState: { errors } } = form
  
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await indexData(domain, thisSection) as unknown as FetchApiResponse<Section>
                const data = res.data
                setDetailData(data as unknown as FAQContent)
                setImageDefault(data?.details?.IMAGE?.value ? storageUrl(data?.details?.IMAGE?.value) : "")
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
            form.reset();
        }
    }, [detailData, form]);

    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleConfirmUpdate = async () => {
        setOpenUpdateDialog(false);
        setLoadingUpdate(true);
        await onUpdate();
        setLoadingUpdate(false);
    }

    const openConfirmation = () => {
        if (updateConfirm) {
            setOpenUpdateDialog(true);
        } else {
            onUpdate();
        }
    }

    async function onUpdate() {
        setLoadingSave(true);
        try {
            const payload = { sectionType: 'FAQ', image: image } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload) as unknown as FetchApiResponse<ThisType>;
            
            const LogInfo = {
                success: updateData.status === 200,
                module : 'FAQ',
                action : 'UPDATE',
                msg : 'UPDATED',
                title: null,
                payload : {image: 'updated'},
                payloadFailed : {image: 'updated'},
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
                                        <div className="w-full">
                                            <ImageCropper
                                                title="Image"
                                                ASPECT_RATIO={10/13}
                                                imageDefault={imageDefault ?? ""}
                                                onCrop={(base64) => {
                                                    setValue("image", base64, { shouldValidate: true })
                                                    setImage(base64)
                                                }}
                                                EXPORT_IMAGE_FORMAT="image/webp"
                                                isError={errors.image?.message as string}
                                            />
                                            {errors.image && (
                                            <InputValidation error={errors.image.message as string} />
                                            )}
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
                </TabsContent>
                <TabsContent value="list" className="p-5 border border-t-0 rounded-b">
                    <WebsiteConfigFAQList />
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
