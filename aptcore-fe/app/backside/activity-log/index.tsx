'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import Forbidden from "@/components/element/errors/forbidden"
import LoadingSection from "@/components/element/loading-section"

import { useAcl } from "@/lib/acl"
import { useEffect, useState } from "react"
import { ActivityLog as ThisType } from "@/app/_types/activity-log"
import DataTable from "@/components/data-table"

import { deleteData as deleteDataApi,
         indexData as indexDataApi, 
         showData as showDataApi } 
from "@/app/_services/activity-log"

import { dataHeaders, getDataCells } from "./_index_entities"
import { toast } from "sonner"
import { FetchApiResponse } from "@/app/_types/fetch"
import DeleteDialog from "@/components/dialog/delete-dialog"

import ShowThisData from "./_show"

const modulePage = 'activity-log'
const moduleTitle = 'Activity Log'

export default function ThisIndex(){
    // Breadcrumb START
    const { setBreadcrumbs } = useBreadcrumbs()
      useEffect(() => {
        setBreadcrumbs([
        { label: moduleTitle },
        ])

        return () => {
        }
    }, [setBreadcrumbs])
    // Breadcrumb END

    // ACL START
    const { hasPermission, isAuthenticated, permissions } = useAcl()
    const [aclLoaded, setAclLoaded] = useState(false)

    const [refreshData, setRefreshData] = useState(0);

    // Delete State START
        const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
        const [loadingDelete, setLoadingDelete] = useState(false);
        const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null);
        const [selectedTitleToDelete, setSelectedTitleToDelete] = useState<string | null>(null);
    // Delete State END
    
    // Show State START
        const [openShowDialog, setOpenShowDialog] = useState(false);
        const [loadingShow, setLoadingShow] = useState(false);
        const [showDataTitle, setShowDataTitle] = useState<string | null>(null);
        const [showData, setShowData] = useState<ThisType | null>(null);
    // Show State END
    
    useEffect(() => {
        const initData = {
            id: "",
            websiteId: "",
            userId: "",
            action: "",
            module: "",
            note: "",
            ipAddress: "",
            userAgent: "",
            url: null,
            method: "",
            status: "",
            payload: null,
            createdAt: "",
            website: null,
            user: null
        }
        setShowData(initData)
    }, [])

    useEffect(() => {
        if (isAuthenticated !== undefined && permissions !== undefined) {
            setAclLoaded(true)
        }
    }, [isAuthenticated, permissions])

    if (!aclLoaded) {
        return <LoadingSection />
    }

    if(hasPermission && !hasPermission([`${modulePage}-index`])){
        return <Forbidden />
    }
    // ACL END

    const handleRefreshData = () => {
        setRefreshData(prev => prev + 1);
    };

    // Delete section START
    
    const canDelete = false //hasPermission([`${modulePage}-delete`])

    const handleOpenDeleteDialog = ({ id, module }: { id: string, module: string | null }) => {
        setSelectedIdToDelete(id);
        setSelectedTitleToDelete(module)
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedIdToDelete) {
            setLoadingDelete(true);
            try {
                const deleteData = await deleteDataApi(selectedIdToDelete) as FetchApiResponse<ThisType>;
                if (deleteData.status === 200) {
                    toast.success("Data deleted successfully");
                } else {
                    toast.error("Failed to save data");
                }

            } catch (err) {
                console.error(err)
            } finally {
                setLoadingDelete(false)
            }
            setOpenDeleteDialog(false);
            handleRefreshData()
        }
    };
    
    const canShowTrashOption = false

    // Delete section END

    // Show section START
    
    const canShow = hasPermission([`${modulePage}-show`])
    
    const handleOpenShowDialog = async ({ id, module }: { id: string, module: string | null }) => {
        setLoadingShow(true)
        setShowDataTitle(module)
        setOpenShowDialog(true)
        try {
            const data = await showDataApi(id) as FetchApiResponse<ThisType>;
            if (data.status === 200) {
                setShowData(data.data || null)
            } else {
                toast.error("Failed to fetch data");
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingShow(false)
        }
    };

    // Show section END

    // Update section START
    
    // const canUpdate = hasPermission([`${modulePage}-update`])

    // Update section END

    return (
        <>
            <div className="lg:px-0 px-5 pb-5">
                <h1 className="mb-6 text-2xl font-bold">{moduleTitle}</h1>
                <DataTable<ThisType & { id: string | number }>
                    headers={dataHeaders}
                    dataCells={getDataCells({
                        canDelete,
                        canShow: canShow,
                        onDelete: handleOpenDeleteDialog, // Add onDelete handler
                        onShow: handleOpenShowDialog,
                        onEdit: () => {}, // Add onEdit handler (can be a no-op if not used)
                    })}
                    fetchDataService={indexDataApi}
                    defaultSortBy="createdAt"
                    defaultSortDirection="desc"
                    refreshTriger={refreshData}
                    showTrashOption={canShowTrashOption}
                    showNumber={true}
                />
            </div>

            {/* Modals START */}
            <DeleteDialog
                open={openDeleteDialog}
                title={selectedTitleToDelete}
                loading={loadingDelete}
                onConfirm={handleConfirmDelete}
                onClose={() => setOpenDeleteDialog(false)}
            />
            
            <ShowThisData 
                open={openShowDialog}
                moduleTitle={showDataTitle}
                loading={loadingShow}
                onClose={() => setOpenShowDialog(false)}
                showData={showData}
            />
            {/* Modals END */}
        </>
    )
}