
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UnitTypesAccordionListPayload as ThisType } from "@/app/_types/section"
import LoadingSection from "@/components/element/loading-section"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useEffect, useState } from "react"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { updateDataApi } from "@/app/_services/section"
import AlertValidations from "@/components/element/errors/alert-validations"
import SpinnerCaption from "@/components/element/spinner-caption"
import ThisFields, { formSchemaEdit } from "./_fields"
import { EditDialogProps } from "@/app/_types/form-props"
import { toastAndLog } from "@/lib/activity-log/client"

export default function EditThisData({
domain,
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
        title: editData?.contents.TITLE.value ?? "",
        description: editData?.contents.DESCRIPTION.value ?? "",
        sortOrder: editData?.sortOrder ?? 0,
    };

    const form = useForm<z.infer<typeof formSchemaEdit>>({
        resolver: zodResolver(formSchemaEdit),
        defaultValues: mappedInitialData,
    });

    useEffect(() => {
        if (open && editData) {
            form.reset({
                title: editData?.contents.TITLE.value ?? "",
                description: editData?.contents.DESCRIPTION.value ?? "",
                sortOrder: editData?.sortOrder ?? 0,
            });
        }
    }, [open, editData, form]);
    
    async function onUpdate(values: z.infer<typeof formSchemaEdit>) {
        setLoading(true);
        try {
            const payload = { ...values, sectionType: 'UNIT_TYPES_ACCORDION', typeData: 'LIST', editId } as unknown as ThisType;
            const updateData = await updateDataApi<ThisType>(domain ?? "", payload, editId) as FetchApiResponse<ThisType>;
            
            // Toast and Log START
            const payloadLog: Partial<typeof values> = { ...values };

            const LogInfo = {
                success: updateData.status === 200,
                module : 'UNIT_TYPES_ACCORDION_LIST',
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
                onUpdateSuccess()
                onClose()
            } else {
                setErrorMsg(updateData.error as ValidationError);
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-md">
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
                                    isUpdateForm={true}
                                    editControl={form.control}
                                    loading={loading} />

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