'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import Forbidden from "@/components/element/errors/forbidden"
import LoadingSection from "@/components/element/loading-section"

import { useAcl } from "@/lib/acl"
import { useEffect, useState } from "react"
import { Permission as ThisType } from "@/app/_types/permission"
import DataTable from "@/components/data-table"

import { deleteData as deleteDataApi,
         indexData as indexDataApi, 
         showData as showDataApi } 
from "@/app/_services/permission"

import { dataHeaders, getDataCells } from "./_index_entities"
import CreateThisData from "./_create"
import { toast } from "sonner"
import { FetchApiResponse } from "@/app/_types/fetch"
import DeleteDialog from "@/components/dialog/delete-dialog"

import ShowThisData from "./_show"
import EditThisData from "./_edit"
import { toastAndLog } from "@/lib/activity-log/client"

const modulePage = 'permission'
const moduleTitle = 'Permission'

export default function ThisIndex(){
    // Breadcrumb START
    const { setBreadcrumbs } = useBreadcrumbs()
      useEffect(() => {
        setBreadcrumbs([
        { label: 'User Management' },
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
    
    // Edit State START
        const [openEditDialog, setOpenEditDialog] = useState(false);
        const [loadingEdit, setLoadingEdit] = useState(false);
        const [editData, setEditData] = useState<ThisType | null>(null);
        const [selectedIdToEdit, setSelectedIdToEdit] = useState<string | null>(null);
    // Edit State END
    
    useEffect(() => {
        const initData = {
            id: "",
            slug: "",
            title: "",
        }
        setShowData(initData)
        setEditData(initData)
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
    
    const canDelete = hasPermission([`${modulePage}-delete`])

    const handleOpenDeleteDialog = ({ id, title }: { id: string, title: string | null }) => {
        setSelectedIdToDelete(id);
        setSelectedTitleToDelete(title)
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedIdToDelete) {
            setLoadingDelete(true);
            try {
                const deleteData = await deleteDataApi(selectedIdToDelete) as FetchApiResponse<ThisType>;

                // Toast and Log START
                const LogInfo = {
                    success: deleteData.status === 200,
                    module : 'PERMISSION',
                    action : 'DELETE',
                    msg : 'DELETED',
                    title: selectedTitleToDelete,
                    payload : {title: selectedTitleToDelete, id: selectedIdToDelete},
                    payloadFailed : {title: selectedTitleToDelete, id: selectedIdToDelete},
                }

                await toastAndLog(LogInfo)
                // Toast and Log END

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
    
    const handleOpenShowDialog = async ({ id, title }: { id: string, title: string | null }) => {
        setLoadingShow(true)
        setShowDataTitle(title)
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
    
    const canUpdate = hasPermission([`${modulePage}-update`])
    
    const handleOpenEditDialog = async ({ id }: { id: string }) => {
        setSelectedIdToEdit(id)
        setLoadingEdit(true)
        setOpenEditDialog(true)
        try {
            const data = await showDataApi(id) as FetchApiResponse<ThisType>;
            if (data.status === 200) {
                setEditData(data.data || null)
            } else {
                toast.error("Failed to fetch data");
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingEdit(false)
        }
    };

    // Update section END

    return (
        <>
            <div className="lg:px-0 px-5 pb-5">
                <h1 className="mb-6 text-2xl font-bold">{moduleTitle}</h1>
                <DataTable<ThisType & { id: string | number }>
                    headers={dataHeaders}
                    dataCells={
                        getDataCells({canDelete,
                                        canUpdate: canUpdate,
                                        canShow: canShow,
                                        onDelete: handleOpenDeleteDialog,
                                        onShow: handleOpenShowDialog,
                                        onEdit: handleOpenEditDialog
                        })
                    }
                    fetchDataService={indexDataApi}
                    elementRight={
                        hasPermission([`${modulePage}-store`]) ?
                        <CreateThisData moduleTitle={moduleTitle} onSaveSuccess={() => handleRefreshData()} /> 
                        : null
                    }
                    defaultSortBy="slug"
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
            
            <EditThisData 
                editId={selectedIdToEdit}
                open={openEditDialog}
                loadingShow={loadingEdit}
                moduleTitle={moduleTitle}
                onClose={() => setOpenEditDialog(false)}
                editData={editData}
                onUpdateSuccess={() => handleRefreshData()}
            />
            {/* Modals END */}
        </>
    )
}