'use client'

import { createData as createDataApi } from "@/app/_services/user"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { UserField } from "@/app/_types/user"
import AlertValidations from "@/components/element/errors/alert-validations"
import SpinnerCaption from "@/components/element/spinner-caption"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import ThisFields, { formSchema } from "./_fields"
import { useGlobalContext } from "@/app/_providers/GlobalContextProvider"
import { toastAndLog } from "@/lib/activity-log/client"

export default function CreateThisData({ moduleTitle, isSuperadmin, onSaveSuccess }
  : { moduleTitle: string, onSaveSuccess: () => void , isSuperadmin?: boolean}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ValidationError>();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const mappedInitialData = {
    username: "",
    fullName: "",
    email: "",
    countryPhoneCode: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
    websiteId: [],
    roles: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mappedInitialData,
  });
  
  const context = useGlobalContext();
  const profileData = context;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (!isSuperadmin) {
        values.roles = ['admin']
      } else if (!values.roles || values.roles.length === 0) {
        toast.error("At least one role must be selected")
        return
      }
      const payload = { ...values, avatar: profileImage } as unknown as UserField;
      if(!isSuperadmin){
        payload.websiteId = profileData?.user?.websiteId ? (Array.isArray(profileData.user.websiteId) ? profileData.user.websiteId : [profileData.user.websiteId as string]) : []
      }
      const createData = await createDataApi(payload) as FetchApiResponse<UserField>;

      const payloadLog: Partial<typeof values> = { ...values };
      if (payloadLog.password !== "") {
        delete payloadLog.password;
        delete payloadLog.passwordConfirmation;
      }

      // Toast and Log START
      const LogInfo = {
          success: createData.status === 200,
          module : 'USER',
          action : 'CREATE',
          msg : 'CREATED',
          title: payloadLog.fullName ?? null,
          payload : payloadLog,
          payloadFailed : payloadLog,
      }

      await toastAndLog(LogInfo)
      // Toast and Log END

      if (createData.status === 200) {
          setModalCreateOpen(false);
          form.reset(mappedInitialData);
          setErrorMsg(undefined);
          onSaveSuccess()
      }

    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={modalCreateOpen} onOpenChange={setModalCreateOpen}>
      <DialogTrigger asChild>
        <Button>Add New {moduleTitle}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>
                Create {moduleTitle}
              </DialogTitle>
            </DialogHeader>

            <ThisFields isSuperadmin={isSuperadmin} createControl={form.control} loading={loading} onCrop={setProfileImage} />
            
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
                <SpinnerCaption loading={loading} loadingValue="Saving.." defaultValue="Submit" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
