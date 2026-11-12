import { ValidationError } from "@/app/_types/fetch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function AlertValidations(error: ValidationError){
    return (
        <Alert variant="warning" className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
            <TriangleAlert className="stroke-yellow-600 dark:stroke-yellow-400" />
            <AlertTitle className="text-yellow-600 dark:text-yellow-400">Failed Created</AlertTitle>
            <AlertDescription className="text-black dark:text-white">
                <ul className="list-disc ms-2 text-red-600 dark:text-red-400">
                {error.errors?.map((e, index) => (
                    <li key={index}>
                    {e.message}
                    </li>
                ))}
                </ul>
            </AlertDescription>
        </Alert>
    )
}