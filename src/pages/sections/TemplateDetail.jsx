import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'

import { useParams, useNavigate } from 'react-router-dom'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ErrorState from '../../components/common/ErrorState'
import { getMaterialById } from '../../api/endpoints/materials'

function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [template, setTemplate] = useState(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadTemplate() {
      setLoading(true)
      setError(null)

      try {
        const material = await getMaterialById(id)
        if (!mounted) return
        if (!material) {
          setError('Template no encontrado')
          return
        }
        setTemplate(material)
        setContent(material.content || material.url || material.description || '')
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'No se pudo cargar el template.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    loadTemplate()

    return () => {
      mounted = false
    }
  }, [id])

  const handleSave = () => {
    console.log('Guardando template:', {
      id,
      content,
    })

    navigate('/templates')
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <ErrorState title='Error cargando template' message={error} />
  }

  return (
    <Box sx={{ width: '100%' }}>

      <Typography variant='h4' sx={{ mb: 3 }}>
        {template?.name}
      </Typography>


      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              ['clean'],
            ],
          }}
        />


        <Button
          variant='contained'
          sx={{ mt: 3 }}
          onClick={handleSave}
        >
          Guardar cambios
        </Button>

      </Paper>

    </Box>
  )
}

export default TemplateDetail
