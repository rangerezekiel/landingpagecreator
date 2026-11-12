import { useEffect, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"

import { indexData } from "@/app/_services/permission"
import { Permission } from "@/app/_types/permission"
import { RolePermission, Role as ThisType } from "@/app/_types/role"
import groupBy from "lodash/groupBy"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import LoadingSection from "@/components/element/loading-section"
import SpinnerCaption from "@/components/element/spinner-caption"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { getPermissions, updatePermissions } from "@/app/_services/role"
import { FetchApiResponse, ValidationError } from "@/app/_types/fetch"
import { toast } from "sonner"
import AlertValidations from "@/components/element/errors/alert-validations"

type PermissionGroup = {
  group: string
  items: Permission[]
}

type FormValues = {
  permissions: string[]
}

export type RolePermissionDialogProps<T> = {
  roleId: string | null
  open: boolean
  moduleTitle?: string | null
  onClose: () => void
  editRolePermissionData?: T | null
  onUpdateRolePermissionSuccess: () => void
}

export default function RolePermissionDialog({
  roleId,
  open,
  moduleTitle,
  onClose,
  onUpdateRolePermissionSuccess
}: RolePermissionDialogProps<ThisType>) {
    const [loading, setLoading] = useState(false)
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
    const [errorMsg, setErrorMsg] = useState<ValidationError>();

    const form: UseFormReturn<FormValues> = useForm<FormValues>({
        defaultValues: {
            permissions: []
    }   
    })

    const getPermissionList = async () => {
        try {
            const response = await indexData("?perPage=1000")
            const rawPermissions: Permission[] = response?.data?.data || []

            const grouped = groupBy(rawPermissions, (p: Permission) =>
            p.slug?.split("-")[0] ?? "unknown"
            )

            const groupedArray: PermissionGroup[] = Object.entries(grouped).map(
            ([group, items]) => ({
                group,
                items
            })
            )

            setPermissionGroups(groupedArray)
        } catch (error) {
            console.error("Failed to fetch permission list:", error)
        }
    }

    useEffect(() => {
        setLoading(true)
        const fetchAll = async () => {
            try {
                if (open) {
                    await getPermissionList()
                }

                if (roleId) {
                    const response = await getPermissions(roleId)
                    const permissions: string[] = response?.data || []

                    form.setValue("permissions", permissions)
                }
                
            } catch (error) {
                console.error("Failed to initialize role permissions", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [open, roleId, form])

    const submitPermission = async (values: FormValues) => {
        setLoading(true);
        try {
            const payload = {
                permissions: values.permissions
            }
            const updateData = await updatePermissions(roleId ?? "", payload) as FetchApiResponse<RolePermission>;
            if (updateData.status === 200) {
                toast.success("Role permissions updated successfully");
                setErrorMsg(undefined);
                onUpdateRolePermissionSuccess()
                onClose()
            } else {
                setErrorMsg(updateData.error as ValidationError);
                toast.error("Failed to update data");
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const allPermissions = permissionGroups.flatMap((group) =>
        group.items.map((p) => p.slug)
    )

    const selectedPermissions = form.watch("permissions")

    const isAllSelected = allPermissions.every((slug) =>
        selectedPermissions.includes(slug ?? "")
    )

    const toggleAll = (checked: boolean) => {
        if (checked) {
            form.setValue("permissions", allPermissions.filter((p): p is string => p !== null))
        } else {
            form.setValue("permissions", [])
        }
    }

    const toggleGroup = (groupItems: Permission[], checked: boolean) => {
        const current = new Set(form.getValues("permissions"))
        groupItems.forEach((item) => {
            if (checked) {
                current.add(item.slug ?? "")
            } else {
                current.delete(item.slug ?? "")
            }
        })
        form.setValue("permissions", Array.from(current))
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        Role Permissions{moduleTitle ? ` | ${moduleTitle}` : ""}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <LoadingSection />
                    ) : (
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(submitPermission)}
                        className="space-y-5"
                        >
                        {/* Select All */}
                        <div className="border rounded p-4 bg-muted/30">
                            <div className="flex items-center space-x-2">
                            <Checkbox
                                id="selectAll"
                                checked={isAllSelected}
                                onCheckedChange={(checked) =>
                                toggleAll(checked === true)
                                }
                            />
                            <Label htmlFor="selectAll" className="font-medium cursor-pointer">
                                Select All Permissions
                            </Label>
                            </div>
                        </div>

                        {/* Per Group */}
                        {permissionGroups.map((group, index) => {
                            const groupSlugs = group.items.map((p) => p.slug)
                            const isGroupChecked = groupSlugs.every((slug) =>
                            selectedPermissions.includes(slug ?? "")
                            )

                            return (
                            <div key={index} className="border rounded p-4">
                                <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold capitalize">
                                    {group.group}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                    id={`selectAll-${index}`}
                                    checked={isGroupChecked}
                                    onCheckedChange={(checked) =>
                                        toggleGroup(group.items, checked === true)
                                    }
                                    />
                                    <Label htmlFor={`selectAll-${index}`} className="text-sm cursor-pointer">Select All</Label>
                                </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {group.items.map((permission) => (
                                    <div
                                    key={permission.slug}
                                    className="flex items-center space-x-2"
                                    >
                                    <Checkbox
                                        id={permission.slug ?? ""}
                                        checked={selectedPermissions.includes(
                                        permission.slug ?? ""
                                        )}
                                        onCheckedChange={(checked) => {
                                        const current = new Set(
                                            form.getValues("permissions")
                                        )
                                        if (checked) {
                                            current.add(permission.slug ?? "")
                                        } else {
                                            current.delete(permission.slug ?? "")
                                        }
                                        form.setValue(
                                            "permissions",
                                            Array.from(current)
                                        )
                                        }}
                                    />
                                    <Label
                                        htmlFor={permission.slug ?? ""}
                                        className="text-sm cursor-pointer"
                                    >
                                        {permission.title}
                                    </Label>
                                    </div>
                                ))}
                                </div>
                            </div>
                            )
                        })}
                        {errorMsg && 
                            (
                                <>
                                <AlertValidations {...errorMsg} />
                                </>
                            )
                        }
                        <DialogFooter className="sm:justify-end mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" disabled={loading}>
                                    Close
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={loading}>
                                <SpinnerCaption
                                    loading={loading}
                                    loadingValue="Saving..."
                                    defaultValue="Save Changes"
                                />
                            </Button>
                        </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}
