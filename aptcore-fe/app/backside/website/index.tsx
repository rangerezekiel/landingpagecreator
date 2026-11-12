'use client'

import Forbidden from "@/components/element/errors/forbidden"
import LoadingSection from "@/components/element/loading-section"

import { useAcl } from "@/lib/acl"
import { useEffect, useState } from "react"
import { Website as ThisType } from "@/app/_types/website"
import DataTable from "@/components/data-table"

import { deleteData as deleteDataApi,
         deletePermanentlyDataApi,
         indexData as indexDataApi, 
         restoreData, 
         showData as showDataApi } 
from "@/app/_services/website"

import { dataHeaders, getDataCells } from "./_index_entities"
import CreateThisData from "./_create"
import { toast } from "sonner"
import { FetchApiResponse } from "@/app/_types/fetch"
import DeleteDialog from "@/components/dialog/delete-dialog"

import ShowThisData from "./_show"
import EditThisData from "./_edit"

const modulePage = 'website'
const moduleTitle = 'Website'
import { useRouter } from 'next/navigation'
import { toastAndLog } from '@/lib/activity-log/client'
import DeletePermanentlyDialog from "@/components/dialog/delete-permanetly-dialog"
import { useGlobalContext } from "@/app/_providers/GlobalContextProvider"

export default function ThisIndex(){
    const router = useRouter()
    const context = useGlobalContext()
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
    
    // Delete Permanently State START
        const [openDeletePermanentlyDialog, setOpenDeletePermanentlyDialog] = useState(false);
        const [loadingDeletePermanently, setLoadingDeletePermanently] = useState(false);
        const [selectedIdToDeletePermanently, setSelectedIdToDeletePermanently] = useState<string | null>(null);
        const [selectedTitleToDeletePermanently, setSelectedTitleToDeletePermanently] = useState<string | null>(null);
    // Delete Permanently State END
    
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
            title: "",
            domain: "",
            theme: "",
            favicon: "",
            logo: "",
            metaTitle: "",
            metaDescription: "",
            apiKey: "",
            active: true,
            createdBy: "",
            deletedAt: "",
            createdAt: "",
            updatedAt: "",
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

    const handleRedirectConfig = (domain : string) => {
        router.push(`/backside/website/${domain}/config`)
    }

    // Delete section START
    
    const canDelete = hasPermission([`${modulePage}-delete`])

    const handleOpenDeleteDialog = ({ id, title }: { id: string, title: string | null }) => {
        setSelectedIdToDelete(id);
        setSelectedTitleToDelete(title)
        setOpenDeleteDialog(true);
    };
    
    const handleOpenDeletePermanetlyDialog = ({ id, title }: { id: string, title: string | null }) => {
        setSelectedIdToDeletePermanently(id);
        setSelectedTitleToDeletePermanently(title)
        setOpenDeletePermanentlyDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedIdToDelete) {
            setLoadingDelete(true);
            try {
                const deleteData = await deleteDataApi(selectedIdToDelete) as FetchApiResponse<ThisType>;
    
                // Toast and Log START
                const LogInfo = {
                    success: deleteData.status === 200,
                    module : 'WEBSITE',
                    action : 'DELETE',
                    msg : 'DELETED',
                    title: selectedTitleToDelete ?? null,
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
    
    // Delete section END
    const canDeletePermanently = hasPermission([`${modulePage}-delete-permanently`])
    const canRestore = hasPermission([`${modulePage}-update-restore`])

    const canShowTrashOption = hasPermission([`${modulePage}-index-with-trash`])

    const handleConfirmDeletePermanently = async () => {
        if (selectedIdToDeletePermanently) {
            setLoadingDeletePermanently(true);
            try {
                const deleteData = await deletePermanentlyDataApi(selectedIdToDeletePermanently) as FetchApiResponse<ThisType>;
                
                // Toast and Log START
                const LogInfo = {
                    success: deleteData.status === 200,
                    module : 'WEBSITE',
                    action : 'DELETE_PERMANENT',
                    msg : 'PERMANENTLY_DELETED',
                    title: selectedTitleToDelete ?? null,
                    payload : {title: selectedTitleToDeletePermanently, id: selectedIdToDeletePermanently},
                    payloadFailed : {title: selectedTitleToDeletePermanently, id: selectedIdToDeletePermanently},
                }
        
                await toastAndLog(LogInfo)
                // Toast and Log END

            } catch (err) {
                console.error(err)
            } finally {
                setLoadingDeletePermanently(false)
            }
            setOpenDeletePermanentlyDialog(false);
            handleRefreshData()
        }
    };

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

    // Restore section Start
    
    const handleRestoreData = async ({ restoreId }: { restoreId: string }) => {
        
        if (restoreId) {
            try {
                const createData = await restoreData(restoreId) as FetchApiResponse<ThisType>;
                
                // Toast and Log START
                const LogInfo = {
                    success: createData.status === 200,
                    module : 'WEBSITE',
                    action : 'RESTORE',
                    msg : 'RESTORED',
                    title: null,
                    payload : {id: restoreId},
                    payloadFailed : {id: restoreId},
                }
        
                await toastAndLog(LogInfo)
                // Toast and Log END

            } catch (err) {
                console.error(err)
            }
            handleRefreshData()
        }
    };
    // Restore section End

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
                                     canDeletePermanently: canDeletePermanently,
                                     canRestore: canRestore,
                                     onDelete: handleOpenDeleteDialog,
                                     onShow: handleOpenShowDialog,
                                     onEdit: handleOpenEditDialog,
                                     onRestore: handleRestoreData,
                                     onDeletePermanently: handleOpenDeletePermanetlyDialog,
                                    refreshData: handleRefreshData,
                                    triggerWebsiteRefresh: context.triggerWebsiteRefresh,
                        })
                    }
                    fetchDataService={indexDataApi}
                    elementRight={
                        hasPermission([`${modulePage}-store`]) ?
                        <CreateThisData moduleTitle={moduleTitle} onSaveSuccess={(domain: string) => handleRedirectConfig(domain)} /> 
                        : null
                    }
                    defaultSortBy="domain"
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
            

            <DeletePermanentlyDialog
                open={openDeletePermanentlyDialog}
                title={selectedTitleToDeletePermanently}
                loading={loadingDeletePermanently}
                onConfirm={handleConfirmDeletePermanently}
                onClose={() => setOpenDeletePermanentlyDialog(false)}
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