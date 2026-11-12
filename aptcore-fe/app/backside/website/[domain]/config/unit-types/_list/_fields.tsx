import InputValidation from "@/components/element/errors/input-validation"
import ImageCropper from "@/components/image-cropper"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Control, useFormContext } from "react-hook-form"
import { z } from "zod"


export const formSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(3, "Description must have at least 3 characters"),
  buttonLink: z.string().min(1, "Button Link must have at least 1 characters"),
  buttonTitle: z.string().min(3, "Button Title must have at least 3 characters"),
  sortOrder: z.coerce.number({
    invalid_type_error: "Sort Order must be a number",
  }).optional().refine((val) => !val || val >= 1, {
    message: "Number must be greater than or equal to 1"
  }),
  base64: z.string({
    required_error: "Image is required",
  }).min(1, "Image is required")
})

export const formSchemaEdit = 
  z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(3, "Description must have at least 3 characters"),
  buttonLink: z.string().min(1, "Button Link must have at least 1 characters"),
  buttonTitle: z.string().min(3, "Button Title must have at least 3 characters"),
  sortOrder: z.coerce.number({
    invalid_type_error: "Sort Order must be a number",
  }).optional().refine((val) => !val || val >= 1, {
    message: "Number must be greater than or equal to 1"
  }),
  base64: z.string().optional().nullable()
})

type FormType = z.infer<typeof formSchema>
type FormTypeEdit = z.infer<typeof formSchemaEdit>

type FieldsProps = {
  createControl?: Control<FormType>
  editControl?: Control<FormTypeEdit>
  loading?: boolean
  isUpdateForm?: boolean
  onCrop?: (base64: string) => void;
  imageDefault?: string | null;
}

export default function ThisFields({ createControl, editControl, loading, isUpdateForm, onCrop, imageDefault }: FieldsProps) {
  const { setValue, formState: { errors } } = useFormContext<FormType>()

  const control = (isUpdateForm
    ? editControl
    : createControl) as Control<FormType | FormTypeEdit>;
  return (
    <>
      {onCrop && (
        <div>
          <ImageCropper
            title="Background"
            ASPECT_RATIO={16/9}
            imageDefault={imageDefault ?? undefined}
            onCrop={(base64) => {
              setValue("base64", base64 ?? "", { shouldValidate: true })
              onCrop(base64)
            }}
            EXPORT_IMAGE_FORMAT="image/webp"
            isError={errors.base64?.message}
          />
          {errors.base64 && (
            <InputValidation error={errors.base64.message} />
          )}
        </div>
      )}
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Title" disabled={loading} {...field} />
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
              <Textarea placeholder="description" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-5">
        <FormField
          control={control}
          name="buttonTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Title</FormLabel>
              <FormControl>
                <Input placeholder="GET PREVIEW ACCESS" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="buttonLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Link</FormLabel>
              <FormControl>
                <Input placeholder="#contact" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
