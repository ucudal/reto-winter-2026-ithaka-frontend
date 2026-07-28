import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Cohorts from './Cohorts';
import { ToastProvider } from '../../ToastContext';
import { getCohorts, createCohort } from '../../api/endpoints/cohorts';

vi.mock('../../api/endpoints/cohorts', () => ({
  getCohorts: vi.fn(),
  createCohort: vi.fn(),
  updateCohort: vi.fn(),
}));

describe('Cohorts Component', () => {
  const mockCohorts = [
    { id: 1, year: 2026, semester: 1, start_date: '2026-01-01', end_date: '2026-06-30', group_count: 15, status: 'Active', notes: '' },
    { id: 2, year: 2026, semester: 2, start_date: '2026-07-01', end_date: '2026-12-31', group_count: 10, status: 'Inactive', notes: '' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially and then loads cohorts successfully', async () => {
    vi.mocked(getCohorts).mockResolvedValueOnce(mockCohorts);

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('2026')).toBeInTheDocument();
    });
  });

  it('handles error state when fetching cohorts fails', async () => {
    vi.mocked(getCohorts).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText((content) => /error|cargar|falló|falla/i.test(content))).toBeInTheDocument();
    });
  });

  it('opens create modal when clicking the new cohort button', async () => {
    vi.mocked(getCohorts).mockResolvedValueOnce(mockCohorts);

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2026')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar cohorte/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('successfully creates a new cohort', async () => {
    vi.mocked(getCohorts).mockResolvedValueOnce(mockCohorts);
    vi.mocked(createCohort).mockResolvedValueOnce({ id: 3, year: 2026, semester: 1, start_date: '2026-01-01', end_date: '2026-06-30', group_count: 0, status: 'Active', notes: '' });

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2026')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar cohorte/i }));

    fireEvent.change(screen.getByLabelText(/año/i), { target: { value: '2026' } });
    fireEvent.change(screen.getByLabelText(/semestre/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(createCohort).toHaveBeenCalled();
    });
  });
});
