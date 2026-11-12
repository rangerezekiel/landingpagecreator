'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useDomain } from "@/app/_providers/DomainContext"
import { indexData, deleteData as deleteDataApi, showData as showDataApi } from "@/app/_services/section"
import { FetchApiResponse } from "@/app/_types/fetch"
import { LocationListPayload, Section } from "@/app/_types/section"
import { useEffect, useState } from "react"
import CreateThisData from "./_create"
import LoadingContent from "@/components/element/loading-section"
import DeleteDialog from "@/components/dialog/delete-dialog"
import { toast } from "sonner"
import EmptyData from "@/components/element/empty-data"
import EditThisData from "./_edit"
import List from "@/components/element/list"
import { toastAndLog } from "@/lib/activity-log/client"

const moduleTitle = 'Location List'
const thisSection = 'LOCATION'

export default function WebsiteConfigLocationList(){
    const { domain } = useDomain()
    const { setBreadcrumbs } = useBreadcrumbs()
    const [loading, setLoading] = useState(true)
    const [refreshData, setRefreshData] = useState(0);
    const [listData, setlistData] = useState<Section | null>(null)
    // Set breadcrumbs
    useEffect(() => {
    setBreadcrumbs([
        { label: 'Website Config', href: `/backside/website/${domain}/config` },
        { label: moduleTitle },
    ])
    }, [setBreadcrumbs, domain])

    
    // Delete State START
        const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
        const [loadingDelete, setLoadingDelete] = useState(false);
        const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null);
        const [selectedTitleToDelete, setSelectedTitleToDelete] = useState<string | null>(null);
    // Delete State END
    
    // Edit State START
        const [openEditDialog, setOpenEditDialog] = useState(false);
        const [loadingEdit, setLoadingEdit] = useState(false);
        const [editData, setEditData] = useState<LocationListPayload | null>();
        const [selectedIdToEdit, setSelectedIdToEdit] = useState<string | null>(null);
    // Edit State END
    
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await indexData(domain, thisSection) as unknown as FetchApiResponse<Section>
                const data = res.data
                setlistData(data ?? null)
            } catch (error) {
                console.error(error)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 300)
            }
        }
        if(domain){
            fetchData()
        }
    }, [domain, refreshData])

    const handleConfirmDelete = async () => {
        if (selectedIdToDelete) {
            setLoadingDelete(true);
            try {
                const deleteData = await deleteDataApi(domain, thisSection, selectedIdToDelete) as FetchApiResponse<Section>;
                
                // Toast and Log START
                const LogInfo = {
                    success: deleteData.status === 200,
                    module : 'LOCATION_LIST',
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
    
    const handleOpenDeleteDialog = (id: string, title:string) => {
        setSelectedIdToDelete(id);
        setSelectedTitleToDelete(title)
        setOpenDeleteDialog(true);
    };

    const handleRefreshData = () => {
        setRefreshData(prev => prev + 1)
    };
    
    // Update section START
    
    const handleOpenEditDialog = async ({ id }: { id: string }) => {
        setSelectedIdToEdit(id)
        setLoadingEdit(true)
        setOpenEditDialog(true)
        try {
            const data = await showDataApi(domain, thisSection, id) as FetchApiResponse<Section>;
            if (data.status === 200) {
                setEditData(data.data as unknown as LocationListPayload || null)
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
        
            <DeleteDialog
                open={openDeleteDialog}
                title={selectedTitleToDelete}
                loading={loadingDelete}
                onConfirm={handleConfirmDelete}
                onClose={() => setOpenDeleteDialog(false)}
            />
            
            <EditThisData 
                domain={domain}
                editId={selectedIdToEdit}
                open={openEditDialog}
                loadingShow={loadingEdit}
                moduleTitle={moduleTitle}
                onClose={() => setOpenEditDialog(false)}
                editData={editData}
                onUpdateSuccess={() => handleRefreshData()}
            />

            <div className="lg:px-0 px-5 pb-5">
                <div className="flex justify-between mt-2">
                    <h1 className="mb-6 text-2xl font-bold">{moduleTitle}</h1>
                    <CreateThisData domain={domain} moduleTitle={moduleTitle} onSaveSuccess={() => handleRefreshData()} detailId={listData?.details?.LIST?.id ?? ""} />
                </div>
                {
                    loading ? (
                        <>
                            <LoadingContent />
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-5">
                                { listData
                                    &&
                                    listData?.details?.LIST?.items?.map((item, index) => {
                                        return (
                                            <div key={item.id ?? index}>
                                                <List
                                                    id={item.id}
                                                    title={item.contents.TITLE.value ?? ""}
                                                    description={item.contents.DESCRIPTION.value ?? ""}
                                                    onEdit={(id) => handleOpenEditDialog({id: id ?? ""})}
                                                    onDelete={(id, title) => handleOpenDeleteDialog(id, title)}
                                                >
                                                </List>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                listData && listData.details.LIST.items.length === 0 && (
                                    <EmptyData />
                                )
                            }
                        </>
                    )
                }
            </div>
        </>
    )
}
