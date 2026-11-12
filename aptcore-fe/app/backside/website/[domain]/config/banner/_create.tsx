'use client'

import { createDataApi } from "@/app/_services/section"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
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
import * as z from "zod"
import ThisFields, { formSchema } from "./_fields"
import { BannerPayload } from "@/app/_types/section"
import { toastAndLog } from "@/lib/activity-log/client"
import { toast } from "sonner"

export default function CreateThisData({ moduleTitle, onSaveSuccess, domain, detailId }
  : { moduleTitle: string, onSaveSuccess: () => void , domain: string, detailId: string}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ValidationError>();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const mappedInitialData = {
    background: "",
    title: "",
    description: "",
    buttonLink: "#",
    buttonTitle: "",
    sortOrder: 0,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mappedInitialData,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        const payload = { ...values, sectionType: 'BANNER', background: bannerImage, detailId } as unknown as BannerPayload;
        const createData = await createDataApi<BannerPayload>(domain, payload) as FetchApiResponse<BannerPayload>;
        
        // Toast and Log START
        const payloadLog: Partial<typeof values> = { ...values };
        if (payloadLog.base64 !== "") {
          delete payloadLog.base64;
        }

        const LogInfo = {
            success: createData.status === 200,
            module : 'BANNER',
            action : 'CREATE',
            msg : 'CREATED',
            title: payloadLog.title ?? null,
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
        } else {
            setErrorMsg(createData.error as ValidationError);
        }

    } catch (err) {
        console.error(err)
        toast.error("Failed to save banner. The image is likely too large to upload (max ~4MB). Please use a smaller or lower-resolution image, then try again.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={modalCreateOpen} onOpenChange={setModalCreateOpen}>
      <DialogTrigger asChild>
        <Button>Add New {moduleTitle}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>
                Create {moduleTitle}
              </DialogTitle>
            </DialogHeader>

            <ThisFields createControl={form.control} loading={loading} onCrop={setBannerImage} />
            
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
