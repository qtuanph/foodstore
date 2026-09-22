"use client"

import * as React from "react"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  onConfirm: () => void
  loading?: boolean
  confirmLabel?: string
  variant?: "destructive" | "default"
  trigger?: React.ReactNode
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  onConfirm,
  loading,
  confirmLabel = "Xác nhận",
  variant = "destructive",
  trigger,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            {variant === "destructive" ? (
              <Trash2 className="text-destructive" />
            ) : (
              <AlertTriangle />
            )}
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  itemName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
  itemName?: string
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xóa"
      description={itemName ? `Bạn có chắc chắn muốn xóa "${itemName}"? Hành động này không thể hoàn tác.` : "Bạn có chắc chắn muốn xóa mục này?"}
      confirmLabel="Xóa"
      variant="destructive"
      onConfirm={onConfirm}
      loading={loading}
    />
  )
}
