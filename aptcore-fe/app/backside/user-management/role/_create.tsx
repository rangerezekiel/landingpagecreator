'use client'

import { createData as createDataApi } from "@/app/_services/role"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { Role as ThisType } from "@/app/_types/role"
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
import { toastAndLog } from "@/lib/activity-log/client"

export default function CreateThisData({ moduleTitle, onSaveSuccess }
  : { moduleTitle: string, onSaveSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ValidationError>();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const mappedInitialData = {
    slug: "",
    title: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mappedInitialData,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      values.slug = values.slug.toLowerCase().replace(/\s+/g, '-');
      const payload = { ...values } as ThisType;
      const createData = await createDataApi(payload) as FetchApiResponse<ThisType>;
      
      // Toast and Log START
      const LogInfo = {
          success: createData.status === 200,
          module : 'ROLE',
          action : 'CREATE',
          msg : 'CREATED',
          title: values.title ?? null,
          payload : values,
          payloadFailed : values,
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

      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>
                Create {moduleTitle}
              </DialogTitle>
            </DialogHeader>

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
                <SpinnerCaption loading={loading} loadingValue="Saving.." defaultValue="Submit" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
