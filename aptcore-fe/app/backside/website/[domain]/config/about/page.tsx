'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState } from "react"
import DomainTitle from "@/components/element/domain-title"
import { indexData } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { AboutContent, Section } from "@/app/_types/section"
import { AboutPayload as ThisType } from "@/app/_types/section"
import { updateDataApi } from "@/app/_services/section"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import z from "zod"
import LoadingContent from "@/components/element/loading-section"
import { Input } from "@/components/ui/input"
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
import RichTextEditor from "@/components/tiptap/rich-text-editor"
import { toastAndLog } from "@/lib/activity-log/client"
import UpdateDialog from "@/components/dialog/update-dialog"

const moduleTitle = 'About'
const thisSection = 'ABOUT'
const updateConfirm = true

const formSchema = z.object({
    content: z
    .string({
        required_error: 'Content is required',
    })
    .refine(
        (val) => val.replace(/<[^>]*>/g, '').replace(/\s/g, '').length >= 3,
        { message: 'Content must contain at least 3 characters of text' }
    ),
    title: z.string().min(3, "Title must have at least 3 characters"),
    image: z.string().optional().nullable()
})

export default function WebsiteConfigAbout() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [detailData, setDetailData] = useState<AboutContent | null>(null)
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
        title: "",
        content: "",
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
                setDetailData(data as unknown as AboutContent)
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
            form.reset({
                title: detailData?.details?.TITLE?.value ?? "",
                content: detailData?.details?.CONTENT?.value ?? "",
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
            const payload = { ...values, sectionType: 'ABOUT', image: image } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload) as unknown as FetchApiResponse<ThisType>;
            
            // Toast and Log START
            const payloadLog: Partial<typeof values> = { ...values };
            if (payloadLog.image !== "") {
                delete payloadLog.image;
            }
            const LogInfo = {
                success: updateData.status === 200,
                module : 'ABOUT',
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
            {loading ? (
                <LoadingContent />
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(openConfirmation)}>
                            <div className="mb-5 space-y-5">
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
                                <div className="w-full">
                                    <ImageCropper
                                        title="Image"
                                        ASPECT_RATIO={16/9}
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
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <RichTextEditor value={field.value} onChange={field.onChange} disabled={loadingSave} />
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
                            </div>
                            <div className="flex justify-end gap-3 pb-10">
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
