'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import Forbidden from "@/components/element/errors/forbidden"
import LoadingSection from "@/components/element/loading-section"

import { useAcl } from "@/lib/acl"
import { useEffect, useState } from "react"
import { User as ThisType, UserField, UserIndex } from "@/app/_types/user"
import DataTable from "@/components/data-table"

import { deleteData as deleteDataApi,
         deletePermanentlyDataApi,
         indexData as indexDataApi, 
         restoreData, 
         showData as showDataApi } 
from "@/app/_services/user"

import { dataHeaders, getDataCells } from "./_index_entities"
import CreateThisData from "./_create"
import { toast } from "sonner"
import { FetchApiResponse } from "@/app/_types/fetch"
import DeleteDialog from "@/components/dialog/delete-dialog"

import ShowThisData from "./_show"
import EditThisData from "./_edit"
import DeletePermanentlyDialog from "@/components/dialog/delete-permanetly-dialog"
import { toastAndLog } from "@/lib/activity-log/client"
import { indexData as indexDataWebsite } from "@/app/_services/website"
import { Website } from "@/app/_types/website"

const modulePage = 'user'
const moduleTitle = 'User'

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
    const { hasPermission, isAuthenticated, permissions, hasRole } = useAcl()
    const [aclLoaded, setAclLoaded] = useState(false)

    const [refreshData, setRefreshData] = useState(0);
    const [websiteMap, setWebsiteMap] = useState<Record<string, Website>>({});

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
        const [showData, setShowData] = useState<ThisType>();
    // Show State END
    
    // Edit State START
        const [openEditDialog, setOpenEditDialog] = useState(false);
        const [loadingEdit, setLoadingEdit] = useState(false);
        const [editData, setEditData] = useState<UserField>();
        const [selectedIdToEdit, setSelectedIdToEdit] = useState<string | null>();
    // Edit State END
    
    useEffect(() => {
        const initShowData: ThisType = {
            id: "",
            username: "",
            email: "",
            fullName: "",
            countryCode: "",
            phoneCode: "",
            countryPhoneCode: "",
            phoneNumber: "",
            phone: "",
            avatar: "",
            createdAt: "",
            updatedAt: "",
            lastLogin: "",
            deletedAt: null,
            websiteId: "",
            website: null,
            roles: [],   
        }
        const initEditData: UserField = {
            id: "",
            username: "",
            password: "",
            passwordConfirmation: "",
            email: "",
            fullName: "",
            countryCode: "",
            phoneCode: "",
            countryPhoneCode: "",
            phoneNumber: "",
            phone: "",
            avatar: "",
            websiteId: [],
            roles: [],   
        }
        setShowData(initShowData)
        setEditData(initEditData)
    }, [])

    // Fetch all websites for lookup (used to render website info in list)
    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const res = await indexDataWebsite("?perPage=1000")
                if (res.status === 200 && res.data) {
                    const map: Record<string, Website> = {}
                    ;(res.data.data || []).forEach((w: Website) => {
                        map[`${w.id}`] = w
                    })
                    setWebsiteMap(map)
                } else {
                    setWebsiteMap({})
                }
            } catch {
                setWebsiteMap({})
            }
        }
        fetchWebsites()
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

    const handleOpenDeleteDialog = ({ id, fullName }: { id: string, fullName: string | null }) => {
        setSelectedIdToDelete(id);
        setSelectedTitleToDelete(fullName)
        setOpenDeleteDialog(true);
    };

    
    const handleOpenDeletePermanetlyDialog = ({ id, fullName }: { id: string, fullName: string | null }) => {
        setSelectedIdToDeletePermanently(id);
        setSelectedTitleToDeletePermanently(fullName)
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
                    module : 'USER',
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
    
    const handleConfirmDeletePermanently = async () => {
        if (selectedIdToDeletePermanently) {
            setLoadingDeletePermanently(true);
            try {
                const deleteData = await deletePermanentlyDataApi(selectedIdToDeletePermanently) as FetchApiResponse<ThisType>;
                
                // Toast and Log START
                const LogInfo = {
                    success: deleteData.status === 200,
                    module : 'USER',
                    action : 'DELETE_PERMANENT',
                    msg : 'PERMANENTLY_DELETED',
                    title: selectedTitleToDeletePermanently,
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

    const canDeletePermanently = hasPermission([`${modulePage}-delete-permanently`])
    const canRestore = hasPermission([`${modulePage}-update-restore`])

    const canShowTrashOption = hasPermission([`${modulePage}-index-with-trash`])

    // Delete section END

    // Show section START
    
    const canShow = hasPermission([`${modulePage}-show`])
    
    const handleOpenShowDialog = async ({ id, fullName }: { id: string, fullName: string | null }) => {
        setLoadingShow(true)
        setShowDataTitle(fullName)
        setOpenShowDialog(true)
        try {
            const data = await showDataApi(id) as FetchApiResponse<ThisType>;
            if (data.status === 200) {
                const user = data.data;
                const userData: ThisType = {
                    id: user?.id ?? '',
                    username: user?.username ?? '',
                    email: user?.email ?? '',
                    fullName: user?.fullName ?? '',
                    websiteId: user?.websiteId ? (Array.isArray(user.websiteId) ? user.websiteId[0] || '' : user.websiteId) : '',
                    website: user?.website ?? null,
                    countryCode: user?.countryCode ?? '',
                    phoneCode: user?.phoneCode ?? '',
                    countryPhoneCode: user?.countryPhoneCode ?? '',
                    phoneNumber: user?.phoneNumber ?? '',
                    phone: user?.phone ?? '',
                    avatar: user?.avatar ?? '',
                    roles: user?.roles ?? [],
                    deletedAt: user?.deletedAt ?? null,
                    createdAt: user?.createdAt ?? '',
                    updatedAt: user?.updatedAt ?? '',
                    lastLogin: user?.lastLogin ?? '',
                };
                setShowData(userData)
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
        setSelectedIdToEdit(id);
        setLoadingEdit(true)
        setOpenEditDialog(true)
        try {
            const data = await showDataApi(id) as FetchApiResponse<UserField>;
            if (data.status === 200) {
                const user = data.data;
                const userEdit: UserField = {
                    
                    id: user?.id ?? '',
                    username: user?.username ?? '',
                    password: '',
                    passwordConfirmation: '',
                    email: user?.email ?? '',
                    fullName: user?.fullName ?? '',
                    websiteId: user?.websiteId ? (Array.isArray(user.websiteId) ? user.websiteId : [user.websiteId as string]) : [],
                    countryCode: user?.countryCode ?? '',
                    phoneCode: user?.phoneCode ?? '',
                    countryPhoneCode: user?.countryPhoneCode ?? '',
                    phoneNumber: user?.phoneNumber ?? '',
                    phone: user?.phone ?? '',
                    avatar: user?.avatar ?? '',
                    roles: user?.roles ?? [],
                };
                setEditData(userEdit);
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

    // Restore section Start
    
    const handleRestoreData = async ({ restoreId }: { restoreId: string }) => {
        
        if (restoreId) {
            try {
                const createData = await restoreData(restoreId) as FetchApiResponse<ThisType>;

                // Toast and Log START
                const LogInfo = {
                    success: createData.status === 200,
                    module : 'USER',
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

    const isSuperadmin = hasRole(['superdev', 'superadmin'])

    return (
        <>
            <div className="lg:px-0 px-5 pb-5">
                <h1 className="mb-6 text-2xl font-bold">{moduleTitle}</h1>
                <DataTable<UserIndex & { id: string | number }>
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
                                     isSuperadmin,
                                     websiteMap
                        })
                    }
                    fetchDataService={indexDataApi}
                    elementRight={
                        hasPermission([`${modulePage}-store`]) ?
                        <CreateThisData moduleTitle={moduleTitle} onSaveSuccess={() => handleRefreshData()} isSuperadmin={isSuperadmin} /> 
                        : null
                    }
                    defaultSortBy="fullName"
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
                isSuperadmin={isSuperadmin}
                editId={selectedIdToEdit ?? null}
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