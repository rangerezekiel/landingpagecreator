
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Website as ThisType } from "@/app/_types/website"
import LoadingSection from "@/components/element/loading-section"
import { ShowDialogProps } from "@/app/_types/form-props"
import { storageUrl } from "@/app/_utils/objectTransformers"
import Image from "next/image"


export default function ShowThisData({
open,
moduleTitle,
loading = false,
onClose,
showData
}: ShowDialogProps<ThisType>){
    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="flex items-center gap-1">Detail {moduleTitle}</DialogTitle>
                </DialogHeader>
                {loading ? 
                    (
                        <LoadingSection />
                    ) : 
                    (
                        <>
                        
                            <div className="flex justify-center mt-5">
                                {showData?.logo ? (
                                <Image src={storageUrl(showData.logo)} alt="logo" width={200} height={200} className="h-full w-1/3 rounded-lg object-cover border shadow-lg" />
                                ) : (
                                <span className="italic text-muted-foreground">No Logo</span>
                                )}
                            </div>
                            <div className="flow-root my-5 py-3 border rounded">
                                <dl className="-my-3 divide-y divide-gray-200 dark:divide-gray-700 text-sm *:even:bg-gray-50 dark:*:even:bg-gray-800/40">
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Domain</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.domain}</dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Title</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.title}</dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Theme</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.theme}</dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Favicon</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">
                                            {showData?.favicon ? (
                                            <Image src={storageUrl(showData.favicon)} alt="favicon" width={200} height={200} className="h-full w-1/3 rounded-lg object-cover border shadow-lg" />
                                            ) : (
                                            <span className="italic text-muted-foreground">No favicon</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Meta Title</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.metaTitle ?? '-'}</dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Meta Description</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.metaDescription ?? '-'}</dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900 dark:text-gray-100">Api Key</dt>
                                        <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.apiKey ?? '-'}</dd>
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