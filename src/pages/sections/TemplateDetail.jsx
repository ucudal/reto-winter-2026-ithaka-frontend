import { useState } from 'react'

import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material'

import { useParams, useNavigate } from 'react-router-dom'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const mockTemplates = {
  1: {
    name: 'Business Model Canvas',
    content:
      'Propuesta de valor<br/>Segmentos de clientes<br/>Canales',
  },

  2: {
    name: 'Informe Final',
    content:
      'Introducción<br/>Desarrollo<br/>Conclusiones',
  },
}


function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

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
