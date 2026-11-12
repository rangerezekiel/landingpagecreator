import ImageCropper from "@/components/image-cropper"
import themeData from "@/app/_datas/theme.json";
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
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const formSchema = z.object({
  domain: z.string().min(3, "Domain must have at least 3 characters"),
  title: z.string().min(3, "Title must have at least 3 characters"),
  theme: z.string().min(1, "Theme is required"),
  apiKey: z.string().optional().nullable(),

  metaTitle: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 3,
      { message: "Meta title must have at least 3 characters" }
    ),

  metaDescription: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 3,
      { message: "Meta description must have at least 3 characters" }
    ),
});

type FormType = z.infer<typeof formSchema>

type FieldsProps = {
  control: Control<FormType>
  loading?: boolean
  onCropLogo?: (base64Logo: string) => void;
  imageDefaultLogo?: string | null;
  onCropFavicon?: (base64Favicon: string) => void;
  imageDefaultFavicon?: string | null;
}

const themes = themeData

export default function ThisFields({ control, loading, onCropLogo, imageDefaultLogo, onCropFavicon, imageDefaultFavicon }: FieldsProps) {

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-full">
              <FormField
                control={control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="website.com" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Website Title" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {onCropLogo && (
              <div className="lg:w-1/2">
                <ImageCropper
                  title="Logo"
                  ASPECT_RATIO={1}
                  CIRCULAR_CROP
                  imageDefault={imageDefaultLogo ?? undefined}
                  onCrop={(base64Logo) => {
                    onCropLogo(base64Logo);
                  }}
                  EXPORT_IMAGE_FORMAT="image/webp"
                />
              </div>
            )}
            {onCropFavicon && (
              <div className="lg:w-1/2">
                <ImageCropper
                  title="Favicon"
                  ASPECT_RATIO={1}
                  CIRCULAR_CROP
                  imageDefault={imageDefaultFavicon ?? undefined}
                  onCrop={(base64Favicon) => {
                    onCropFavicon(base64Favicon);
                  }}
                  EXPORT_IMAGE_FORMAT="image/png"
                />
              </div>
            )}
          </div>
          <FormField
            control={control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Website Meta Title" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Website Meta Description" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                    <Input placeholder="API Key" disabled={loading} {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Theme  */}
        <div className="space-y-5">
            <FormField
              control={control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                    <FormControl>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {Array.from({ length: 3 }, (_, index) => {
                         const theme = themes[index];
                         
                         if (theme) {
                           return (
                             <div key={theme.value} className="flex items-center space-x-3">
                               <input
                                 type="radio"
                                 id={theme.value}
                                 name="theme"
                                 value={theme.value}
                                 checked={field.value === theme.value}
                                 onChange={(e) => {
                                   field.onChange(e.target.value)
                                 }}
                                 disabled={loading}
                                 className="sr-only"
                               />
                               <Label
                                 htmlFor={theme.value}
                                 className={cn(
                                   "flex flex-col items-center justify-center w-full p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary/50",
                                   field.value === theme.value
                                     ? "border-primary bg-primary/5"
                                     : "border-border hover:border-primary/30"
                                 )}
                               >
                                 <div className="relative w-full aspect-[16/9] mb-3 overflow-hidden rounded-md">
                                   <Image
                                     src={`/assets/img/themes/${theme.value}.webp`}
                                     alt={`${theme.label} Preview`}
                                     fill
                                     className="!h-[unset] !w-full"
                                   />
                                   {field.value === theme.value && (
                                     <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                       <div className="bg-primary text-primary-foreground rounded-full p-1">
                                         <svg
                                           className="w-4 h-4"
                                           fill="none"
                                           stroke="currentColor"
                                           viewBox="0 0 24 24"
                                         >
                                           <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M5 13l4 4L19 7"
                                           />
                                         </svg>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                                 <span className="text-sm font-medium text-center">
                                   {theme.label}
                                 </span>
                               </Label>
                             </div>
                           );
                         } else {
                           // Placeholder for empty theme slot
                           return (
                             <div key={`placeholder-${index}`} className="flex items-center space-x-3">
                               <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg opacity-50">
                                 <div className="relative w-full aspect-[16/9] mb-3 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                                   <div className="text-center">
                                     <svg
                                       className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50"
                                       fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24"
                                     >
                                       <path
                                         strokeLinecap="round"
                                         strokeLinejoin="round"
                                         strokeWidth={1.5}
                                         d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                       />
                                     </svg>
                                     <span className="text-xs text-muted-foreground/50">Coming Soon</span>
                                   </div>
                                 </div>
                                 <span className="text-sm font-medium text-center text-muted-foreground/50">
                                   Theme {index + 1}
                                 </span>
                               </div>
                             </div>
                           );
                         }
                       })}
                     </div>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        {/* end Theme */}
      </div>
    </>
  )
}
