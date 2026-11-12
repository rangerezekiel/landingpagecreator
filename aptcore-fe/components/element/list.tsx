import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";

type ListType = {
    id: string,
    title: string | null,
    subtitle?: string,
    description?: string,
    onEdit?: (id: string, title: string) => void;
    onDelete?: (id: string, title: string) => void;
}

export default function List({
    id,
    title,
    subtitle,
    description,
    onEdit,
    onDelete,
} : ListType) {
    return (
        <>
            <div className="w-full border hover:border-gray-500 dark:hover:border-gray-200 rounded p-3 flex justify-between items-center gap-5">
                <div>
                    <small className="text-sm">{subtitle ?? ''}</small>
                    <h2 className="text-lg font-semibold mb-2">{title}</h2>
                    <span>{description ?? ''}</span>
                </div>
                <div className="flex gap-3 justify-center">
                    <Button
                        variant="destructive"
                        onClick={() => onDelete && onDelete(id, title ?? "")}
                    >
                        <TrashIcon />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onEdit && onEdit(id, title ?? "")}
                    >
                        <EditIcon />
                    </Button>
                </div>
            </div>
        </>
    )
}