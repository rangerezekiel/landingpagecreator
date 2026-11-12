import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Control } from "react-hook-form"
import { z } from "zod"


export const formSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(3, "Description must have at least 3 characters"),
  sortOrder: z.coerce.number({
    invalid_type_error: "Sort Order must be a number",
  }).min(0).optional().nullable(),
})

export const formSchemaEdit = 
  z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(3, "Description must have at least 3 characters"),
  sortOrder: z.coerce.number({
    invalid_type_error: "Sort Order must be a number",
  }).min(0).optional().nullable(),
})

type FormType = z.infer<typeof formSchema>
type FormTypeEdit = z.infer<typeof formSchemaEdit>

type FieldsProps = {
  createControl?: Control<FormType>
  editControl?: Control<FormTypeEdit>
  loading?: boolean
  isUpdateForm?: boolean
}

export default function ThisFields({ createControl, editControl, loading, isUpdateForm }: FieldsProps) {

  const control = (isUpdateForm
    ? editControl
    : createControl) as Control<FormType | FormTypeEdit>;
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Location Title" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Location description" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sortOrder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sort Order (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                disabled={loading} 
                {...field} 
                value={field.value?.toString() || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
