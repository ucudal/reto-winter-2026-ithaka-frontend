import { useEffect, useId, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

// import { apiClient } from '../api/client'

const emptyForm = {
  stage_id: '',
  title: '',
  url: '',
}

function CreateMaterialModal({ open, onCreate, onClose }) {
  const titleId = useId()
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) setFormData(emptyForm)
  }, [open])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newMaterial = {
      stage_id: Number(formData.stage_id),
      title: formData.title.trim(),
      url: formData.url.trim(),
    }

    setIsSubmitting(true)

    try {
      // Llamada real a la API:
      // const { data } = await apiClient.post('/materials', newMaterial)
      // onCreate?.(data)

      // Creación mockeada:
      await new Promise((resolve) => setTimeout(resolve, 500))
      onCreate?.({ ...newMaterial, id: Date.now() })

      onClose?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle id={titleId}>Crear material</DialogTitle>

        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <TextField
            name="stage_id"
            label="Etapa"
            type="number"
            value={formData.stage_id}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 1 }}
          />
          <TextField
            name="title"
            label="Título"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            disabled={isSubmitting}
          />
          <TextField
            name="url"
            label="URL"
            type="url"
            value={formData.url}
            onChange={handleChange}
            required
            fullWidth
            disabled={isSubmitting}
          />
        </DialogContent>

        <DialogActions>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateMaterialModal
