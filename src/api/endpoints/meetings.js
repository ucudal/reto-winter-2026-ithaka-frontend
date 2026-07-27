import { apiClient } from "../client";

const STORAGE_KEY = 'mock_meetings';

const initialMeetings = [
  {
    id: '1',
    title: 'Daily Standup',
    start: '2026-07-27T09:00:00',
    end: '2026-07-27T09:30:00',
    extendedProps: {
      group: '',
      tutors: [],
      participants: [],
      attendance: {},
      link: '',
      notes: 'Frontend team daily synchronization.'
    }
  },
  {
    id: '2',
    title: 'Code Review - FEAT-4',
    start: '2026-07-28T14:30:00',
    end: '2026-07-28T15:30:00',
    extendedProps: {
      group: '',
      tutors: [],
      participants: [],
      attendance: {},
      link: '',
      notes: 'Reviewing the mocked meetings API layer.'
    }
  }
];

const getStoredMeetings = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMeetings));
    return initialMeetings;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return initialMeetings;
  }
};

const saveStoredMeetings = (meetings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
};

export const getMeetings = async () => {
  return Promise.resolve(getStoredMeetings());
};

export const createMeeting = async (meetingData) => {
  const meetings = getStoredMeetings();
  const newMeeting = {
    id: String(Date.now()),
    ...meetingData,
  };
  meetings.push(newMeeting);
  saveStoredMeetings(meetings);
  return Promise.resolve(newMeeting);
};

export const updateMeeting = async (id, meetingData) => {
  const meetings = getStoredMeetings();
  const index = meetings.findIndex(m => String(m.id) === String(id));
  if (index === -1) {
    throw new Error(`Meeting with id ${id} not found`);
  }
  meetings[index] = { ...meetings[index], ...meetingData, id };
  saveStoredMeetings(meetings);
  return Promise.resolve(meetings[index]);
};

export const deleteMeeting = async (id) => {
  // Desacoplamos la llamada de red para que no bloquee la eliminación local
  apiClient.delete(`/meetings/${id}`).catch((error) => {
    console.error("Error al eliminar en el backend", error);
  });

  const meetings = getStoredMeetings();
  const filteredMeetings = meetings.filter(meeting => String(meeting.id) !== String(id));

  saveStoredMeetings(filteredMeetings);
  return Promise.resolve({ success: true, id });
};
