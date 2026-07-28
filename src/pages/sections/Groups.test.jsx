import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Groups from './Groups';
import { getGroups, createGroup } from '../../api/endpoints/groups';
import { getCohorts } from '../../api/endpoints/cohorts';

vi.mock('../../api/endpoints/groups', () => ({
  getGroups: vi.fn(),
  createGroup: vi.fn(),
}));

vi.mock('../../api/endpoints/cohorts', () => ({
  getCohorts: vi.fn(),
}));

describe('Groups Component', () => {
  const mockGroups = [
    { id: 1, name: 'Group Alpha', idea: 'Idea Alpha', major: 'Software', status: 'Active' },
    { id: 2, name: 'Group Beta', idea: 'Idea Beta', major: 'Systems', status: 'Active' },
  ];

  const mockCohorts = [
    { id: 1, year: 2026, semester: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state and displays groups list successfully', async () => {
    vi.mocked(getGroups).mockResolvedValue(mockGroups);
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );

    expect(screen.getByText(/grupos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Group Alpha')).toBeInTheDocument();
      expect(screen.getByText('Group Beta')).toBeInTheDocument();
    });
  });

  it('handles error state when groups fail to load', async () => {
    vi.mocked(getGroups).mockRejectedValue(new Error('Failed to fetch groups'));
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText((content) => /error|cargar|falló|falla|grupo/i.test(content))).toBeInTheDocument();
    });
  });

  it('allows creating a new group', async () => {
    vi.mocked(getGroups).mockResolvedValue(mockGroups);
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);
    vi.mocked(createGroup).mockResolvedValue({ id: 3, name: 'Group Gamma', idea: 'Idea Gamma', major: 'Software', status: 'Active' });

    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Group Alpha')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar grupo/i }));

    fireEvent.change(screen.getByLabelText(/nombre del grupo/i), { target: { value: 'Group Gamma' } });
    fireEvent.change(screen.getByLabelText(/cohorte/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(createGroup).toHaveBeenCalled();
    });
  });
});
