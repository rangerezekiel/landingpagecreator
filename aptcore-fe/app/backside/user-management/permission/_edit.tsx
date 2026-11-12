
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Permission as ThisType } from "@/app/_types/permission"
import LoadingSection from "@/components/element/loading-section"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useEffect, useState } from "react"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { updateData as updateDataApi } from "@/app/_services/permission"
import AlertValidations from "@/components/element/errors/alert-validations"
import SpinnerCaption from "@/components/element/spinner-caption"
import ThisFields, { formSchema } from "./_fields"
import { EditDialogProps } from "@/app/_types/form-props"
import { toastAndLog } from "@/lib/activity-log/client"

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
    
    const mappedInitialData = {
        slug: editData?.slug ?? "",
        title: editData?.title ?? "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    });

    useEffect(() => {
        if (open && editData) {
            form.reset({
                slug: editData.slug ?? "",
                title: editData.title ?? "",
            });
        }
    }, [open, editData, form]);
    
    async function onUpdate(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            values.slug = values.slug.toLowerCase().replace(/\s+/g, '-');
            const payload = { ...values } as ThisType;
            const updateData = await updateDataApi(editId ?? "", payload) as FetchApiResponse<ThisType>;
            
            // Toast and Log START
            const LogInfo = {
                success: updateData.status === 200,
                module : 'PERMISSION',
                action : 'UPDATE',
                msg : 'UPDATED',
                title: values.title ?? null,
                payload : values,
                payloadFailed : values,
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
            <DialogContent>
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

                                <ThisFields control={form.control} loading={loading} />

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