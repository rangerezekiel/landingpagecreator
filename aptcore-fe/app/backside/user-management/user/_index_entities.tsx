import { UserIndex } from "@/app/_types/user";
import { Website } from "@/app/_types/website";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Pencil,
  Trash2,
  Undo2,
  Trash,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setInitialName, storageUrl } from "@/app/_utils/objectTransformers";
import { Separator } from "@/components/ui/separator";
import { Globe } from 'lucide-react';
import Link from "next/link";

// Define headers
export const dataHeaders = [
  { value: "fullName", label: "Full Name", isSort: true, thClass: null },
  { value: "username", label: "Username", isSort: true, thClass: null },
  { value: "email", label: "Email", isSort: true, thClass: null },
  { value: "role", label: "Role", isSort: false, thClass: null },
  { value: "action", label: "Action", isSort: false, thClass: null },
];

export function getDataCells({
  canDelete = false,
  canUpdate = false,
  canShow = false,
  canDeletePermanently = false,
  canRestore = false,
  isSuperadmin = false,
  websiteMap = {},
  onDelete,
  onShow,
  onEdit,
  onRestore,
  onDeletePermanently,
}: {
  canDelete?: boolean;
  canUpdate?: boolean;
  canShow?: boolean;
  canDeletePermanently?: boolean;
  canRestore?: boolean;
  isSuperadmin?: boolean;
  websiteMap?: Record<string, Website>;
  onDelete: ({ id, fullName }: { id: string; fullName: string | null }) => void;
  onShow: ({ id, fullName }: { id: string; fullName: string | null }) => void;
  onEdit: ({ id }: { id: string }) => void;
  onRestore: ({ restoreId }: { restoreId: string }) => void;
  onDeletePermanently: ({ id, fullName }: { id: string; fullName: string | null }) => void;
  
}) {
  return [
    { 
      tdClass: null, 
      html: (item: UserIndex) => {
        return (
          <>
            <div className={`flex items-center gap-3 ${canShow ? 'cursor-pointer font-medium dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`} onClick={canShow ? () => onShow({ id: item.id, fullName: item.fullName }) : undefined}>
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={storageUrl(item?.avatar) ?? ''} alt={item?.fullName ?? ''} />
                <AvatarFallback className="rounded-full">
                  {item?.fullName ? setInitialName(item.fullName) : ''}
                </AvatarFallback>
              </Avatar>
              <span className={`${canShow ? 'cursor-pointer font-medium dark:hover:text-yellow-500 hover:text-yellow-950' : ''}`}>              
                {item.fullName}
              </span>
            </div>
            {isSuperadmin && (
              (() => {
                // Build list of website ids (supports string | string[] | undefined)
                const rawWebsiteId = (item as unknown as { websiteId?: unknown }).websiteId
                const websiteIds: string[] = Array.isArray(rawWebsiteId)
                  ? (rawWebsiteId as string[]).filter(Boolean)
                  : rawWebsiteId
                    ? [String(rawWebsiteId)]
                    : []

                // Resolve each website via lookup map
                const resolvedWebsites: Website[] = websiteIds
                  .map((id) => websiteMap[`${id}`])
                  .filter((w): w is Website => Boolean(w))

                // If none resolved, fallback to embedded single website
                const websitesToShow: Website[] =
                  resolvedWebsites.length > 0
                    ? resolvedWebsites
                    : (item.website ? [item.website] : [])

                return websitesToShow.length > 0 ? (
                  <>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2">
                      {websitesToShow.map((w) => (
                        <Link
                          key={w.id}
                          href={`/backside/website/${w.domain}/config`}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Globe className="h-4 w-4" /> {w.domain}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : null
              })()
            )}
          </>
        )
        } 
    },
    { tdClass: null, html: (item: UserIndex) => item.username },
    { tdClass: null, html: (item: UserIndex) => item.email },
    {
    tdClass: null,
    html: (item: UserIndex) => {
      return (
        <div className="flex flex-wrap gap-1">
          {item.roles.map((role, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      )
    },
  },
    {
      tdClass: null,
      html: (item: UserIndex) => {
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
                    onClick={() => onShow({ id: item.id, fullName: item.fullName })}
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
                    onClick={() => onDelete({ id: item.id, fullName: item.fullName })}
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
                        onDeletePermanently({ id: item.id, fullName: item.fullName })
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
