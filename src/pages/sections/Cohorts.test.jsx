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
    { id: 1, year: 2025, semester: 1, start_date: '2025-01-01', end_date: '2025-06-30', group_count: 15, status: 'Active', notes: '' },
    { id: 2, year: 2026, semester: 2, start_date: '2026-07-01', end_date: '2026-12-31', group_count: 10, status: 'Inactive', notes: '' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially and then loads cohorts successfully', async () => {
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
      expect(screen.getByText('2026')).toBeInTheDocument();
    });
  });

  it('handles error state when fetching cohorts fails', async () => {
    vi.mocked(getCohorts).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Failed to fetch')).toBeInTheDocument();
  });

  it('opens create modal when clicking the new cohort button', async () => {
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);

    render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar cohorte/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('successfully creates a new cohort', async () => {
    vi.mocked(getCohorts).mockResolvedValue(mockCohorts);
    vi.mocked(createCohort).mockResolvedValue({ id: 3, year: 2027, semester: 1, start_date: '2027-01-01', end_date: '2027-06-30', group_count: 0, status: 'Active', notes: '' });

    const { container } = render(
      <MemoryRouter>
        <ToastProvider>
          <Cohorts />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /agregar cohorte/i }));

    const dialog = await screen.findByRole('dialog');
    const yearInput = container.querySelector('input[name="year"]');
    if (yearInput) fireEvent.change(yearInput, { target: { value: '2027' } });

    const semesterInput = container.querySelector('input[name="semester"]');
    if (semesterInput) fireEvent.change(semesterInput, { target: { value: '1' } });

    const startDateInput = container.querySelector('input[name="start_date"]');
    if (startDateInput) fireEvent.change(startDateInput, { target: { value: '2027-01-01' } });

    const endDateInput = container.querySelector('input[name="end_date"]');
    if (endDateInput) fireEvent.change(endDateInput, { target: { value: '2027-06-30' } });

    const form = dialog.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(createCohort).toHaveBeenCalled();
    });
  });
});
