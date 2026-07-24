import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { useTheme } from '@mui/material/styles'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import './TemplateDetail.css'

const mockTemplates = {
  1: {
    name: 'Business Model Canvas',
    content:
      '<p><strong>Propuesta de valor</strong></p><p>Escribe aquí la propuesta de valor...</p><p><strong>Segmentos de clientes</strong></p><p>Escribe aquí el segmento de clientes...</p><p><strong>Canales</strong></p><p>Escribe aquí los canales...</p>',
  },
  2: {
    name: 'Informe Final',
    content:
      '<p><strong>Introducción</strong></p><p>Escribe aquí la introducción...</p><p><strong>Desarrollo</strong></p><p>Escribe aquí el desarrollo...</p><p><strong>Conclusiones</strong></p><p>Escribe aquí las conclusiones...</p>',
  },
}

function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const template = mockTemplates[id]

  const [content, setContent] = useState(
    template?.content || ''
  )

  const handleSave = () => {
    console.log('Guardando template:', {
      id,
      content,
    })
    navigate('/templates')
  }

  return (
    <Box className={isDarkMode ? 'dark-mode-canvas' : ''} sx={{ width: '100%' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' />}
        sx={{ mb: 1 }}
      >
        <Link
          component={RouterLink}
          to='/'
          underline='hover'
          color='inherit'
        >
          Inicio
        </Link>
        <Link
          component={RouterLink}
          to='/templates'
          underline='hover'
          color='inherit'
        >
          Templates
        </Link>
        <Typography color='text.primary'>
          {template?.name || 'Detalle'}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4'>
          {template?.name}
        </Typography>

        <Button
          variant='contained'
          onClick={handleSave}
        >
          Guardar cambios
        </Button>
      </Box>

      <Box className="document-canvas">
        <Box className="document-page">
          <CKEditor
            editor={ClassicEditor}
            data={content}
            config={{
              placeholder: 'Comienza a escribir tu plantilla...',
              toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'insertTable',
                'blockQuote',
                'undo',
                'redo',
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData()
              setContent(data)
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default TemplateDetail
