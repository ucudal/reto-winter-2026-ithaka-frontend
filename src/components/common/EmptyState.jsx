import { Box, Typography } from '@mui/material'

function EmptyState({
  image,
  imageAlt = '',
  title = 'No hay datos para mostrar',
  description,
  action,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        py: 6,
      }}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt={imageAlt}
          sx={{ width: 200, maxWidth: '100%', height: 'auto' }}
        />
      )}

      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  )
}

export default EmptyState
