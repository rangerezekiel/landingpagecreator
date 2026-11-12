import { Eye, Trash2, CheckCheck } from "lucide-react"
import { FormSubmission as ThisType } from "@/app/_types/form-submission";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { Separator } from "@/components/ui/separator";
import ReadMoreArea from "@foxeian/react-read-more";

// Define headers
export const dataHeaders = [
    { value: "name", label: "Name", isSort: true, thClass: null },
    { value: "email", label: "Email", isSort: true, thClass: null },
    { value: "phone", label: "Phone", isSort: false, thClass: null },
    { value: "website", label: "Website", isSort: false, thClass: null },
    { value: "message", label: "Message", isSort: false, thClass: "w-sm text-wrap break-words" },
    { value: "createdAt", label: "Created at", isSort: true, thClass: null },
    { value: "readAt", label: "Read at", isSort: true, thClass: null },
    { value: "action", label: "Action", isSort: false, thClass: null },
];

// Define how each cell for data should be rendered
export function getDataCells({
  canDelete = false,
//   canUpdate = false,
  canShow = false,
  onDelete,
  onShow,
//   onEdit,
}: {
  canDelete?: boolean;
  canUpdate?: boolean;
  canShow?: boolean;
  onDelete: ({ id, name }: { id: string; name: string | null }) => void;
  onShow: ({ id, name }: { id: string; name: string | null }) => void;
  onEdit: ({ id }: { id: string }) => void;
}) {
    return [
        { 
        tdClass: null, 
            html: (item: ThisType) => {
                return (
                    <>
                    <small className={`flex items-center gap-3 ${canShow ? 'cursor-pointer font-medium dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`} onClick={canShow ? () => onShow({ id: item.id, name: item.name }) : undefined}>
                        {item.name}
                    </small>
                    </>
                )
            } 
        },
        { tdClass: null, html: (item: ThisType) => (<small>{item.email}</small>) },
        { tdClass: null, html: (item: ThisType) => (<small>{item.phone}</small>) },
        { tdClass: null, html: (item: ThisType) => (
            <>
            <div className="flex flex-col gap-1">
                {item.website ? (
                    <>
                        <small className="text-xs text-gray-500 dark:text-gray-400">
                            {item.website.domain}
                        </small>
                    </>
                ) : (
                    <small className="text-gray-400 italic">No website</small>
                )}
            </div>
            </>
        ) },
        { tdClass: null, html: (item: ThisType) => (
            <>
            <div className="max-w-sm text-wrap break-words">
                <span>
                    {(item.message?.length ?? 0) > 30 ? (
                    <ReadMoreArea lettersLimit={30}>
                        {item.message}
                    </ReadMoreArea>
                    ) : (
                    <span>{item.message}</span>
                    )}
                </span>
            </div>
            </>
        ) },
        { tdClass: null, html: (item: ThisType) => (<small>{DateTime.fromISO(item.createdAt).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</small>) },
        { tdClass: null, html: (item: ThisType) => (
            <>
                {item.readAt ? (
                    <>
                        <small>{DateTime.fromISO(item.readAt).toRelative()}</small>
                        <Separator className="my-1" />
                        <small className="text-zinc-400 italic">
                            {item.readByUser?.fullName}
                        </small>
                    </>
                ) : (
                    <>
                        <Button size={"sm"} onClick={() => onShow({ id: item.id, name: item.name })}>
                            <CheckCheck className="w-4 h-4" />
                            Read Message
                        </Button>
                    </>
                )}
            </>
        ) },
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
                                onClick={() => onShow({ id: item.id, name: item.name })}
                                >
                                <Eye className="w-4 h-4" />
                                View
                                </Button>
                            )}

                            {/* 
                            {canUpdate && (
                                <Button
                                variant="ghost"
                                className="h-8 px-2 text-sm"
                                onClick={() => onEdit({ id: item.id })}
                                >
                                <Pencil className="w-4 h-4" />
                                Edit
                                </Button>
                            )} 
                            */}

                            {canDelete && (
                                <Button
                                variant="ghost"
                                className="h-8 px-2 text-sm text-red-600 hover:text-red-700"
                                onClick={() => onDelete({ id: item.id, name: item.name })}
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