import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TriangleAlert } from 'lucide-react';

export default function Forbidden(){
    return (
        <>
            <div className="min-h-[90vh] rounded bg-gray-100 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="flex justify-center mb-6">
                    <TriangleAlert className="h-15 w-15 text-yellow-500 " />
                    </div>
                    <h1 className="animate-bounce text-5xl font-bold text-gray-900 mb-4">
                    403
                    </h1>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    Forbidden!
                    </h2>
                    <p className="text-gray-600 mb-8">
                    Sorry you can&apos;t access this page.
                    </p>
                    <Link href="/backside">
                        <Button>
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}