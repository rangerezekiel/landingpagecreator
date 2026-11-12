import { LoaderPinwheel } from "lucide-react"

export default function SpinnerCaption({ loading, loadingValue, defaultValue = null }: 
    { loading: boolean, loadingValue: string | null, defaultValue: string | React.ReactNode | null }) {
    if(loading){
        return (
            <div className="flex items-center justify-center">
                <LoaderPinwheel className="animate-spin mr-2" /> {loadingValue}
            </div>
        )
    }else{
        return (
            <>{defaultValue}</>
        )
    }
}
