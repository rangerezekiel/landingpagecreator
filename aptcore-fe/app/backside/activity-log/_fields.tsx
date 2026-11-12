import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { z } from "zod"

export const formSchema = z.object({
  slug: z.string().min(3, "Slug must have at least 3 characters"),
  title: z.string().min(3, "Title must have at least 3 characters"),
})

type FormType = z.infer<typeof formSchema>

type FieldsProps = {
  control: Control<FormType>
  loading?: boolean
}

export default function ThisFields({ control, loading }: FieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input placeholder="user-index" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Title Index" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
