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
import phoneCodesData from "@/app/_datas/phone-code.json";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const formSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  email: z.string().min(3, "Title must have at least 3 characters"),
  countryPhoneCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  message: z.string().min(3, "Message must have at least 3 characters"),
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Jhon Doe" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
          <FormField
              control={control}
              name="countryPhoneCode"
              render={({ field }) => (
                  <FormItem className="flex-1">
                  <FormLabel>Country Code</FormLabel>
                  <Select
                      key={field.value} 
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                  >
                      <FormControl>
                          <SelectTrigger className="w-full">
                              <SelectValue placeholder="Code" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectGroup>
                              <SelectLabel>Country Codes</SelectLabel>
                              {phoneCodesData.map((c) => (
                              <SelectItem key={`${c.iso}-${c.phonecode}`} value={`${c.iso}-${c.phonecode}`}>
                                  {c.iso} | +{c.phonecode}
                              </SelectItem>
                              ))}
                          </SelectGroup>
                      </SelectContent>
                  </Select>
              <FormMessage />
          </FormItem>
          )}
          />
          <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
              <FormItem className="flex-1">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                  <Input placeholder="Phone Number" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
              )}
          />
      </div>
      
      <FormField
        control={control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <Textarea placeholder="Message" disabled={loading} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
