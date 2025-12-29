import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './login-form.tsx';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../../hooks/use-store.ts', () => ({
  useAppDispatch: vi.fn(),
}));

describe('LoginForm', () => {
  it('renders form elements correctly', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('does not submit the form when email or password is empty', () => {
    const dispatchMock = vi.fn();
    vi.fn().mockReturnValue(dispatchMock);

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.click(submitButton);

    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
