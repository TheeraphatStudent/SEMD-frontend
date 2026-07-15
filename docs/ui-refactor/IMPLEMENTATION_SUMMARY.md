# SEMD Frontend Refactoring Summary

## 1. Executive Summary

The frontend was refactored toward a single authentication source of truth, real generated API usage, and a normalized SEMD theme layer. The most critical functional fixes landed in auth/session handling, route protection, 2FA handoff, and prediction result truthfulness. Several mock-backed dashboard, user, and admin screens were replaced with thin real-data implementations that defer to backend responses instead of fabricated client state.

## 2. Scope Completed

- Auth/session storage normalization
- Route protection and unauthorized handling
- Two-factor login and setup flow fixes
- Prediction result normalization and real API binding
- Error normalization for API failures
- Shared shell and accessibility cleanup
- Real-data refactor for dashboard, profile, reports, flags, API access, admin users, admin flags, and admin API management

## 3. Architecture Changes

- Added cookie-backed auth storage in `src/lib/auth-storage.ts`
- Added normalized API error mapping in `src/lib/api-error.ts`
- Added object normalization helpers in `src/lib/object-access.ts`
- Added shared responsive shell in `src/components/layout/app-shell.tsx`
- Added `/unauthorized` route in `src/app/unauthorized/page.tsx`

## 4. Authentication Changes

- Client and middleware now read the same cookie-backed token and user payload.
- `AuthProvider` bridges `next-auth` sessions into the primary auth store instead of leaving two disconnected auth states.
- Logout clears the custom auth store and also signs out the `next-auth` session.
- Login now passes `preAuthToken` to `/two-factor`.
- Two-factor verification consumes the real pre-auth token.
- Two-factor setup now loads the real setup payload before enabling 2FA.

## 5. API Integration Changes

- Axios interceptors now use cookie-backed auth helpers.
- API errors are normalized into `validation`, `authentication`, `permission`, `rate_limit`, `server`, `network`, `timeout`, and `unknown`.
- Prediction flow uses `/prediction/predict` and `/stat/prediction/detail` data instead of synthesized local results.
- User and admin pages now call generated report, flag, key, profile, dashboard, and user-management endpoints where available.

## 6. Design-System Changes

- Tailwind aliases were normalized for missing semantic tokens such as `info`, `surface`, `text-primary`, `primary-dark`, `secondary-dark`, and role colors.
- Global focus-visible treatment was added in `src/app/globals.css`.
- Reduced-motion handling was expanded in `src/app/globals.css`.

## 7. Shared Component Changes

- `Button`: stronger focus styles and normalized color aliases
- `Input`: connected labels, descriptions, and error semantics
- `Modal`: `role="dialog"`, `aria-modal`, focus trap, focus restore, and escape handling
- `Toast`: `aria-live` and explicit status semantics
- `Sidebar` and `Header`: responsive shell behavior and accessible labels
- `UrlInputBox`: switched from direct `next-auth` inspection to the normalized auth store

## 8. Screen-by-Screen Changes

- `/login`: fixed 2FA redirect contract and improved mobile layout
- `/register`: improved responsive auth layout
- `/two-factor`: now reads `preAuthToken` and blocks incomplete verification state
- `/two-factor-setup`: now fetches and renders the real setup payload
- `/dashboard`: now loads prediction/report statistics from API endpoints
- `/scan`: status model aligned with backend-driven prediction states
- `/predict/[id]`: safe, suspicious, malicious, unknown, and failed states normalized from backend data
- `/report`: local preview table replaced with real report creation and list loading
- `/flags`: local preview table replaced with real flag creation, listing, and deletion
- `/api-access`: local demo key flow replaced with real key creation/reset/list loading
- `/profile`: now loads and updates the authenticated user profile
- `/admin/users`: local demo rows replaced with real user listing and guarded deletion
- `/admin/flags`: local demo rows replaced with real global flag listing and deletion
- `/admin/api-management`: local demo rows replaced with real admin key listing and status toggling

## 9. Responsive Improvements

- Added mobile drawer behavior in the shared app shell
- Reduced forced width issues on auth screens
- Improved long URL wrapping in result and data tables
- Standardized page container padding in the shell

## 10. Accessibility Improvements

- Connected form labels and inline error descriptions
- Added visible focus states across the app
- Added dialog semantics and keyboard handling to the modal component
- Added `aria-live` semantics to toast notifications
- Added navigation labels and `aria-current` handling in the sidebar

## 11. Animation Improvements

- Retained restrained motion in cards and shell transitions
- Added reduced-motion safeguards in global styles
- Avoided fake progress percentages in scan/result flows

## 12. Tests Added

- No automated tests were added in this session.
- Reason: the repository does not currently expose a test runner script and the execution environment did not provide a working runtime to install or run one safely.

## 13. Validation Results

| Command | Result | Notes |
| ------- | ------ | ----- |
| `npm install` | Not run | Runtime unavailable in this environment |
| `npm run dev` | Not run | Runtime unavailable in this environment |
| `npm run lint` | Not run | Runtime unavailable in this environment |
| `tsc --noEmit` | Not run | Runtime unavailable in this environment |
| `npm run build` | Not run | Runtime unavailable in this environment |

## 14. Before and After Screenshots

- `docs/ui-refactor/before/`: not captured
- `docs/ui-refactor/after/`: not captured

## 15. Remaining Issues

- Runtime validation is still outstanding.
- Several backend response models still expose `unknown` payload shapes, so some tables use defensive field normalization rather than strict typed models.
- The 2FA setup page currently renders the QR image via a third-party QR image URL built from the backend `qr_uri`; replacing that with an in-app QR renderer would remove the external dependency.
- No automated tests or screenshot validation were executed.

## 16. Backend Dependencies or Blockers

- Live verification of login, 2FA, dashboard, and CRUD flows requires a reachable backend and valid credentials.
- Access-key, report, and flag table field shapes depend on backend response payloads that are typed as `unknown` in the generated client.

## 17. Changed Files

- `src/lib/auth-storage.ts`
- `src/lib/api-error.ts`
- `src/lib/object-access.ts`
- `src/lib/api.ts`
- `src/lib/axios-instance.ts`
- `src/services/auth.service.ts`
- `src/services/scan.service.ts`
- `src/hooks/use-auth.ts`
- `src/hooks/use-scan.ts`
- `src/components/providers/AuthProvider.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/sidebar.tsx`
- `src/components/shared/UrlInputBox.tsx`
- `src/components/dashboard/ApiDocumentation.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/modal.tsx`
- `src/components/ui/toast.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/two-factor/page.tsx`
- `src/app/(auth)/two-factor-setup/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/scan/page.tsx`
- `src/app/(dashboard)/report/page.tsx`
- `src/app/(dashboard)/flags/page.tsx`
- `src/app/(dashboard)/api-access/page.tsx`
- `src/app/(dashboard)/profile/page.tsx`
- `src/app/predict/[id]/page.tsx`
- `src/app/(admin)/admin/users/page.tsx`
- `src/app/(admin)/admin/flags/page.tsx`
- `src/app/(admin)/admin/api-management/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(admin)/layout.tsx`
- `src/app/unauthorized/page.tsx`
- `src/constants/routes.ts`
- `src/config/route-config.ts`
- `src/middleware.ts`
- `src/types/scan.types.ts`
- `src/app/globals.css`
- `tailwind.config.ts`

## 18. Manual Testing Checklist

- Verify login without 2FA
- Verify login with 2FA required
- Verify two-factor setup using a real account
- Verify protected routes redirect to `/login`
- Verify unauthorized admin access redirects to `/unauthorized`
- Verify logout clears the session and cookies
- Verify `/scan` creates a real prediction and `/predict/[id]` renders the backend state
- Verify report creation and list refresh
- Verify flag creation and deletion
- Verify API key creation and reset behavior
- Verify profile update persistence
- Verify admin user, flag, and key pages against real backend data

## 19. Rollback Considerations

- Auth/session changes touch middleware, axios, auth services, and auth provider behavior together; partial rollback would likely reintroduce split auth state.
- Prediction changes touch both the scan page and prediction result page and should be rolled back together if necessary.
- Data-backed page rewrites replaced local mock views; rollback would restore mock behavior but also reintroduce inaccurate UI.

## 20. Recommended Next Tasks

1. Run dependency install, lint, type-check, and build in a runtime-enabled environment.
2. Verify live auth and 2FA flows against the backend.
3. Replace the third-party QR image generation dependency with an in-app solution if an approved implementation path exists.
4. Add automated tests for auth mapping, route protection, error normalization, and prediction state mapping.
5. Capture baseline and after screenshots for the required breakpoints.
