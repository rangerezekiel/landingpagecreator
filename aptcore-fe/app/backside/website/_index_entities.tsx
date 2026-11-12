import { Website as ThisType, Website } from "@/app/_types/website";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setInitialName, storageUrl } from "@/app/_utils/objectTransformers";
import { Eye, Pencil, Trash2, Clock, Undo2, Trash, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { updateData } from "@/app/_services/website";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FetchApiResponse } from "@/app/_types/fetch";
import { Activitylog } from "@/lib/activity-log/client";

// Define headers
export const dataHeaders = [
    { value: "domain", label: "Domain", isSort: true, thClass: null },
    { value: "title", label: "Title", isSort: true, thClass: null },
    { value: "active", label: "Active", isSort: true, thClass: null },
    { value: "action", label: "Action", isSort: false, thClass: null },
];

// Define how each cell for data should be rendered
export function getDataCells({
  canDelete = false,
  canUpdate = false,
  canShow = false,
  canDeletePermanently = false,
  canRestore = false,
  onDelete,
  onShow,
  onEdit,
  onRestore,
  onDeletePermanently,
  refreshData,
  triggerWebsiteRefresh,
}: {
  canDelete?: boolean;
  canUpdate?: boolean;
  canShow?: boolean;
  canDeletePermanently?: boolean;
  canRestore?: boolean;
  onDelete: ({ id, title }: { id: string; title: string | null }) => void;
  onShow: ({ id, title }: { id: string; title: string | null }) => void;
  onEdit: ({ id }: { id: string }) => void;
  onRestore: ({ restoreId }: { restoreId: string }) => void;
  onDeletePermanently: ({ id, title }: { id: string; title: string | null }) => void;
  refreshData: () => void;
  triggerWebsiteRefresh?: () => void;
}) {

    const changeCheck = (item: ThisType) => async (checked: boolean) => {
        try {
            item.active = checked
            const payload = {
                title: item.title,
                domain: item.domain,
                theme: item.theme,
                active: checked
            } as unknown as ThisType;
            const updateActiveData = await updateData(item.id, payload) as FetchApiResponse<ThisType>;
            let msg = `Data ${item.domain} updated successfully`
            if (updateActiveData.status === 200) {
                toast.success(msg);
                // LOG ACTIVITY START
                await Activitylog('WEBSITE', (payload.active ? 'PUBLISH' : 'DRAFT'), msg)
                // LOG ACTIVITY END
                refreshData()
                // Trigger sidebar refresh
                triggerWebsiteRefresh?.()
            } else {
                msg = `Failed to updated ${item.domain} data`
                toast.error(msg);
            }

        } catch (err) {
            console.error(err)
        }
    }

    return [
        { 
        tdClass: null, 
            html: (item: ThisType) => {
                return (
                    <>
                    <div className="flex items-center gap-3">
                        <Link href={`/backside/website/${item.domain}/config`} className={`flex items-center gap-3 ${canShow ? 'cursor-pointer font-medium dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`} >
                            <Avatar className="h-8 w-8 rounded shadow">
                                <AvatarImage src={storageUrl(item?.logo) ?? ''} alt={item?.domain ?? ''} />
                                <AvatarFallback className="rounded shadow">
                                {item?.domain ? setInitialName(item.domain) : ''}
                                </AvatarFallback>
                            </Avatar>
                            <span className={`${canShow ? 'cursor-pointer font-medium dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`}>              
                                {item.domain}
                            </span>
                        </Link>
                        <a 
                            href={`https://${item.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#2d9bff] hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title={`Visit ${item.domain}`}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
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
                <Switch className="cursor-pointer" checked={item.active}
                      onCheckedChange={changeCheck(item)} />
            </>
        ),
        },

    {
      tdClass: null,
      html: (item: Website) => {
        const isDeleted = !!item.deletedAt;
        const showMenu = isDeleted
          ? canRestore || canDeletePermanently
          : canShow || canUpdate || canDelete;

        if (!showMenu) {
          return <span className="text-zinc-400 italic text-xs">No Action</span>;
        }

        return (
          <div className="flex flex-wrap items-center gap-2">
            {!isDeleted ? (
              <>
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
                    onClick={() => onDelete({ id: item.id, title: item.domain })}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-zinc-600 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Deleted at:
                  </div>
                  {item.deletedAt ? (
                    <Badge variant="outline" className="text-xs w-fit">
                      {new Date(item.deletedAt).toLocaleString()}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {canRestore && (
                    <Button
                      variant="ghost"
                      className="h-8 px-2 text-sm"
                      onClick={() => onRestore({ restoreId: item.id })}
                    >
                      <Undo2 className="w-4 h-4" />
                      Restore
                    </Button>
                  )}

                  {canDeletePermanently && (
                    <Button
                      variant="ghost"
                      className="h-8 px-2 text-sm text-red-600 hover:text-red-700"
                      onClick={() =>
                        onDeletePermanently({ id: item.id, title: item.domain })
                      }
                    >
                      <Trash className="w-4 h-4" />
                      Delete Permanent
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];
}
