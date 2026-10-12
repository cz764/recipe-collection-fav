import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

export const pushMock = vi.fn();

// `server-only` throws outside a React Server Components bundle; tests import
// server modules directly, so neutralize the guard here.
vi.mock('server-only', () => ({}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));
