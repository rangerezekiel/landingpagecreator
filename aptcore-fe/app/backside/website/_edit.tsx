
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Website as ThisType } from "@/app/_types/website"
import LoadingSection from "@/components/element/loading-section"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useEffect, useState } from "react"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { updateData as updateDataApi } from "@/app/_services/website"
import AlertValidations from "@/components/element/errors/alert-validations"
import SpinnerCaption from "@/components/element/spinner-caption"
import ThisFields, { formSchema } from "./_fields"
import { EditDialogProps } from "@/app/_types/form-props"
import { storageUrl } from "@/app/_utils/objectTransformers"
import { toastAndLog } from '@/lib/activity-log/client'

export default function EditThisData({
editId,
open,
moduleTitle,
loadingShow = false,
editData,
onClose,
onUpdateSuccess
}: EditDialogProps<ThisType>){

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<ValidationError>();
    const [logo, setLogo] = useState<string | null>(null);
    const [favicon, setFavicon] = useState<string | null>(null);
    
    const mappedInitialData = {
        domain: editData?.domain ?? "",
        title: editData?.title ?? "",
        theme: editData?.theme ?? "",
        metaTitle: editData?.metaTitle ?? "",
        metaDescription: editData?.metaDescription ?? "",
        apiKey: editData?.apiKey ?? "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    });

    useEffect(() => {
        if (open && editData) {
            form.reset({
                domain: editData.domain ?? "",
                title: editData.title ?? "",
                theme: editData?.theme ?? "T01",
                metaTitle: editData?.metaTitle ?? "",
                metaDescription: editData?.metaDescription ?? "",
                apiKey: editData?.apiKey ?? "",
            });
        }
    }, [open, editData, form]);
    
    async function onUpdate(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const payload = { ...values, logo, favicon } as unknown as ThisType;
            const updateData = await updateDataApi(editId ?? "", payload) as FetchApiResponse<ThisType>;
            
            // Toast and Log START
            const LogInfo = {
                success: updateData.status === 200,
                module : 'WEBSITE',
                action : 'UPDATE',
                msg : 'UPDATED',
                title: values.domain ?? null,
                payload : {...values},
                payloadFailed : {...values},
            }
    
            await toastAndLog(LogInfo)
            // Toast and Log END

            if (updateData.status === 200) {
                setErrorMsg(undefined);
                onUpdateSuccess()
                onClose()
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        Edit {moduleTitle}
                    </DialogTitle>
                </DialogHeader>
                {loadingShow ? 
                    (
                        <LoadingSection />
                    ) : 
                    (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-5">

                                <ThisFields 
                                    control={form.control} 
                                    loading={loading}
                                    onCropLogo={setLogo} 
                                    onCropFavicon={setFavicon}
                                    imageDefaultLogo={storageUrl(editData?.logo ?? "")}
                                    imageDefaultFavicon={storageUrl(editData?.favicon ?? "")}
                                />

                                {errorMsg && 
                                (
                                    <>
                                    <AlertValidations {...errorMsg} />
                                    </>
                                )
                                }

                                <DialogFooter className="sm:justify-end">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary" disabled={loading}>
                                        Close
                                        </Button>
                                    </DialogClose>

                                    <Button type="submit" disabled={loading}>
                                        <SpinnerCaption loading={loading} loadingValue="Saving.." defaultValue="Save Changes" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}