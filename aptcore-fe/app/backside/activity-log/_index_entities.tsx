import { Eye, Trash2 } from "lucide-react"
import { ActivityLog as ThisType } from "@/app/_types/activity-log";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { Separator } from "@/components/ui/separator";

// Define headers
export const dataHeaders = [
    { value: "module", label: "Module", isSort: false, thClass: null },
    { value: "note", label: "Info", isSort: false, thClass: null },
    { value: "user", label: "By", isSort: false, thClass: null },
    // { value: "website", label: "User from Website", isSort: false, thClass: null },
    { value: "createdAt", label: "Created at", isSort: true, thClass: null },
    { value: "", label: "", isSort: false, thClass: null },
];

// Define how each cell for data should be rendered
export function getDataCells({
  canDelete = false,
  canShow = false,
  onDelete,
  onShow,
}: {
  canDelete?: boolean;
  canUpdate?: boolean;
  canShow?: boolean;
  onDelete: ({ id, module }: { id: string; module: string | null }) => void;
  onShow: ({ id, module }: { id: string; module: string | null }) => void;
  onEdit: ({ id }: { id: string }) => void;
}) {
    return [
        { tdClass: null, html: (item: ThisType) => {return (<>{item.module.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</>)} },
        { 
        tdClass: null, 
            html: (item: ThisType) => {
                return (
                    <>
                    <div className={`flex items-center gap-3 ${canShow ? 'cursor-pointer  dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`} onClick={canShow ? () => onShow({ id: item.id, module: item.module }) : undefined}>
                        {item.note}
                    </div>
                    </>
                )
            } 
        },
        { tdClass: null, html: (item: ThisType) => (<>
            {item.user?.fullName ?? '-'} {item.website ? (<>
                <Separator className="my-2"/>
                <span>
                    {item.website.title} ({item.website.domain})
                </span>
            </>) : null}
        </>) },
        // { tdClass: null, html: (item: ThisType) => item.user?.fullName ?? '-' },
        // { tdClass: null, html: (item: ThisType) => item.website?.domain ?? '-' },
        { tdClass: null, html: (item: ThisType) => DateTime.fromISO(item.createdAt).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY) },
        {
        tdClass: null,
        html: (item: ThisType) => (
            <>
                {
                    (canShow || canDelete) ? (
                        <>
                            <div className="flex flex-wrap items-center gap-2">
                                {canShow && (
                                    <Button
                                    variant="ghost"
                                    className="h-8 px-2 text-sm"
                                    onClick={() => onShow({ id: item.id, module: item.module })}
                                    >
                                    <Eye className="w-4 h-4" />
                                    View
                                    </Button>
                                )}

                                {canDelete && (
                                    <Button
                                    variant="ghost"
                                    className="h-8 px-2 text-sm text-red-600 hover:text-red-700"
                                    onClick={() => onDelete({ id: item.id, module: item.module })}
                                    >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                    </Button>
                                )}
                                </div>
                        </>
                    )
                    :
                    (<span className="text-zinc-400 italic text-xs">
                        No Action
                    </span>)
                }
            </>
        ),
    },
  ];
}