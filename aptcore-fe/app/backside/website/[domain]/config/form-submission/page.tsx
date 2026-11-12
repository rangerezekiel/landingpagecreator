'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState } from "react"
import DomainTitle from "@/components/element/domain-title"
import { indexData } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { FormSubmissionContent, Section } from "@/app/_types/section"
import { FormSubmissionPayload as ThisType } from "@/app/_types/section"
import { updateDataApi } from "@/app/_services/section"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
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
import RichTextEditor from "@/components/tiptap/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toastAndLog } from "@/lib/activity-log/client"
import UpdateDialog from "@/components/dialog/update-dialog"

const moduleTitle = 'Form Submission'
const thisSection = 'FORM_SUBMISSION'
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
    background: z.string().optional().nullable(),
    photo: z.string().optional().nullable(),
    privyrEnabled: z.boolean(),
    privyrWebhookUrl: z.string().optional().nullable(),
}).refine(
    // A webhook URL is only required once the Privyr form is actually switched on.
    (data) => !data.privyrEnabled || !!data.privyrWebhookUrl?.trim(),
    { message: 'Privyr webhook URL is required when the Privyr form is enabled', path: ['privyrWebhookUrl'] }
).refine(
    (data) => !data.privyrWebhookUrl?.trim() || /^https:\/\/www\.privyr\.com\/api\/v1\/incoming-leads\/.+/.test(data.privyrWebhookUrl.trim()),
    { message: 'Must be a Privyr webhook URL (https://www.privyr.com/api/v1/incoming-leads/...)', path: ['privyrWebhookUrl'] }
)

export default function WebsiteConfigFormSubmission() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [detailData, setDetailData] = useState<FormSubmissionContent | null>(null)
    const [loadingSave, setLoadingSave] = useState(false)
    const [errorMsg, setErrorMsg] = useState<ValidationError>();
    const [background, setBackground] = useState<string | null>(null);
    const [backgroundDefault, setBackgroundDefault] = useState<string | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoDefault, setPhotoDefault] = useState<string | null>(null);
    // Set breadcrumbs
    useEffect(() => {
        setBreadcrumbs([
        { label: 'Website Config', href: `/backside/website/${domain}/config` },
        { label: moduleTitle },
        ])
    }, [setBreadcrumbs, domain])

    const mappedInitialData = {
        content: "",
        privyrEnabled: false,
        privyrWebhookUrl: "",
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    });
    const { setValue, formState: { errors } } = form
    const privyrEnabled = form.watch("privyrEnabled")
  
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await indexData(domain, thisSection) as unknown as FetchApiResponse<Section>
                const data = res.data
                setDetailData(data as unknown as FormSubmissionContent)
                setBackgroundDefault(data?.details?.BACKGROUND?.value ? storageUrl(data?.details?.BACKGROUND?.value) : "")
                setPhotoDefault(data?.details?.PHOTO?.value ? storageUrl(data?.details?.PHOTO?.value) : "")
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
                content: detailData?.details?.CONTENT?.value ?? "",
                privyrEnabled: detailData?.details?.PRIVYR_ENABLED?.value === "true",
                privyrWebhookUrl: detailData?.details?.PRIVYR_WEBHOOK_URL?.value ?? "",
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
            const payload = { ...values, sectionType: 'FORM_SUBMISSION', background: background, photo: photo } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload) as unknown as FetchApiResponse<ThisType>;
            
            
            // Toast and Log START
            const payloadLog: Partial<typeof values> = { ...values };
            if (payloadLog.background !== "") {
                delete payloadLog.background;
            }
            // Base64 image, so keep it out of the activity log.
            delete payloadLog.photo;
            // The webhook URL is a credential, so keep it out of the activity log.
            if (payloadLog.privyrWebhookUrl) {
                payloadLog.privyrWebhookUrl = '[redacted]';
            }
            const LogInfo = {
                success: updateData.status === 200,
                module : 'FORM_SUBMISSION',
                action : 'UPDATE',
                msg : 'UPDATED',
                title: null,
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
                                <div className="w-full">
                                    <ImageCropper
                                        title="Background"
                                        ASPECT_RATIO={16/9}
                                        imageDefault={backgroundDefault ?? ""}
                                        onCrop={(base64) => {
                                            setValue("background", base64, { shouldValidate: true })
                                            setBackground(base64)
                                        }}
                                        EXPORT_IMAGE_FORMAT="image/webp"
                                        isError={errors.background?.message as string}
                                    />
                                    {errors.background && (
                                    <InputValidation error={errors.background.message as string} />
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
                                <FormField
                                    control={form.control}
                                    name="privyrEnabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5 pr-4">
                                                <FormLabel>Use Privyr Form</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    When on, the landing page shows a simple form that also sends
                                                    each lead to Privyr. When off, it shows the multi-step wizard.
                                                    Either way the lead is saved here.
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={loadingSave}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {privyrEnabled && (
                                    <div className="w-full">
                                        <ImageCropper
                                            title="Photo"
                                            ASPECT_RATIO={16/9}
                                            imageDefault={photoDefault ?? ""}
                                            onCrop={(base64) => {
                                                setValue("photo", base64, { shouldValidate: true })
                                                setPhoto(base64)
                                            }}
                                            EXPORT_IMAGE_FORMAT="image/webp"
                                            isError={errors.photo?.message as string}
                                        />
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Optional. Shown above the text on the Privyr form. Leave empty
                                            to keep the text-only layout.
                                        </p>
                                        {errors.photo && (
                                            <InputValidation error={errors.photo.message as string} />
                                        )}
                                    </div>
                                )}

                                {privyrEnabled && (
                                    <FormField
                                        control={form.control}
                                        name="privyrWebhookUrl"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Privyr Webhook URL</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        placeholder="https://www.privyr.com/api/v1/incoming-leads/xxxx/yyyy"
                                                        disabled={loadingSave}
                                                    />
                                                </FormControl>
                                                <p className="text-sm text-muted-foreground">
                                                    Get this from Privyr: Account &gt; Integrations &gt; Webhooks.
                                                    Treat it like a password — the URL itself grants access.
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

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
