import { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ChildDialogProps {
    title: string
    description: string
    confirmLabel: string
    confirmStyle?: string
    cancelLabel: string
    cancelStyle?: string
    onConfirm: () => void
    trigger: string | ReactNode
}

export default function ChildConfirmModal({
    title,
    description,
    confirmLabel,
    confirmStyle,
    cancelLabel,
    cancelStyle,
    onConfirm,
    trigger
}: ChildDialogProps) {
    const [open, setOpen] = useState(false)

    const handleConfirm = () => {
        onConfirm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" className={cancelStyle} onClick={() => setOpen(false)}>{cancelLabel}</Button>
                    <Button className={confirmStyle} onClick={(e) => {
                        e.stopPropagation()
                        handleConfirm()
                    }}>{confirmLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}