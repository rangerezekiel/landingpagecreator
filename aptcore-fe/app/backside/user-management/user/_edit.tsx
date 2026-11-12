
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserField } from "@/app/_types/user"
import LoadingSection from "@/components/element/loading-section"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useEffect, useState } from "react"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { updateData as updateDataApi } from "@/app/_services/user"
import { toast } from "sonner"
import AlertValidations from "@/components/element/errors/alert-validations"
import SpinnerCaption from "@/components/element/spinner-caption"
import ThisFields, { formSchemaEdit } from "./_fields"
import { EditDialogProps } from "@/app/_types/form-props"
import { storageUrl } from "@/app/_utils/objectTransformers"
import { toastAndLog } from "@/lib/activity-log/client"

export default function EditThisData({
editId,
open,
moduleTitle,
loadingShow = false,
editData,
isSuperadmin,
onClose,
onUpdateSuccess
}: EditDialogProps<UserField>){

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<ValidationError>();
    const [profileImage, setProfileImage] = useState<string | null>(editData?.avatar ?? null);
    
    
    const mappedInitialData = {
        username: editData?.username ?? "",
        fullName: editData?.fullName ?? "",
        email: editData?.email ?? "",
        countryPhoneCode: editData?.countryPhoneCode ?? "",
        phoneNumber: editData?.phoneNumber ?? "",
        websiteId: editData?.websiteId ? (Array.isArray(editData.websiteId) ? editData.websiteId : [editData.websiteId as string]) : [],
        password: "",
        passwordConfirmation: "",
        roles: editData?.roles ?? [],
    };
    const form = useForm<z.infer<typeof formSchemaEdit>>({
        resolver: zodResolver(formSchemaEdit),
        defaultValues: mappedInitialData,
    });

    useEffect(() => {
        if (open && editData) {
            form.reset({
                username: editData.username ?? "",
                fullName: editData.fullName ?? "",
                email: editData.email ?? "",
                countryPhoneCode: editData.countryPhoneCode ?? "",
                phoneNumber: editData.phoneNumber ?? "",
                websiteId: editData.websiteId ? (Array.isArray(editData.websiteId) ? editData.websiteId : [editData.websiteId as string]) : [],
                password: "",
                passwordConfirmation: "",
                roles: editData.roles ?? []
            });
        }
    }, [open, editData, form]);
    
    async function onUpdate(values: z.infer<typeof formSchemaEdit>) {
        setLoading(true);
        try {
            if (!isSuperadmin) {
                values.roles = ['admin']
            } else if (!values.roles || values.roles.length === 0) {
                toast.error("At least one role must be selected")
                return
            }
            const payload = { ...values, avatar: profileImage } as unknown as UserField;
            if (!payload.password) {
                delete payload.password;
                delete payload.passwordConfirmation;
            }
            const updateData = await updateDataApi(editId ?? "", payload) as FetchApiResponse<UserField>;

            const payloadLog = { ...values };
            delete payloadLog.password;
            delete payloadLog.passwordConfirmation;

            // Toast and Log START
            const LogInfo = {
                success: updateData.status === 200,
                module : 'USER',
                action : 'UPDATE',
                msg : 'UPDATED',
                title: payloadLog.fullName ?? null,
                payload : payloadLog,
                payloadFailed : payloadLog,
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
                                    isSuperadmin={isSuperadmin}
                                    isUpdateForm={true}
                                    editControl={form.control}
                                    loading={loading}
                                    onCrop={setProfileImage}
                                    imageDefault={storageUrl(editData?.avatar ?? "")}
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