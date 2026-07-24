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
import { isValidUrl } from '../utils/validators'

const emptyForm = {
  stage_id: '',
  title: '',
  url: '',
}

function EditMaterialModal({ open, material, onSave, onClose }) {
  const titleId = useId()
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (material) {
      setFormData({
        stage_id: material.stage_id ?? '',
        title: material.title ?? '',
        url: material.url ?? '',
      })
      setErrors({})
    }
  }, [material])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentForm) => ({ ...currentForm, [name]: value }))
    if (errors[name]) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: ''}))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isValidUrl(formData.url)){
      setErrors((currentErrors) => ({
        ...currentErrors,
        url: 'Ingresa una URL valida (debe empezar con http:// o https://)',
      }))
      return
    }

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
      <Box component="form" onSubmit={handleSubmit} noValidate>
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
            error={!!errors.url}
            helperText={errors.url}
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
