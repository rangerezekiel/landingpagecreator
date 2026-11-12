
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormSubmission as ThisType } from "@/app/_types/form-submission"
import LoadingSection from "@/components/element/loading-section"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useEffect, useState } from "react"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { updateData as updateDataApi } from "@/app/_services/form-submission"
import { toast } from "sonner"
import AlertValidations from "@/components/element/errors/alert-validations"
import SpinnerCaption from "@/components/element/spinner-caption"
import ThisFields, { formSchema } from "./_fields"
import { EditDialogProps } from "@/app/_types/form-props"

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
        name: editData?.name ?? "",
        email: editData?.email ?? "",
        countryPhoneCode: editData?.countryPhoneCode ?? "",
        phoneNumber: editData?.phoneNumber ?? "",
        message: editData?.message ?? "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    });

    useEffect(() => {
        if (open && editData) {
            form.reset({
                name: editData.name ?? "",
                email: editData.email ?? "",
                countryPhoneCode: editData?.countryPhoneCode ?? "",
                phoneNumber: editData?.phoneNumber ?? "",
                message: editData?.message ?? "",
            });
        }
    }, [open, editData, form]);
    
    async function onUpdate(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const payload = { ...values } as ThisType;
            const updateData = await updateDataApi(editId ?? "", payload) as FetchApiResponse<ThisType>;
            if (updateData.status === 200) {
                toast.success("Data updated successfully");
                setErrorMsg(undefined);
                onUpdateSuccess()
                onClose()
            } else {
                setErrorMsg(updateData.error as ValidationError);
                toast.error("Failed to save data");
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