import { TriangleAlert } from 'lucide-react';

export default function PageNotFound(){
    return (
        <>
            <div className="min-h-[90vh] rounded bg-gray-100 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="flex justify-center mb-6">
                    <TriangleAlert className="h-15 w-15 text-yellow-500 " />
                    </div>
                    <h1 className="animate-bounce text-5xl font-bold text-gray-900 mb-4">
                    404
                    </h1>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    Page Not Found!
                    </h2>
                </div>
            </div>
        </>
    )
}