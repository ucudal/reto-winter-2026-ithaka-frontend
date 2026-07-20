import { useId } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'

function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
}) {
  const titleId = useId()
  const descriptionId = useId()

  const handleConfirm = () => {
    onConfirm?.()
    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id={descriptionId}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button onClick={handleConfirm} variant="contained" color="error" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmModal
