import { useMemo, useState } from 'react'

import {
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

import { Link as RouterLink, useNavigate } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

import EmptyState from '../../components/common/EmptyState'


const mockTemplates = [
  {
    id: 1,
    name: 'Business Model Canvas',
    platform: 'Drive',
    type: 'Deliverable',
    description: 'Plantilla para desarrollar el modelo de negocio.',
    content:
      '1. Propuesta de valor\n2. Segmentos de clientes\n3. Canales',
  },
  {
    id: 2,
    name: 'Informe Final',
    platform: 'Drive',
    type: 'Deliverable',
    description: 'Estructura base para el informe final.',
    content:
      'Introducción\nDesarrollo\nResultados\nConclusiones',
  },
]


function Templates() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('name')


  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter((template) => {
      const value =
        template[filter]?.toLowerCase() || ''

      return value.includes(search.toLowerCase())
    })
  }, [search, filter])


  return (
    <Box sx={{ width: '100%' }}>
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

        <Typography color='text.primary'>
          Templates
        </Typography>

      </Breadcrumbs>


      <Typography variant='h4'>
        Templates
      </Typography>


      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          mt: 3,
        }}
      >

        <TableContainer>
          <Table>

            <TableHead>
              <TableRow>

                <TableCell sx={{ fontWeight: 'bold' }}>
                  Nombre
                </TableCell>

                <TableCell sx={{ fontWeight: 'bold' }}>
                  Plataforma
                </TableCell>

                <TableCell sx={{ fontWeight: 'bold' }}>
                  Tipo
                </TableCell>

                <TableCell
                  align='right'
                  sx={{ fontWeight: 'bold' }}
                >
                  Acciones
                </TableCell>

              </TableRow>
            </TableHead>


            <TableBody>

              {filteredTemplates.length > 0 ? (

                filteredTemplates.map((template) => (

                  <TableRow
                    key={template.id}
                    hover
                  >

                    <TableCell>
                      {template.name}
                    </TableCell>

                    <TableCell>
                      {template.platform}
                    </TableCell>

                    <TableCell>
                      {template.type}
                    </TableCell>


                    <TableCell align='right'>

                      <IconButton
                        color='primary'
                        onClick={() =>
                          navigate(`/templates/${template.id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                    </TableCell>

                  </TableRow>

                ))

              ) : (

                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState
                      title='No hay templates'
                      description='No se encontraron plantillas.'
                    />
                  </TableCell>
                </TableRow>

              )}

            </TableBody>

          </Table>
        </TableContainer>

      </Paper>

    </Box>
  )
}

export default Templates
