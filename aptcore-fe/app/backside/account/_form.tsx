'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select,
         SelectContent,
         SelectGroup,
         SelectItem,
         SelectLabel,
         SelectTrigger,
         SelectValue } from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import phoneCodesData from "@/app/_datas/phone-code.json";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateData } from "@/app/_services/user";
import { toast } from "sonner";
import { User, UserField } from "@/app/_types/user";
import SpinnerCaption from "@/components/element/spinner-caption";
import ImageCropper from "@/components/image-cropper";
import { storageUrl } from "@/app/_utils/objectTransformers";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    countryPhoneCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    avatar: z.string().optional(),
});

export default function AccountForm({ initialData, userId }: { initialData: User, userId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<string>();

    const mappedInitialData = {
      username: "",
      fullName: "",
      email: "",
      countryPhoneCode: "",
      phoneNumber: "",
      avatar: "",
    };
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mappedInitialData,
    })

    const { setValue } = form
    
    useEffect(() => {
        setValue("username", initialData.username || '');
        setValue("fullName", initialData.fullName || '');
        setValue("email", initialData.email || '');
        setValue("countryPhoneCode", initialData.countryPhoneCode || '');
        setValue("phoneNumber", initialData.phoneNumber || '');
        setValue("avatar", storageUrl(initialData.avatar) || '');
    }, [initialData, setValue]);
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)

        try {
            // Convert User to UserField format - websiteId needs to be an array
            const payload: UserField = {
                id: initialData.id,
                username: values.username,
                email: values.email,
                fullName: values.fullName,
                countryCode: initialData.countryCode,
                phoneCode: initialData.phoneCode,
                countryPhoneCode: values.countryPhoneCode,
                phoneNumber: values.phoneNumber,
                phone: initialData.phone,
                // Only include avatar if there's a new image (base64), otherwise don't send avatar field
                avatar: profileImage || null,
                roles: initialData.roles,
                websiteId: initialData.websiteId ? [initialData.websiteId] : null
            };
            const data = await updateData(userId, payload);
            if (data.status === 200) {
                toast.success('Update data successfully');
                router.push("/backside/account");
            } else {
                toast.warning('Update data failed');
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <ImageCropper 
                        title="Account Image" 
                        imageDefault={initialData.avatar ? storageUrl(initialData.avatar) : ''}
                        ASPECT_RATIO={1} 
                        CIRCULAR_CROP={true} 
                        onCrop={(base64) => {
                            setProfileImage(base64)
                        }}
                        EXPORT_IMAGE_FORMAT="image/webp"
                    />
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="fullName"  disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username"  disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email"  disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <FormField
                            control={form.control}
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
                        control={form.control}
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
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <SpinnerCaption loading={loading} loadingValue="Saving.." defaultValue="Save Changes" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
     )
}