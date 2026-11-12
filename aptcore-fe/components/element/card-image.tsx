import Image from "next/image"
import { Button } from "../ui/button"
import { Edit2, Trash2 } from "lucide-react"

type CardType = {
    id: string,
    title: string | null,
    subtitle?: string
    subtitleJSX?: React.ReactNode
    imgUrl: string,
    onEdit?: (id: string, title: string) => void;
    onDelete?: (id: string, title: string) => void;
}

export default function CardImage({
    id,
    title,
    subtitle,
    subtitleJSX,
    imgUrl,
    onEdit,
    onDelete,
} : CardType){
    return (
        <article className="flex flex-col rounded-lg dark:border shadow-sm transition hover:shadow-md h-full overflow-hidden">
            <div className="w-full">
                <Image
                alt=""
                src={imgUrl}
                width={1920}
                height={1080}
                className="w-full h-auto object-contain shadow-sm"
                />
            </div>

            <div className="flex flex-col flex-1 p-3 sm:p-4">
                <h3 className="mt-0.5 text-lg">{title}</h3>

                {subtitleJSX ? (
                <div className="text-sm">{subtitleJSX}</div>
                ) : subtitle ? (
                <p className="text-sm text-gray-500">{subtitle}</p>
                ) : null}

                <div className="mt-auto flex gap-3 justify-center pt-4">
                    <Button
                    className="w-1/2"
                        variant="destructive"
                        onClick={() => onDelete && onDelete(id, title ?? "")}
                    >
                        <Trash2/> Delete
                    </Button>
                    <Button
                    className="w-1/2"
                        variant="outline"
                        onClick={() => onEdit && onEdit(id, title ?? "")}
                    >
                        <Edit2 />
                        Edit
                    </Button>
                </div>
            </div>
        </article>

    )
}