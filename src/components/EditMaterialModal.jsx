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

const emptyForm = {
  stage_id: '',
  title: '',
  url: '',
}

function EditMaterialModal({ open, material, onSave, onClose }) {
  const titleId = useId()
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (material) {
      setFormData({
        stage_id: material.stage_id ?? '',
        title: material.title ?? '',
        url: material.url ?? '',
      })
    }
  }, [material])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSave?.({
      stage_id: Number(formData.stage_id),
      title: formData.title.trim(),
      url: formData.url.trim(),
    })
    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle id={titleId}>Editar material</DialogTitle>

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
            sx={{ mt: 1}}
          />
          <TextField
            name="title"
            label="Título"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="url"
            label="URL"
            type="url"
            value={formData.url}
            onChange={handleChange}
            required
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default EditMaterialModal
