import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Groups from './Groups';
import { getGroups, getGroupById } from '../../api/endpoints/groups';
import { getCohorts } from '../../api/endpoints/cohorts';
import { getStudents } from '../../api/endpoints/students';
import { getTutors, getTutorGroups } from '../../api/endpoints/tutors';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../api/endpoints/groups', () => ({
  getGroups: vi.fn(),
  saveGroup: vi.fn(),
  deleteGroup: vi.fn(),
  getGroupById: vi.fn(),
}));

vi.mock('../../api/endpoints/cohorts', () => ({
  getCohorts: vi.fn(),
}));

vi.mock('../../api/endpoints/students', () => ({
  getStudents: vi.fn(),
}));

vi.mock('../../api/endpoints/tutors', () => ({
  getTutors: vi.fn(),
  getTutorGroups: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Groups Component (tutor scope - BUG-17)', () => {
  const mockCohorts = [{ id: 1, year: 2026, semester: 1 }];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getStudents).mockResolvedValue([]);
    vi.mocked(getTutors).mockResolvedValue([]);
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);
  });

  it('for a BusinessTutor, calls getTutorGroups + getGroupById instead of getGroups', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'BusinessTutor', tutor: { id: 42 } },
    });

    vi.mocked(getTutorGroups).mockResolvedValue([
      { id: 1, name: 'Grupo Alpha', status: 'Active', cohort_id: 1 },
    ]);
    vi.mocked(getGroupById).mockResolvedValue({
      id: 1,
      name: 'Grupo Alpha',
      status: 'Active',
      cohortId: 1,
      students: [],
    });

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Grupo Alpha')).toBeInTheDocument();

    expect(getTutorGroups).toHaveBeenCalledWith(42);
    expect(getGroupById).toHaveBeenCalledWith(1);
    expect(getGroups).not.toHaveBeenCalled();
  });

  it('for a Coordinator, calls getGroups (sees all groups)', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'Coordinator', tutor: null },
    });
    vi.mocked(getGroups).mockResolvedValue([
      { id: 1, name: 'Grupo Alpha', status: 'Active' },
      { id: 2, name: 'Grupo Beta', status: 'Active' },
    ]);

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Grupo Alpha')).toBeInTheDocument();
    expect(getGroups).toHaveBeenCalled();
    expect(getTutorGroups).not.toHaveBeenCalled();
  });
});
