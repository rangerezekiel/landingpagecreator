import {
  Eye,
  Shield,
  Pencil,
  Trash2,
} from "lucide-react"
import { Role as ThisType } from "@/app/_types/role";
import { Button } from "@/components/ui/button";

// Define headers
export const dataHeaders = [
    { value: "slug", label: "Slug", isSort: true, thClass: null },
    { value: "title", label: "Title", isSort: true, thClass: null },
    { value: "action", label: "Action", isSort: false, thClass: null },
];

// Define how each cell for data should be rendered

export function getDataCells({
  canDelete = false,
  canUpdate = false,
  canShow = false,
  canRolePermission = false,
  onDelete,
  onShow,
  onEdit,
  onRolePermission,
}: {
  canDelete?: boolean;
  canUpdate?: boolean;
  canShow?: boolean;
  canRolePermission?: boolean;
  onDelete: ({ id, title }: { id: string; title: string | null }) => void;
  onShow: ({ id, title }: { id: string; title: string | null }) => void;
  onRolePermission: ({ id, title }: { id: string; title: string | null }) => void;
  onEdit: ({ id }: { id: string }) => void;
}) {
    return [
        { 
        tdClass: null, 
            html: (item: ThisType) => {
                return (
                    <>
                    <div className={`flex items-center gap-3 ${canShow ? 'cursor-pointer font-medium dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`} onClick={canShow ? () => onShow({ id: item.id, title: item.slug }) : undefined}>
                        {item.slug}
                    </div>
                    </>
                )
            } 
        },
        { tdClass: null, html: (item: ThisType) => item.title },
        {
        tdClass: null,
        html: (item: ThisType) => (
            <>
                {
                    (canShow || canUpdate || canDelete || canRolePermission) ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {canShow && (
                                <Button
                                variant="ghost"
                                className="h-8 px-2 text-sm"
                                onClick={() => onShow({ id: item.id, title: item.title })}
                                >
                                <Eye className="w-4 h-4" />
                                View
                                </Button>
                            )}

                            {canRolePermission && (
                                <Button
                                variant="ghost"
                                className="h-8 px-2 text-sm"
                                onClick={() => onRolePermission({ id: item.id, title: item.title })}
                                >
                                <Shield className="w-4 h-4" />
                                Role Permissions
                                </Button>
                            )}

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

                            {canDelete && (
                                <Button
                                variant="ghost"
                                className="h-8 px-2 text-sm text-red-600 hover:text-red-700"
                                onClick={() => onDelete({ id: item.id, title: item.title })}
                                >
                                <Trash2 className="w-4 h-4" />
                                Delete
                                </Button>
                            )}
                            </div>
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