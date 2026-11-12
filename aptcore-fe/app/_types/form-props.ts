export type EditDialogProps<T> = {
  editId: string | null
  open: boolean
  moduleTitle?: string | null
  loadingShow?: boolean
  onClose: () => void
  editData?: T | null
  onUpdateSuccess: () => void
  domain?: string
  isSuperadmin?: boolean
}

export type ShowDialogProps<T> = {
  open: boolean
  moduleTitle?: string | null
  loading?: boolean
  onClose: () => void
  showData?: T | null
}