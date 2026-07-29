import React from 'react';
import { Box, Typography, Chip, Stack, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

function ProfileSectionTitle({ children }) {
  return (
    <Typography
      variant="caption"
      fontWeight="bold"
      color="text.secondary"
      sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1.5, mt: 2 }}
    >
      {children}
    </Typography>
  );
}

function ProfileField({ label, value, icon: Icon, isLink = false }) {
  if (!value) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.3 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {Icon && <Icon fontSize="small" sx={{ color: 'action.active', fontSize: 18 }} />}
        {isLink ? (
          <Link href={value} target="_blank" rel="noopener noreferrer" variant="body2" underline="hover">
            {value}
          </Link>
        ) : (
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function ProfileDetails({ user }) {
  if (!user) return null;

  const isStudent = user.role === 'Student';
  const isTutor = user.role === 'BusinessTutor' || user.role === 'TechnicalTutor';
  const isCoordinator = user.role === 'Coordinator';
  const studentData = user.student || user;
  const tutorData = user.tutor || user;

  const phone = studentData.phone || tutorData.phone || user.tel || user.phone;
  const linkedin = studentData.linkedin_url || tutorData.linkedin_url || user.linkedin || user.linkedin_url;
  const email = studentData.email || tutorData.email || user.email;
  const hasContactInfo = Boolean(email || phone || linkedin);

  return (
    <Box sx={{ pr: 0.5 }}>
      {hasContactInfo && (
        <>
          <ProfileSectionTitle>Información de Contacto</ProfileSectionTitle>
          <ProfileField label="Correo electrónico" value={user.email} icon={EmailIcon} />
          <ProfileField label="Teléfono" value={phone} icon={PhoneIcon} />
          <ProfileField label="LinkedIn" value={linkedin} icon={LinkedInIcon} isLink />
        </>
      )}

      {/* ROL ESTUDIANTE */}
      {isStudent && (
        <>
          <ProfileSectionTitle>Detalle Académico y Equipo</ProfileSectionTitle>
          <ProfileField label="Carrera" value={studentData.major || user.major || user.degree || 'Ingeniería / Licenciatura'} icon={SchoolIcon} />
          <ProfileField label="Grupo asignado" value={studentData.group?.name || user.groupName || user.group?.name || 'Sin grupo asignado'} icon={GroupsIcon} />
          
          {(studentData.group?.business_tutor || studentData.group?.technical_tutor || user.businessTutorName || user.technicalTutorName) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.8 }}>
                Tutores del Grupo
              </Typography>
              <Stack spacing={0.8}>
                {(studentData.group?.business_tutor?.name || user.businessTutorName) && (
                  <Chip
                    icon={<BusinessCenterIcon fontSize="small" />}
                    label={`Negocio: ${studentData.group?.business_tutor?.name || user.businessTutorName}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
                {(studentData.group?.technical_tutor?.name || user.technicalTutorName) && (
                  <Chip
                    icon={<WorkIcon fontSize="small" />}
                    label={`Técnico: ${studentData.group?.technical_tutor?.name || user.technicalTutorName}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Stack>
            </Box>
          )}
        </>
      )}

      {/* ROL TUTOR */}
      {isTutor && (
        <>
          <ProfileSectionTitle>Perfil Profesional y Disponibilidad</ProfileSectionTitle>
          <ProfileField label="Especialidad" value={tutorData.specialty || user.specialty} icon={WorkIcon} />
          <ProfileField label="Disponibilidad semanal" value={tutorData.availability || user.availability} icon={AccessTimeIcon} />
          <ProfileField label="Capacidad máxima" value={tutorData.max_capacity ? `${tutorData.max_capacity} hs` : (user.maxCapacity ? `${user.maxCapacity} hs` : null)} icon={AccessTimeIcon} />
        </>
      )}

      {/* ROL COORDINADOR */}
      {isCoordinator && (
        <>
          <ProfileSectionTitle>Gestión Institucional</ProfileSectionTitle>
          <ProfileField label="Centro / Unidad" value="Centro Ithaka - UCU" icon={BusinessCenterIcon} />
          <ProfileField label="Nivel de Permisos" value="Administrador Global" icon={VerifiedUserIcon} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.8 }}>
              Privilegios del Sistema
            </Typography>
            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
              <Chip label="Gestión de Cohortes" size="small" color="success" variant="outlined" />
              <Chip label="Supervisión de Grupos" size="small" color="info" variant="outlined" />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}