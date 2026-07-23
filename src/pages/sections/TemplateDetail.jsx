import { useState } from 'react'

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import { useParams } from 'react-router-dom'


const mockTemplates = {
  1: {
    name: 'Business Model Canvas',
    content:
      'Propuesta de valor\nSegmentos de clientes\nCanales',
  },

  2: {
    name: 'Informe Final',
    content:
      'Introducción\nDesarrollo\nConclusiones',
  },
}


function TemplateDetail() {
  const { id } = useParams()

  const template = mockTemplates[id]

  const [content, setContent] = useState(
    template?.content || ''
  )


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

        <TextField
          multiline
          minRows={15}
          fullWidth
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />


        <Button
          variant='contained'
          sx={{ mt: 3 }}
        >
          Guardar cambios
        </Button>

      </Paper>

    </Box>
  )
}

export default TemplateDetail
