import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Groups from './Groups';
import { getGroups, saveGroup } from '../../api/endpoints/groups';
import { getCohorts } from '../../api/endpoints/cohorts';
import { getStudents } from '../../api/endpoints/students';
import { getTutors } from '../../api/endpoints/tutors';

vi.mock('../../api/endpoints/groups', () => ({
  getGroups: vi.fn(),
  saveGroup: vi.fn(),
  deleteGroup: vi.fn(),
}));

vi.mock('../../api/endpoints/cohorts', () => ({
  getCohorts: vi.fn(),
}));

vi.mock('../../api/endpoints/students', () => ({
  getStudents: vi.fn(),
}));

vi.mock('../../api/endpoints/tutors', () => ({
  getTutors: vi.fn(),
}));

describe('Groups Component', () => {
  const mockGroups = [
    { id: 1, name: 'Group Alpha', idea: 'Idea Alpha', major: 'Software', status: 'Active' },
    { id: 2, name: 'Group Beta', idea: 'Idea Beta', major: 'Systems', status: 'Active' },
  ];

  const mockCohorts = [
    { id: 1, year: 2026, semester: 1 },
  ];

  const mockStudents = [
    { id: 10, name: 'Juan Perez', group_id: null },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getStudents).mockResolvedValue(mockStudents);
    vi.mocked(getTutors).mockResolvedValue([]);
  });

  it('renders loading state and displays groups list successfully', async () => {
    vi.mocked(getGroups).mockResolvedValue(mockGroups);
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /grupos/i })).toBeInTheDocument();

    expect(await screen.findByText('Group Alpha')).toBeInTheDocument();
    expect(screen.getByText('Group Beta')).toBeInTheDocument();
  });

  it('handles error state when groups fail to load', async () => {
    vi.mocked(getGroups).mockRejectedValue(new Error('Failed to fetch groups'));
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );

    expect(await screen.findByText('Failed to fetch groups')).toBeInTheDocument();
  });

  it('allows opening create modal for a new group', async () => {
    vi.mocked(getGroups).mockResolvedValue(mockGroups);
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );

    expect(await screen.findByText('Group Alpha')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /agregar grupo/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
