import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { getDashboardSummary } from '../../api/endpoints/dashboard';
import { getOverloadedTutors } from '../../api/endpoints/tutors';

vi.mock('../../api/endpoints/dashboard', () => ({
  getDashboardSummary: vi.fn(),
}));

vi.mock('../../api/endpoints/tutors', () => ({
  getOverloadedTutors: vi.fn(),
}));

describe('Dashboard Component', () => {
  const mockDashboardData = {
    active_groups: 4,
    active_tutors: 2,
    pending_deliverables: 8,
    alerts: [],
    groups_by_stage: [],
    groups_by_cohort: [],
    hours_by_group: [],
    capacity: {
      total_available_hours: 100,
      total_used_hours: 50,
      usage_percentage: 50,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getOverloadedTutors).mockResolvedValue([]);
  });

  it('renders loading state initially and displays dashboard metrics', async () => {
    vi.mocked(getDashboardSummary).mockResolvedValue(mockDashboardData);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });

  it('handles error state when dashboard data fails to load', async () => {
    vi.mocked(getDashboardSummary).mockRejectedValue(new Error('Error fetching dashboard'));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error|cargar|falló|falla|servidor/i)).toBeInTheDocument();
    });
  });
});
