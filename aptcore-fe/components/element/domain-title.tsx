import { Globe } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DomainTitle({domain, loading = false} : {domain: string, loading?: boolean}){
    return (
      <>
        <h1 className="gap-2 flex justify-center items-center text-2xl font-bold">
          <Globe className="h-10 w-10" /> {loading ? (<Skeleton className="h-8 w-100 rounded-md" />) : domain}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`http://${domain}`, '_blank', 'noopener,noreferrer')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </h1>
        <Separator className="my-3" />
      </>
    )
}