'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SpinnerCaption from "@/components/element/spinner-caption"

type UpdateDialogProps = {
  open: boolean
  title?: string | null
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function UpdateDialog({
  open,
  title,
  loading = false,
  onConfirm,
  onClose,
}: UpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Confirmation</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to update this <b>{title}</b> data?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={onConfirm} autoFocus>
            <SpinnerCaption loading={loading} loadingValue="Updating.." defaultValue="Yes, Update" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
