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
import PasswordInput from "@/components/ui/password-input";
import { Info, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Role, RolePermissionsMap } from "@/app/_types/role";
import { indexData, rolePermissionsData } from "@/app/_services/role";
import { indexData as indexDataWebsite } from "@/app/_services/website";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCropper from "@/components/image-cropper";
import { Website } from "@/app/_types/website";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import RolePermissionsTable from "@/components/element/role-permissions-table";
import { MultiSelect } from "@/components/ui/multi-select";

export const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must include at least one number",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Password must include at least one symbol",
    }),
  passwordConfirmation: z.string().min(1, "Password confirmation is required"),
  countryPhoneCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
    roles: z
    .array(z.string())
    .optional()
    .or(z.literal(undefined)),
  websiteId: z.array(z.string()).nullable().optional(),
})
.refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export const formSchemaEdit = z
  .object({
    username: z.string().min(1, "Username is required"),
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    passwordConfirmation: z.string().optional(),
    countryPhoneCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    websiteId: z.array(z.string()).nullable().optional(),
    roles: z
    .array(z.string())
    .optional()
    .or(z.literal(undefined)),
  })
  .superRefine((data, ctx) => {
    if (data.password) {
      if (data.password.length < 6) {
        ctx.addIssue({
          path: ["password"],
          code: "too_small",
          minimum: 6,
          type: "string",
          inclusive: true,
          message: "Password must be at least 6 characters long",
        });
      }
      if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
          path: ["password"],
          code: "custom",
          message: "Password must include at least one uppercase letter",
        });
      }
      if (!/[a-z]/.test(data.password)) {
        ctx.addIssue({
          path: ["password"],
          code: "custom",
          message: "Password must include at least one lowercase letter",
        });
      }
      if (!/[0-9]/.test(data.password)) {
        ctx.addIssue({
          path: ["password"],
          code: "custom",
          message: "Password must include at least one number",
        });
      }
      if (!/[^A-Za-z0-9]/.test(data.password)) {
        ctx.addIssue({
          path: ["password"],
          code: "custom",
          message: "Password must include at least one symbol",
        });
      }

      if (data.password !== data.passwordConfirmation) {
        ctx.addIssue({
          path: ["passwordConfirmation"],
          code: "custom",
          message: "Passwords do not match",
        });
      }
    } else if (data.passwordConfirmation) {
      ctx.addIssue({
        path: ["password"],
        code: "custom",
        message: "Password must be filled in to match confirmation",
      });
    }
  });

type FormType = z.infer<typeof formSchema>
type FormTypeEdit = z.infer<typeof formSchemaEdit>

type FieldsProps = {
  createControl?: Control<FormType>
  editControl?: Control<FormTypeEdit>
  loading?: boolean
  isUpdateForm?: boolean
  onCrop?: (base64: string) => void;
  imageDefault?: string | null;
  isSuperadmin?: boolean;
}

export default function ThisFields({ createControl, editControl, loading, isUpdateForm, isSuperadmin, onCrop, imageDefault }: FieldsProps) {

  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [rolesDataLoading, setRolesDataLoading] = useState(false);

  const [rolesPermissionsDataLoading, setRolesPermissionsDataLoading] = useState(false);
  const [rolesPermissionsData, setRolesPermissionsData] = useState<RolePermissionsMap>({});
  
  const [websiteData, setWebsiteData] = useState<Website[]>([]);
  const [websiteDataLoading, setWebsiteDataLoading] = useState(false);
  // Fetch roles
  const getRolesData = async () => {
    try {
      setRolesDataLoading(true);
      const res = await indexData("");
      if (res.status === 200 && res.data) {
        setRolesData(res.data.data || []);
      } else {
        setRolesData([]);
      }
    } catch (error) {
      console.error("Failed to fetch roles data:", error);
      setRolesData([]);
    } finally {
      setRolesDataLoading(false);
    }

    try {
      setRolesPermissionsDataLoading(true);
      const res = await rolePermissionsData();
      if (res.status === 200) {
        setRolesPermissionsData(res.data as unknown as RolePermissionsMap || {});
      } else {
        setRolesPermissionsData({});
      }
    } catch (error) {
      console.error("Failed to fetch roles permissions data:", error);
      setRolesPermissionsData({});
    } finally {
      setRolesPermissionsDataLoading(false);
    }
  };

  // Fetch websites
  const getWebsiteData = async () => {
    try {
      setWebsiteDataLoading(true)
      const res = await indexDataWebsite("?perPage=1000")
      if (res.status === 200 && res.data) {
        setWebsiteData(res.data.data || [])
      } else {
        setWebsiteData([])
      }
    } catch (error) {
      console.error("Failed to fetch website data:", error)
      setWebsiteData([])
    } finally {
      setWebsiteDataLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      await getRolesData();
      await getWebsiteData();
    };
    fetchData();
  }, []);

  const control = (isUpdateForm
    ? editControl
    : createControl) as Control<FormType | FormTypeEdit>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Nama Lengkap" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="user-index" disabled={loading} {...field} />
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
                <Input type="email" placeholder="email@example.com" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isUpdateForm && (
          <p className="text-sm text-muted-foreground">
            <InfoIcon className="inline h-4 w-4 text-blue-400 mr-1" />
              If you don&apos;t want to change the password leave it empty
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Confirmation</FormLabel>
                <FormControl>
                  <PasswordInput disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
            {isSuperadmin && (
              <>
                {websiteDataLoading ? 
                  (
                    <>
                      <Label>Website</Label>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-1/2 rounded" />
                        <Skeleton className="h-4 w-1/3 rounded" />
                      </div>
                    </>
                  ) : (
                    <FormField
                        control={control}
                        name="websiteId"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={[
                                        ...websiteData.map((web) => ({
                                            label: `${web.domain} | ${web.title}`,
                                            value: `${web.id}`
                                        }))
                                    ]}
                                    className="h-fit"
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select websites..."
                                    disabled={loading}
                                />
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                    />
                  )
                  }
              </>
            )}
      </div>

      <div className="space-y-6">
        {onCrop && (
          <div className="w-1/2">
            <ImageCropper
              title="Profile Image"
              ASPECT_RATIO={1}
              CIRCULAR_CROP
              imageDefault={imageDefault ?? undefined}
              onCrop={(base64) => {
                onCrop(base64);
              }}
              EXPORT_IMAGE_FORMAT="image/webp"
            />
          </div>
        )}

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
            {isSuperadmin && (
              <>
                {rolesDataLoading ? 
                  (
                    <>
                      <Label>Roles</Label>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-1/2 rounded" />
                        <Skeleton className="h-4 w-1/3 rounded" />
                      </div>
                    </>
                  ) : 
                  (
                    <FormField
                      control={control}
                      name="roles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roles</FormLabel>
                          <div className="space-y-3">
                            {rolesData
                              .filter((role) => role.slug && role.slug !== "superdev") // pastikan slug truthy
                              .map((role) => {
                                const slug = role.slug!; // aman karena sudah difilter

                                return (
                                  <div key={slug} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${slug}`}
                                      checked={field.value?.includes(`${slug}`)}
                                      onCheckedChange={(checked) => {
                                        const value = field.value || [];
                                        if (checked) {
                                          field.onChange([...value, slug]);
                                        } else {
                                          field.onChange(value.filter((v) => v !== slug));
                                        }
                                      }}
                                      disabled={loading}
                                    />
                                    <Label htmlFor={`${slug}`} className="flex items-center">
                                      <span>{role.title}</span>

                                      <HoverCard>
                                        <HoverCardTrigger asChild>
                                          <Info className="size-4 cursor-help" />
                                        </HoverCardTrigger>

                                        <HoverCardContent className="w-80 p-3">
                                          {rolesPermissionsDataLoading ? (
                                            <div className="space-y-2">
                                              <Skeleton className="h-6 w-full rounded" />
                                              <Skeleton className="h-4 w-1/3 rounded" />
                                              <Skeleton className="h-4 w-1/2 rounded" />
                                            </div>
                                          ) : (
                                            <RolePermissionsTable 
                                            slugCaption={role.title}
                                            data={(rolesPermissionsData?.[slug] as unknown as Record<string, string[]>) || {}} 
                                            maxH="max-h-64" />
                                          )}
                                        </HoverCardContent>
                                      </HoverCard>
                                    </Label>
                                  </div>
                                );
                              })}

                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  )
                }
              </>
            )}
      </div>
    </div>

  )
}
