import React, { useState, useEffect } from 'react';
import { Drawer, Avatar, Box, Typography, Button, Divider, Chip, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProfileDetails from "../utils/ProfileDetails";
import { getStudentById } from '../api/endpoints/students';
import { getTutor } from '../api/endpoints/tutors';
import { getGroupById } from '../api/endpoints/groups';

const ROLE_LABELS = {
  Student: 'Estudiante',
  BusinessTutor: 'Tutor de Negocio',
  TechnicalTutor: 'Tutor Técnico',
  Coordinator: 'Coordinador Ithaka',
};

export default function UserProfileDrawer({ user, open, onClose }) {
  const [enrichedUser, setEnrichedUser] = useState(user);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    let ignore = false;
    setEnrichedUser(user);

    async function fetchAdditionalInfo() {
      try {
        setLoadingDetails(true);
        if (user.role === 'Student') {
          const studentId = user.student_id ?? user.student?.id ?? user.id;
          if (studentId) {
            const data = await getStudentById(studentId);
            if (!ignore && data) {
              let groupData = data.group;
              if (!groupData && data.group_id) {
                try {
                  groupData = await getGroupById(data.group_id);
                } catch {
                  // Fallback if group endpoint fails
                }
              }

              setEnrichedUser((prev) => ({
                ...prev,
                ...data,
                student: data,
                email: data.email || prev.email,
                linkedin_url: data.linkedin_url || prev.linkedin_url,
                phone: data.phone || prev.phone,
                major: data.major || prev.major,
                group: groupData || prev.group,
                groupName: groupData?.name || prev.groupName,
              }));
            }
          }
        } else if (user.role === 'BusinessTutor' || user.role === 'TechnicalTutor') {
          const tutorId = user.tutor_id ?? user.tutor?.id ?? user.id;
          if (tutorId) {
            const data = await getTutor(tutorId);
            if (!ignore && data) {
              setEnrichedUser((prev) => ({
                ...prev,
                ...data,
                tutor: data,
                email: data.email || prev.email,
                specialty: data.specialty || prev.specialty,
                availability: data.availability || prev.availability,
                phone: data.phone || prev.phone,
                linkedin_url: data.linkedin_url || prev.linkedin_url,
              }));
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch detailed profile info', err);
      } finally {
        if (!ignore) setLoadingDetails(false);
      }
    }

    fetchAdditionalInfo();

    return () => {
      ignore = true;
    };
  }, [open, user]);

  if (!user) return null;

  const currentUser = enrichedUser || user;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          height: '100vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflowY: 'auto', pr: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Mi Perfil
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mb={2.5}>
          <Avatar
            alt={currentUser.name}
            src={currentUser.avatarUrl}
            sx={{ width: 64, height: 64, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '1.5rem', fontWeight: 'bold' }}
          >
            {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
              {currentUser.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {ROLE_LABELS[currentUser.role] || currentUser.role}
            </Typography>
            <Chip
              label="Activo"
              color="success"
              size="small"
              sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#f0f0f0' }} />

        {loadingDetails ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <ProfileDetails user={currentUser} />
        )}

      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} sx={{ borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="text"
          component={RouterLink}
          to="/settings"
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}
        >
          Ajustes de Cuenta
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: 'uppercase', px: 3, borderRadius: 1 }}
        >
          Cerrar
        </Button>
      </Box>
    </Drawer>
  );
}