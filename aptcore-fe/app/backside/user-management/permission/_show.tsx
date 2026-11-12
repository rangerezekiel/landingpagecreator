
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Permission as ThisType } from "@/app/_types/permission"
import LoadingSection from "@/components/element/loading-section"
import { ShowDialogProps } from "@/app/_types/form-props"


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
                        <div className="flow-root my-5 py-3 border rounded">
                            <dl className="-my-3 divide-y divide-gray-200 dark:divide-gray-700 text-sm *:even:bg-gray-50 dark:*:even:bg-gray-800/40">
                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900 dark:text-gray-100">Slug</dt>
                                    <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.slug}</dd>
                                </div>
                                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900 dark:text-gray-100">Title</dt>
                                    <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">{showData?.title}</dd>
                                </div>
                            </dl>
                        </div>
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