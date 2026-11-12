'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useGlobalContext } from "@/app/_providers/GlobalContextProvider"
import Forbidden from "@/components/element/errors/forbidden"
import LoadingSection from "@/components/element/loading-section"

import { useAcl } from "@/lib/acl"
import { useEffect, useState } from "react"
import { FormSubmission as ThisType } from "@/app/_types/form-submission"
import DataTable from "@/components/data-table"

import { deleteData as deleteDataApi,
         indexData as indexDataApi, 
         showData as showDataApi } 
from "@/app/_services/form-submission"

import { dataHeaders, getDataCells } from "./_index_entities"
// import CreateThisData from "./_create" ARCHIVE
import { toast } from "sonner"
import { FetchApiResponse } from "@/app/_types/fetch"
import DeleteDialog from "@/components/dialog/delete-dialog"

import ShowThisData from "./_show"
import EditThisData from "./_edit"

const modulePage = 'form-submission'
const moduleTitle = 'Form Submission'

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
    const { triggerFormSubmissionRefresh } = useGlobalContext()
    const [aclLoaded, setAclLoaded] = useState(false)

    const [refreshData, setRefreshData] = useState(0);

    // Delete State START
        const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
        const [loadingDelete, setLoadingDelete] = useState(false);
        const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null);
        const [selectedTitleToDelete, setSelectedNameToDelete] = useState<string | null>(null);
    // Delete State END
    
    // Show State START
        const [openShowDialog, setOpenShowDialog] = useState(false);
        const [loadingShow, setLoadingShow] = useState(false);
        const [showDataTitle, setShowDataName] = useState<string | null>(null);
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
            websiteId: "",
            name: "",
            email: "",
            countryCode: "",
            phoneCode: "",
            phoneNumber: "",
            countryPhoneCode: "",
            phone: "",
            message: "",
            readAt: "",
            readByUser: null,
            createdAt: "",
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
        // Keep the sidebar unread badge in sync with deletes and reads
        triggerFormSubmissionRefresh();
    };

    // Delete section START
    
    const canDelete = hasPermission([`${modulePage}-delete`])

    const handleOpenDeleteDialog = ({ id, name }: { id: string, name: string | null }) => {
        setSelectedIdToDelete(id);
        setSelectedNameToDelete(name)
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
    const canShowUnreadOption = true

    // Delete section END

    // Show section START
    
    const canShow = hasPermission([`${modulePage}-show`])
    
    const handleOpenShowDialog = async ({ id, name }: { id: string, name: string | null }) => {
        setLoadingShow(true)
        setShowDataName(name)
        setOpenShowDialog(true)
        try {
            const data = await showDataApi(id) as FetchApiResponse<ThisType>;
            if (data.status === 200) {
                setShowData(data.data || null)
                handleRefreshData()
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
                    // ARCHIVE
                    // elementRight={
                    //     hasPermission([`${modulePage}-store`]) ?
                    //     <CreateThisData moduleTitle={moduleTitle} onSaveSuccess={() => handleRefreshData()} /> 
                    //     : null
                    // }
                    defaultSortBy="readAt"
                    defaultSortDirection = "desc"
                    refreshTriger={refreshData}
                    showTrashOption={canShowTrashOption}
                    showUnreadOption={canShowUnreadOption}
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