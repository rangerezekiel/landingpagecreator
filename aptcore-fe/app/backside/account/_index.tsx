'use client'

import { useGlobalContext } from "@/app/_providers/GlobalContextProvider";
import { logoutProcess } from "@/app/_services/auth";
import { showData } from "@/app/_services/user";
import { FetchApiResponse } from "@/app/_types/fetch";
import { User } from "@/app/_types/user";
import AccountForm from "@/app/backside/account/_form";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useBreadcrumbs } from '@/app/_providers/BreadcrumbContext';

export default function AccountPageIndex(){
    // Breadcrumb START
    const { setBreadcrumbs } = useBreadcrumbs();
      useEffect(() => {
        setBreadcrumbs([
        { label: 'Account' },
        ]);

        return () => {
        };
    }, [setBreadcrumbs])
    // Breadcrumb END
    
    const context = useGlobalContext();
    const profileData = context;
    
    const userId = profileData?.user?.id;
    const [userData, setUserData] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                setIsLoading(true)
                try {
                    const data = await showData(userId) as FetchApiResponse<User>
                    if(data.status === 401){
                        await logoutProcess()
                    }
                    setUserData(data.data ?? null)
                } catch (err) {
                    console.error("Error fetching user data:", err)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }
        
        fetchData()
    }, [userId])
    
    return (
        <>
        <h2 className="mb-6 text-center text-2xl font-bold">Update User Profile</h2>
        {isLoading ? 
            (
                <div className="container mx-auto p-4 max-w-md">
                    <div className="flex flex-col space-y-3">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[250px]" />
                        </div>
                        <Skeleton className="h-[125px] w-full rounded-xl" />
                    </div>
                </div>
            )
        :
        (
            <AccountForm initialData={userData!} userId={userId!} />
        ) }
        </>
    )
}