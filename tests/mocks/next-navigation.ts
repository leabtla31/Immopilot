import { vi } from "vitest";

/**
 * Mock of `next/navigation` for component tests:
 *   vi.mock("next/navigation", () => import("@/../tests/mocks/next-navigation"));
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

let pathname = "/dashboard";

export function setMockPathname(next: string) {
  pathname = next;
}

export const useRouter = () => mockRouter;
export const usePathname = () => pathname;
export const useSearchParams = () => new URLSearchParams();
export const redirect = vi.fn();
export const notFound = vi.fn();
