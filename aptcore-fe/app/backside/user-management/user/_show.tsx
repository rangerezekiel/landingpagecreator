
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "@/app/_types/user"
import LoadingSection from "@/components/element/loading-section"
import { ShowDialogProps } from "@/app/_types/form-props"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { storageUrl } from "@/app/_utils/objectTransformers"


export default function ShowThisData({
open,
moduleTitle,
loading = false,
onClose,
showData
}: ShowDialogProps<User>){
    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="flex items-center gap-1">Detail | {moduleTitle}</DialogTitle>
                </DialogHeader>
                {loading ? 
                    (
                        <LoadingSection />
                    ) : 
                    (
                        <>
                            <div className="flex justify-center mt-5">
                                {showData?.avatar ? (
                                <Image src={storageUrl(showData.avatar)} alt="Avatar" width={200} height={200} className="h-full w-1/3 rounded-lg object-cover border shadow-lg" />
                                ) : (
                                <span className="italic text-muted-foreground">No avatar</span>
                                )}
                            </div>
                            <div className="flow-root my-5 py-3 border rounded ">
                                <dl className="-my-3 divide-y divide-gray-200 dark:divide-gray-700 text-sm *:even:bg-gray-50 dark:*:even:bg-gray-800/40">
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Full Name</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.fullName || "-"}</dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Username</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.username || "-"}</dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Email</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.email || "-"}</dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Phone</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.phone || "-"}</dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Roles</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">
                                            <div className="flex flex-wrap gap-1">
                                            {showData?.roles && showData.roles.length > 0 ? (
                                                showData.roles.map((role: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {role}
                                                </Badge>
                                                ))
                                            ) : (
                                                <span className="italic text-muted-foreground">No roles assigned</span>
                                            )}
                                            </div>
                                        </dd>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Website</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.website?.domain || "-"}</dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Created At</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">
                                            {showData?.createdAt ? new Date(showData.createdAt).toLocaleString() : "-"}
                                        </dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Updated At</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">
                                            {showData?.updatedAt ? new Date(showData.updatedAt).toLocaleString() : "-"}
                                        </dd>
                                    </div>

                                </dl>
                            </div>
                        </>
                    )
                }
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}