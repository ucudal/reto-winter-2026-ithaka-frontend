import { apiClient } from '../client';

const STORAGE_KEY = 'mock_meetings';

const initialMeetings = [
  {
    id: '1',
    title: 'Daily Standup',
    date: '2026-07-27',
    time: '09:00',
    description: 'Frontend team daily synchronization.'
  },
  {
    id: '2',
    title: 'Code Review - FEAT-4',
    date: '2026-07-28',
    time: '14:30',
    description: 'Reviewing the mocked meetings API layer.'
  }
];

const getStoredMeetings = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMeetings));
    return initialMeetings;
  }
  try {
    return JSON.parse(data);
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
    id: Date.now().toString(),
    ...meetingData
  };
  meetings.push(newMeeting);
  saveStoredMeetings(meetings);
  return Promise.resolve(newMeeting);
};

export const updateMeeting = async (id, updatedData) => {
  const meetings = getStoredMeetings();
  let updatedMeeting = null;
  
  const newMeetings = meetings.map(meeting => {
    if (meeting.id === String(id)) {
      updatedMeeting = { ...meeting, ...updatedData };
      return updatedMeeting;
    }
    return meeting;
  });

  if (!updatedMeeting) {
    throw new Error(`Meeting with id ${id} not found`);
  }

  saveStoredMeetings(newMeetings);
  return Promise.resolve(updatedMeeting);
};

export const deleteMeeting = async (id) => {
  try {
    await apiClient.delete(`/meetings/${id}`);
  } catch (error) {
    console.error("Error al eliminar en el backend", error);
  }
  
  const meetings = getStoredMeetings();
  const filteredMeetings = meetings.filter(meeting => meeting.id !== String(id));
  
  saveStoredMeetings(filteredMeetings);
  return Promise.resolve({ success: true, id });
};
