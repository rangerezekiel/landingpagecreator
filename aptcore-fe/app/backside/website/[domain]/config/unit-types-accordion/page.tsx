'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import WebsiteConfigUnitTypesAccordionList from "./_list/page"
import { useDomain } from "@/app/_providers/DomainContext"
import { useEffect, useState } from "react"
import DomainTitle from "@/components/element/domain-title"
import { indexData } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { UnitTypesAccordionContent, Section } from "@/app/_types/section"
import { UnitTypesAccordionPayload as ThisType } from "@/app/_types/section"
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
import ImageCropper from "@/components/image-cropper"
import InputValidation from "@/components/element/errors/input-validation"
import { storageUrl } from "@/app/_utils/objectTransformers"
import AlertValidations from "@/components/element/errors/alert-validations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import RichTextEditor from "@/components/tiptap/rich-text-editor"
import { toastAndLog } from "@/lib/activity-log/client"
import UpdateDialog from "@/components/dialog/update-dialog"

const moduleTitle = 'Unit Types Accordion'
const thisSection = 'UNIT_TYPES_ACCORDION'
const updateConfirm = true

const formSchema = z.object({
    image: z.string().optional().nullable(),
    title: z.string().min(3, "Title must have at least 3 characters"),
    description: z.string().min(3, "Description must have at least 3 characters"),
})

export default function WebsiteConfigUnitTypesAccordion() {
    const router = useRouter();
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [detailData, setDetailData] = useState<UnitTypesAccordionContent | null>(null)
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
        title: "",
        description: "",
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
                setDetailData(data as unknown as UnitTypesAccordionContent)
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
                description: detailData?.details?.DESCRIPTION?.value ?? "",
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
            const payload = { ...values, sectionType: 'UNIT_TYPES_ACCORDION', image: image } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload) as unknown as FetchApiResponse<ThisType>;
            
            // Toast and Log START
            const payloadLog: Partial<typeof values> = { ...values };
            if (payloadLog.image !== "") {
                delete payloadLog.image;
            }
            const LogInfo = {
                success: updateData.status === 200,
                module : 'UNIT_TYPES_ACCORDION',
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
                                <form onSubmit={form.handleSubmit(openConfirmation)} className="space-y-5">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                <Input placeholder="Unit Types Accordion Title" disabled={loading} {...field} />
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
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                <FormLabel>Description</FormLabel>
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
                    <WebsiteConfigUnitTypesAccordionList />
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
