"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  isLoading?: boolean
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {variant === "destructive" && <AlertTriangle className="h-5 w-5 text-red-600" />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            className="flex-1"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "En cours..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
