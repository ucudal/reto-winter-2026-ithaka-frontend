import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Breadcrumbs,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ErrorState from '../../components/common/ErrorState'
import { getMaterialById, upsertMaterial } from '../../api/endpoints/materials'
import { useToast } from '../../ToastContext'

function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [template, setTemplate] = useState(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  const handleSave = async () => {
    try {
      setSaving(true)
      await upsertMaterial({
        id: Number(id),
        title: template?.title || template?.name || `Material ${id}`,
        url: content,
        stage_id: template?.stage_id ?? null,
      })
      showToast('Template actualizado correctamente.', 'success')
    } catch (err) {
      showToast(err?.message || 'No se pudo guardar el template.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      // Intenta copiar contenido rico / HTML formateado
      const type = 'text/html'
      const blob = new Blob([content], { type })
      const data = [new ClipboardItem({ [type]: blob })]
      await navigator.clipboard.write(data)
      showToast('¡Plantilla copiada al portapapeles! Puedes pegarla en Word.', 'success')
    } catch {
      // Fallback a texto plano si la API de Clipboard rich text no está disponible
      try {
        const doc = new DOMParser().parseFromString(content, 'text/html')
        const plainText = doc.body.textContent || ''
        await navigator.clipboard.writeText(plainText)
        showToast('Plantilla copiada como texto plano.', 'success')
      } catch {
        showToast('No se pudo copiar el contenido automáticamente.', 'error')
      }
    }
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
    <Box sx={{ width: '100%', pb: 5 }}>
      {/* Migas de pan */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Typography
          color="inherit"
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate('/templates')}
        >
          Templates
        </Typography>
        <Typography color="text.primary">{template?.title || template?.name || `Template #${id}`}</Typography>
      </Breadcrumbs>

      {/* Encabezado y Acciones */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={() => navigate('/templates')} color="default">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {template?.title || template?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vista previa estilo documento Word para copiar y completar
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipboard}
            sx={{ borderRadius: 2 }}
          >
            Copiar para Word
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: 2 }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Stack>
      </Box>

      {/* Hoja de Trabajo Estilo Word (A4) */}
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#f0f2f5'),
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: '800px', // Ancho hoja A4 aproximado
            minHeight: '1000px',
            bgcolor: 'background.paper',
            p: { xs: 3, sm: 6 },
            borderRadius: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',

            // Estilos del editor Quill para imitar formato Word
            '& .quill': {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            },
            '& .ql-toolbar': {
              borderRadius: '8px 8px 0 0',
              borderColor: 'divider',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'),
            },
            '& .ql-container': {
              borderRadius: '0 0 8px 8px',
              borderColor: 'divider',
              minHeight: '850px',
              fontSize: '1.05rem',
              fontFamily: '"Calibri", "Roboto", "Helvetica", "Arial", sans-serif',
              lineHeight: 1.6,
            },
            '& .ql-editor': {
              minHeight: '850px',
              p: 3,
            },
          }}
        >
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Comienza a redactar la plantilla aquí..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                ['link'],
                ['clean'],
              ],
            }}
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default TemplateDetail
