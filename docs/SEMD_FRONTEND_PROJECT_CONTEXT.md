# SEMD Frontend Project Context

## 1. Executive Summary

SEMD is a single-package Next.js frontend that currently provides:
- A public landing flow with simulated URL scan loading/result states.
- Custom authentication pages for login, register, 2FA verification, and 2FA setup.
- A user dashboard area for dashboard, scan, reports, flags, API access, and profile.
- A limited admin area for user management, URL flags, and API management.

Current maturity:
- `Confirmed`: the codebase has a real app shell, custom UI primitives, generated API bindings, and local design tokens.
- `Confirmed`: many screens are still powered by local mock arrays or synthesized responses rather than backend data.
- `Confirmed`: auth, route protection, and scan flows contain implementation gaps that prevent treating the current frontend as production-ready.

Architecture:
- `Confirmed`: Next.js 14 App Router with route groups in `src/app`.
- `Confirmed`: Tailwind CSS + handwritten component primitives in `src/components/ui`.
- `Confirmed`: Axios + Orval-generated client in `src/services/generated/semdApi.ts`.
- `Confirmed`: Zustand stores for auth and toast state.

Design maturity:
- `Confirmed`: the implemented theme aligns closely with the exported design token file in `design/design-tokens.tokens.json`.
- `Confirmed`: local Figma/exported references exist in `design/` and were copied to `docs/figma-reference/`.
- `Inferred`: current production UI is an unfinished implementation of that same direction, not a separate redesign.

Figma coverage:
- `Confirmed`: local exported references cover login, register, 2FA login, 2FA register, dashboard, report, flags, API access, access code, profile, admin user management, admin flag management, admin API management, and safe/danger result states.
- `Not found`: concrete per-frame Figma node IDs for those exports. Only the root Figma link was provided: `https://www.figma.com/design/ni8hvhT4NI2pTRb5t3wV4c/SEMD?node-id=0-1&p=f`.

Main UI problems:
- Route, auth, and state wiring is inconsistent with the visual polish.
- Several Tailwind class names reference tokens not defined in `tailwind.config.ts`.
- Many tables/cards are placeholders with hard-coded stats.
- Accessibility and responsive handling are partial rather than systematic.
- The Figma/admin information density is not yet reflected in code.

Main technical risks:
- Middleware and route config do not enforce the same auth source as the client.
- 2FA login/setup are not wired to the real API flow end-to-end.
- Scan results are synthesized locally, which can misrepresent security outcomes.
- Next.js runtime usage is inconsistent in a few files.

Main opportunities:
- Preserve the current token palette and visual tone.
- Refactor auth/session consistency first.
- Replace placeholder screen data incrementally with generated API methods.
- Normalize shared primitives and missing token aliases.
- Align dashboard/admin information architecture to the exported design references.

## 2. Repository Structure

Focused tree:

```text
.
├── design/
│   ├── *.png, *.jpg
│   └── design-tokens.tokens.json
├── docs/
│   ├── current-ui/
│   └── figma-reference/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── (admin)/
│   │   ├── api/auth/[...nextauth]/
│   │   ├── predict/[id]/
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── loading/
│   │   ├── profile/
│   │   ├── result/
│   │   ├── shared/
│   │   └── ui/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── libs/
│   ├── services/
│   │   └── generated/
│   └── types/
├── .env.example
├── next.config.js
├── orval.config.ts
├── package.json
├── package-lock.json
├── bun.lock
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

Notes:
- `design/`: local exported Figma/reference images plus token export.
- `src/app/`: App Router entrypoints and layouts.
- `src/components/ui/`: local design-system primitives, not a third-party component kit.
- `src/services/generated/`: Orval output from sibling backend OpenAPI.
- `src/lib/` and `src/hooks/`: runtime utilities, auth/session helpers, animations, mock data.
- `.next/`: existing build artifacts are present but appear stale/partial and are not reliable evidence of current route completeness.

## 3. Technology Stack

| Area | Technology | Version | Evidence |
| ---- | ---------- | ------: | -------- |
| Frontend framework | Next.js App Router | 14.0.0 | `package.json`, `package-lock.json`, `src/app/layout.tsx` |
| React | React | 18.3.1 resolved | `package.json`, `package-lock.json` |
| React DOM | React DOM | 18.3.1 resolved | `package.json`, `package-lock.json` |
| Type system | TypeScript | 5.9.3 resolved | `tsconfig.json`, `package-lock.json` |
| Routing | Next.js file-based App Router | N/A | `src/app/**/page.tsx`, `src/app/**/layout.tsx` |
| Styling | Tailwind CSS | 3.4.19 resolved | `tailwind.config.ts`, `postcss.config.js`, `package-lock.json` |
| Utility class merge | tailwind-merge | 2.6.1 resolved | `src/lib/utils.ts`, `package-lock.json` |
| Class utility | clsx | 2.x | `src/lib/utils.ts`, `package.json` |
| Component library | Custom local components | N/A | `src/components/ui/*` |
| Icon library | Lucide React | 0.576.0 declared | `package.json`, widespread imports from `lucide-react` |
| Animation | Framer Motion | 12.34.4 resolved | `package-lock.json`, `src/components/**`, `src/lib/motion-variants.ts` |
| Animation alias package | `motion` | 12.34.4 resolved | `package.json`, `package-lock.json` |
| Forms | React Hook Form | 7.71.1 resolved | `package.json`, `package-lock.json` |
| Validation | Custom validators | N/A | `src/lib/validators.ts` |
| State management | Zustand | 4.4.7 declared | `src/hooks/use-auth.ts`, `src/hooks/use-toast.ts`, `package.json` |
| Server-state/data fetching | Handwritten async hooks/services | N/A | `src/hooks/use-scan.ts`, `src/services/*.ts` |
| HTTP client | Axios | 1.13.6 declared | `src/lib/axios-instance.ts`, `package.json` |
| Auth library | NextAuth | 4.24.13 resolved | `src/app/api/auth/[...nextauth]/route.ts`, `src/components/providers/AuthProvider.tsx`, `package-lock.json` |
| API client generation | Orval | 8.5.1 | `orval.config.ts`, `src/services/generated/semdApi.ts` |
| Alerts/modals | SweetAlert2 | 11.26.18 resolved | `src/lib/alert.ts`, `package-lock.json` |
| Fonts | `next/font/google` Kanit | N/A | `src/app/layout.tsx` |
| Testing | Not found | N/A | no test script in `package.json`; no Jest/Vitest/Playwright/Cypress config found |
| Package manager | npm lock and Bun lock both present | N/A | `package-lock.json`, `bun.lock` |
| Monorepo tool | Not found | N/A | no workspace config found; sibling backend referenced from `orval.config.ts` |
| Build tool | Next.js build | 14.0.0 | `package.json` scripts |

## 4. Frontend Architecture

Application shell:
- `src/app/layout.tsx` loads global CSS, Kanit font variable, `AuthProvider`, and `ToastContainer`.
- `src/app/(dashboard)/layout.tsx` and `src/app/(admin)/layout.tsx` both use the same `Sidebar` + `Header` shell.

Routing:
- Public landing page: `src/app/page.tsx`.
- Auth routes: `src/app/(auth)/*`.
- User routes: `src/app/(dashboard)/*`.
- Admin routes: `src/app/(admin)/admin/*`.
- Result route: `src/app/predict/[id]/page.tsx`.

Components:
- Shared primitives live in `src/components/ui/`.
- Domain-specific UI is split across `landing`, `auth`, `dashboard`, `profile`, `result`, `shared`, and `layout`.

State:
- `Zustand`: auth store in `src/hooks/use-auth.ts`, toast store in `src/hooks/use-toast.ts`.
- `useState`: most page and component state.
- `Inferred`: there is no dedicated server-state cache layer such as React Query/SWR actively used.

API layer:
- `src/lib/axios-instance.ts`: Axios instance with bearer injection and 401 refresh handling.
- `src/lib/api.ts`: binds Orval client with `getSemdApi`.
- `src/services/generated/semdApi.ts`: generated endpoint methods.
- Handwritten wrappers: `src/services/auth.service.ts`, `src/services/scan.service.ts`.

Authentication:
- Session provider: `src/components/providers/AuthProvider.tsx`.
- OAuth: NextAuth provider route in `src/app/api/auth/[...nextauth]/route.ts`.
- Username/password + 2FA flow: custom Zustand/auth service path.

Theme:
- Tailwind extension tokens in `tailwind.config.ts`.
- Base body theme in `src/app/globals.css`.
- Figma token export in `design/design-tokens.tokens.json`.

Role handling:
- Constants in `src/constants/config.ts`.
- Sidebar shows admin menu if `user.role` is `admin` or `master_admin`.
- Middleware attempts route guarding, but the current implementation is not reliable.

## 5. Route Inventory

| Route | Role | Page | Purpose | Figma Node | Status |
| ----- | ---- | ---- | ------- | ---------- | ------ |
| `/` | Public | `src/app/page.tsx` | Landing + simulated scan funnel | Not found | Implemented |
| `/login` | Public | `src/app/(auth)/login/page.tsx` | Username/password + OAuth login | Not found | Implemented |
| `/register` | Public | `src/app/(auth)/register/page.tsx` | Registration + OAuth | Not found | Implemented |
| `/two-factor` | Public transitional | `src/app/(auth)/two-factor/page.tsx` | OTP verification after pre-auth | Not found | Implemented with flow mismatch |
| `/two-factor-setup` | Public transitional | `src/app/(auth)/two-factor-setup/page.tsx` | Enable authenticator after registration | Not found | Implemented with missing setup data |
| `/dashboard` | User | `src/app/(dashboard)/dashboard/page.tsx` | Summary stats | Not found | Implemented with mock data |
| `/scan` | User | `src/app/(dashboard)/scan/page.tsx` | URL evaluation UI | Not found | Implemented with mock/synthesized result flow |
| `/report` | User | `src/app/(dashboard)/report/page.tsx` | User report history/report entry shell | Not found | Implemented with preview table |
| `/flags` | User | `src/app/(dashboard)/flags/page.tsx` | User flag management shell | Not found | Implemented with preview table |
| `/api-access` | User | `src/app/(dashboard)/api-access/page.tsx` | API docs + API key management | Not found | Implemented with mock data/modal |
| `/profile` | User | `src/app/(dashboard)/profile/page.tsx` | Profile and connected accounts | Not found | Implemented with mock data |
| `/predict/[id]` | User/Public by code | `src/app/predict/[id]/page.tsx` | Prediction result page | Not found | Implemented with synthesized fetch |
| `/admin/users` | Admin, Master Admin | `src/app/(admin)/admin/users/page.tsx` | User management | Not found | Implemented with mock data |
| `/admin/flags` | Admin, Master Admin | `src/app/(admin)/admin/flags/page.tsx` | Flag management | Not found | Implemented with mock data |
| `/admin/api-management` | Admin, Master Admin | `src/app/(admin)/admin/api-management/page.tsx` | API key management for all users | Not found | Implemented with mock data |
| `/api/auth/[...nextauth]` | System | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth provider callback route | N/A | Implemented |

`Not found` / planned but not implemented in code:
- Password reset page.
- Unauthorized page.
- Not-found page.
- First-login reset.
- Access code page despite `ROUTES.DASHBOARD.API_CODE`.
- Master-admin pages for models, datasets, queue, logs.

## 6. Role and Permission Matrix

| Feature | Public | User | Admin | Master Admin |
| ------- | -----: | ---: | ----: | -----------: |
| Landing and simulated scan funnel | Yes | Yes | Yes | Yes |
| Login/Register/OAuth UI | Yes | Redirected when auth works | Redirected when auth works | Redirected when auth works |
| Dashboard | No | Yes | Yes | Yes |
| URL scan | No | Yes | Yes | Yes |
| User reports | No | Yes | Yes | Yes |
| User flags | No | Yes | Yes | Yes |
| API access page | No | Yes | Yes | Yes |
| Profile | No | Yes | Yes | Yes |
| Admin users | No | No | Yes | Yes |
| Admin flags | No | No | Yes | Yes |
| Admin API management | No | No | Yes | Yes |
| Master-admin model/dataset/log pages | No | No | No | Not implemented |

Evidence:
- `src/constants/config.ts`
- `src/components/layout/sidebar.tsx`
- `src/config/route-config.ts`

## 7. Figma Structure

`Confirmed` from local exports in `design/`:
- Auth login
- Auth register
- Auth twofa login
- Auth twofa register
- User dashboard
- User report url
- User Url flag management
- User access api
- User access code
- User profile info
- User - home
- System management - user management
- System management - Url flag management
- System management - api access management
- Web - Predicted result (danger)
- Web - Predicted result (safe)

`Confirmed` token/style export:
- `design/design-tokens.tokens.json` contains gradients, shadows, color variables, and spacing variables.

`Not found`:
- Figma page names from the live file.
- Concrete component pages/variants metadata.
- Prototype links per frame.
- Frame node IDs beyond the provided root `0:1`.

## 8. Figma Screen Inventory

| Screen | Node ID | Role | Purpose | Implementation Route |
| ------ | ------- | ---- | ------- | -------------------- |
| Auth login | Not found | Public | Sign in | `/login` |
| Auth register | Not found | Public | Sign up | `/register` |
| Auth twofa login | Not found | Public transitional | OTP verification | `/two-factor` |
| Auth twofa register | Not found | Public transitional | Authenticator setup | `/two-factor-setup` |
| User dashboard | Not found | User | KPI + chart summary | `/dashboard` |
| User report url | Not found | User | Report workflow/history | `/report` |
| User Url flag management | Not found | User | Personal flag review | `/flags` |
| User access api | Not found | User | API keys and usage | `/api-access` |
| User access code | Not found | User | Access code screen | Not implemented |
| User profile info | Not found | User | Profile editing | `/profile` |
| System management - user management | Not found | Admin | User management | `/admin/users` |
| System management - Url flag management | Not found | Admin | URL flag management | `/admin/flags` |
| System management - api access management | Not found | Admin | Global API management | `/admin/api-management` |
| Web - Predicted result (safe) | Not found | User | Safe result state | `/predict/[id]` |
| Web - Predicted result (danger) | Not found | User | Malicious result state | `/predict/[id]` |

## 9. Current UI Inventory

| Screen | Route | Components | Data Source | UI States | Main Issues |
| ------ | ----- | ---------- | ----------- | --------- | ----------- |
| Landing | `/` | `SEMDApp`, landing sections, `UrlInputBox`, `LoadingView`, `ResultView` | `src/lib/mockData.ts`, local regex simulation | landing, loading, result | Simulated security verdicts; emojis used structurally in sections/result |
| Login | `/login` | `AuthBackground`, `Input`, `RecaptchaV3`, `SocialLoginRow` | `useAuth.login`, NextAuth `signIn` | idle, loading, toast error | reCAPTCHA token collected but not submitted; 2FA query mismatch |
| Register | `/register` | same pattern as login | `useAuth.register` | idle, validation error, loading | register flow ignores reCAPTCHA token and always redirects to 2FA setup |
| 2FA verify | `/two-factor` | `OTPInput`, buttons | `useAuth.verify2FA` | idle, loading, toast error | page reads `email` query but login pushes `token`; API expects pre-auth token |
| 2FA setup | `/two-factor-setup` | OTP + static QR placeholder | `useAuth.enable2FA` | idle, loading, toast error | never calls `setup2FA()`, secret remains empty, QR is decorative only |
| Dashboard | `/dashboard` | cards, progress bars | hard-coded literals | static only | no loading/empty/error; missing chart component from design |
| Scan | `/scan` | `UrlInputBox`, `URLTablePreview` | `useScan` -> `scanService` | submit, loading via route change, toast error | invalid JSX structure; result ID hard-coded; API result ignored |
| Report | `/report` | card + `URLTablePreview` | local mock rows | static only | no real report form, no API history |
| Flags | `/flags` | card + `URLTablePreview` | local mock rows | static only | user/admin distinction absent |
| API access | `/api-access` | `ApiDocumentation`, `ApiKeysTable`, modal | local mock keys + client-side generated fake key | modal open/close | docs/base URL hard-coded; no backend mutations |
| Profile | `/profile` | `ProfilePage` and profile cards | `src/lib/profileMock.ts` | static form-like UI | no real user binding or save flow |
| Prediction result | `/predict/[id]` | cards, badges, recommendation panel | `useScan.getResult` -> synthesized object | loading, not found, result | only safe/danger; no suspicious/unknown/failed distinction |
| Admin users | `/admin/users` | cards, simple table | local array | static only | no search/filter/pagination parity with design |
| Admin flags | `/admin/flags` | cards, simple table | local array | static only | no add/edit dialogs wired |
| Admin API management | `/admin/api-management` | cards, simple table | local array | static only | no usage detail or revoke workflow |

## 10. Figma-to-Code Mapping

| Figma Screen | Code Route | Code Component | Match Level | Missing or Different |
| ------------ | ---------- | -------------- | ----------- | -------------------- |
| Auth login | `/login` | `src/app/(auth)/login/page.tsx` | Partial | Layout direction and palette match; mascot absent; table content and form details differ |
| Auth register | `/register` | `src/app/(auth)/register/page.tsx` | Partial | Similar shell; copy differs; missing some decorative/mascot fidelity |
| Auth twofa login | `/two-factor` | `src/app/(auth)/two-factor/page.tsx` | Partial | Visual structure similar; data flow broken |
| Auth twofa register | `/two-factor-setup` | `src/app/(auth)/two-factor-setup/page.tsx` | Partial | Visual structure similar; real QR/secret flow missing |
| User dashboard | `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Outdated | Figma has richer charting/KPI composition; code uses minimal cards and bars |
| User report url | `/report` | `src/app/(dashboard)/report/page.tsx` | Partial | Theme and table idea preserved; Figma has richer filters/cards |
| User flag management | `/flags` | `src/app/(dashboard)/flags/page.tsx` | Partial | Same general area; code uses generic preview table |
| User access api | `/api-access` | `src/app/(dashboard)/api-access/page.tsx` | Partial | Documentation block added; table closer to Figma but still mock-backed |
| User access code | None | None | Not implemented | Route constant exists but no page |
| User profile info | `/profile` | `src/components/profile/ProfilePage.tsx` | Partial | Split-card layout differs from single larger profile form |
| Admin user management | `/admin/users` | `src/app/(admin)/admin/users/page.tsx` | Partial | Figma has denser management console and role chips; code simpler |
| Admin URL flag management | `/admin/flags` | `src/app/(admin)/admin/flags/page.tsx` | Partial | Similar table concept; code lacks filter/add UI fidelity |
| Admin API management | `/admin/api-management` | `src/app/(admin)/admin/api-management/page.tsx` | Partial | Similar table concept; code is much simpler |
| Result safe/danger | `/predict/[id]` | `src/app/predict/[id]/page.tsx` | Partial | Palette/gradient intent matches; layout, QR/share affordance, and detail density differ |

## 11. Theme and Design Tokens

| Token | Figma Value | Code Value | Source | Status | Preserve |
| ----- | ----------- | ---------- | ------ | ------ | -------- |
| Primary 0 | `#9C7626` | `primary.0: #9C7626` | `design/design-tokens.tokens.json`, `tailwind.config.ts` | Matched | Yes |
| Primary 1 | `#FFCE69` | `primary.DEFAULT/#FFCE69` | same | Matched | Yes |
| Primary 2 | `#FFF6E4` | `primary.light/#FFF6E4` | same | Matched | Yes |
| Secondary 0 | `#1E3E90` | `secondary.dark/#1E3E90` | same | Matched | Yes |
| Secondary 1 | `#799EFF` | `secondary.DEFAULT/#799EFF` | same | Matched | Yes |
| Secondary 2 | `#D3DFFF` | `secondary.light/#D3DFFF` | same | Matched | Yes |
| Accent red | `#FF696C` | `accent.red/#FF696C`, `danger/#FF696C` | same | Matched | Yes |
| Accent green | `#5EB930` | `accent.green/#5EB930`, `safe/#5EB930` | same | Matched | Yes |
| Accent orange | `#FFBE69` | `accent.orange/#FFBE69`, `warning/#FFBE69` | same | Matched | Yes |
| Accent sky | `#69DCFF` | `accent.sky/#69DCFF` | same | Matched | Yes |
| Background | `#FFFCEB` | `background/#FFFCEB` | same | Matched | Yes |
| Light | `#FFFEF4` | `light/#FFFEF4` | same | Matched | Yes |
| Dark | `#473100` | `dark/#473100` | same | Matched | Yes |
| Gray primary 0 | `#685D4F` | `gray.primary.0/#685D4F` | same | Matched | Yes |
| Gray primary 1 | `#EBE1D5` | `gray.primary.1/#EBE1D5` | same | Matched | Yes |
| Gray primary 2 | `#F0E9E2` | `gray.primary.2/#F0E9E2` | same | Matched | Yes |
| Shadow sm | drop `2 2 2 #47310026` + inner `-4 0 4 #4731000d` | `boxShadow.sm` | same | Matched | Yes |
| Shadow xl | `2 4 6 #47310040` | `boxShadow.xl` | same | Matched | Yes |
| Shadow huge | `4 8 8 #47310080` | `boxShadow.huge` | same | Matched | Yes |
| Space xs/sm/md/xl | `2/4/8/12` | same | same | Matched | Yes |
| Predict safe gradient | token export | `backgroundImage.gradient-safe-1/-2` | same | Matched | Yes |
| Predict danger gradient | token export | `backgroundImage.gradient-danger-1/-2` | same | Matched | Yes |
| Admin gradient | token export | `backgroundImage.gradient-admin` | same | Matched | Yes |
| Master admin gradient | token export | `backgroundImage.gradient-master-admin` | same | Matched | Yes |
| `info` semantic color | Not found in token export | referenced in code only | `src/components/ui/badge.tsx`, `src/components/ui/pulse.tsx`, `src/components/ui/icon.tsx` | Missing in code theme | Investigate before refactor |
| `font-display` / `font-body` | Not found in token export | referenced in code only | `src/app/(auth)/layout.tsx`, auth pages | Hard-coded / inconsistent | Clarify |
| `primary-dark` alias | Not found as Tailwind color alias | referenced in code | many components | Inconsistent | Preserve intent, normalize token aliasing later |
| `gray-primary-dark/light` aliases | Not defined in Tailwind config | referenced in code | many components | Inconsistent | Preserve intent, normalize later |

Theme sources:
- `tailwind.config.ts`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `design/design-tokens.tokens.json`

## 12. Shared Components

| Component | File | Variants | Used By | Quality | Future Direction |
| --------- | ---- | -------- | ------- | ------- | ---------------- |
| Button | `src/components/ui/button.tsx` | `primary`, `secondary`, `outline`, `ghost`, `danger` | app-wide | Good base, token alias issues | Preserve and normalize tokens/states |
| Input | `src/components/ui/input.tsx` | label/error/helper | auth forms | Good base, lacks id/for wiring | Preserve and improve a11y |
| Card | `src/components/ui/card.tsx` | `default`, `elevated`, `outlined` | app-wide | Good base | Preserve |
| Badge | `src/components/ui/badge.tsx` | benign/malicious/warning/danger/info/safe/admin/master-admin | app-wide | Variant map references undefined `info` tokens | Preserve intent, fix token map later |
| Modal | `src/components/ui/modal.tsx` | size `sm`-`xl` | not widely used | Escape/scroll lock only; no focus trap | Improve |
| DataTable | `src/components/ui/DataTable.tsx` | full/compact, filters, pagination, expand rows | dashboard/auth previews, API keys | Strong reuse candidate | Preserve and harden a11y/responsiveness |
| Table | `src/components/ui/table.tsx` | filterable header option | admin pages | Simpler than DataTable | Merge or narrow use later |
| OTPInput | `src/components/ui/otp-input.tsx` | length | 2FA screens | Good keyboard/paste support | Preserve |
| ToastContainer | `src/components/ui/toast.tsx` | success/error/warning/info | app-wide | No aria-live | Improve |
| UrlInputBox | `src/components/shared/UrlInputBox.tsx` | `landing`/`dashboard` | landing, scan | Important shared primitive | Preserve and decouple routing/state |
| URLTablePreview | `src/components/auth/URLTablePreview.tsx` | full/compact | auth, report, flags, landing demo | High reuse but mock-backed | Preserve and connect to real data |
| ApiKeysTable | `src/components/dashboard/ApiKeysTable.tsx` | optional data prop | API access | Good table composition | Preserve |
| ApiDocumentation | `src/components/dashboard/ApiDocumentation.tsx` | tabbed examples | API access | Useful but hard-coded | Improve |
| Profile composite | `src/components/profile/ProfilePage.tsx` | left/right card layout | profile | Mock-backed | Preserve structure, replace data source |
| Sidebar | `src/components/layout/sidebar.tsx` | role-aware sections | dashboard/admin | Important shell primitive | Preserve, add responsive collapse |
| Header | `src/components/layout/header.tsx` | optional title/menu | dashboard/admin | Incomplete and imports wrong router API | Improve |

## 13. Authentication and Authorization

Confirmed flow from code:

```text
User opens /login
  -> enters username + password
  -> RecaptchaV3 requests a token on the client
  -> login page calls useAuth.login()
  -> authService.login() calls api.loginAuthLoginPost()
  -> if backend returns token pair:
       tokenManager stores access/refresh tokens in localStorage
       login page redirects to /dashboard
  -> if backend returns pre_auth_token:
       login page redirects to /two-factor?token=...
```

2FA issues:
- `Confirmed`: `src/app/(auth)/two-factor/page.tsx` reads `email` from search params, not `token`.
- `Confirmed`: `useAuth.verify2FA()` expects `preAuthToken`.
- `Impact`: the current 2FA login page cannot complete the custom flow as written.

2FA setup issues:
- `Confirmed`: `authService.setup2FA()` exists.
- `Confirmed`: `src/app/(auth)/two-factor-setup/page.tsx` never calls it.
- `Confirmed`: page keeps `secret` as local state but never populates it.
- `Impact`: the setup UI is present, but the enable flow is incomplete.

OAuth:
- `Confirmed`: Google and GitHub providers are configured in `src/app/api/auth/[...nextauth]/route.ts`.
- `Confirmed`: `SocialLoginRow` calls `signIn('google')` and `signIn('github')`.
- `Confirmed`: NextAuth exchanges provider access tokens with the backend at `/auth/login/provider`.

Route protection:
- `Confirmed`: middleware reads auth cookie values `semd_auth_token` and `semd_user`.
- `Confirmed`: client auth persists tokens in `localStorage`, not cookies.
- `Confirmed`: `shouldIgnoreRoute()` currently returns `true` immediately in `src/config/route-config.ts`.
- `Impact`: middleware-based protection is effectively disabled and also mismatched to the client storage strategy.

Role guards:
- `Confirmed`: route config intends to restrict `/admin/*` to admin/master admin.
- `Confirmed`: sidebar visibility also depends on `useAuth().user?.role`.
- `Inferred`: because user persistence is incomplete, role-based UI will be inconsistent unless the app hydrates user state elsewhere.

## 14. API Integration

| Domain | Client Method | Endpoint | Used By | Error Handling |
| ------ | ------------- | -------- | ------- | -------------- |
| Register | `registerAuthRegisterPost` | `/auth/register` | `src/services/auth.service.ts` | throws Axios error; toast at page level |
| Login | `loginAuthLoginPost` | `/auth/login` | `src/services/auth.service.ts` | throws Axios error; Zustand error + toast |
| 2FA verify | `login2faAuthLogin2faPost` | `/auth/login/2fa` | `src/services/auth.service.ts` | throws Axios error |
| 2FA setup | `setup2faAuth2faSetupPost` | `/auth/2fa/setup` | auth service only | not currently used by page |
| 2FA enable | `enable2faAuth2faEnablePost` | `/auth/2fa/enable` | `src/services/auth.service.ts` | throws Axios error |
| Refresh | `refreshAuthRefreshPost` | `/auth/refresh` | auth service and Axios interceptor logic | redirect to `/login` on failure |
| Logout | `logoutAuthLogoutPost` | `/auth/logout` | auth service | clears local auth in finally |
| OAuth provider login | backend fetch in NextAuth route | `/auth/login/provider` | `src/app/api/auth/[...nextauth]/route.ts` | token error stored in session |
| URL predict | `predictPredictionPredictPost` | `/prediction/predict` | `src/services/scan.service.ts` | current wrapper ignores payload and returns synthesized object |
| Health | `healthCheckHealthGet` | `/health` | `scanService.checkHealth()` | wrapper returns `{status:'ok'}` regardless of payload |
| User reports | `getMyReportsReportMeGet` | `/report/me` | Not currently used | generated only |
| URL flags | `getMyFlagsSettingUrlFlagMeGet` | `/setting/url-flag/me` | Not currently used | generated only |
| API keys | `getMyKeysSettingAccessKeyMeGet` | `/setting/access-key/me` | Not currently used | generated only |
| Admin users | `getAllUsersAuthUsersGet` | `/auth/users` | Not currently used | generated only |
| Dashboard stats | `getSystemStatDashboardSystemStatGet`, related methods | `/dashboard/*`, `/stat/*` | Not currently used | generated only |

API config:
- Base URL: `NEXT_PUBLIC_API_BASE_URL` from `.env.example`.
- Generated source: `orval.config.ts` points at `../semd-backend/openapi.yaml`.
- Axios refresh queue logic: `src/lib/axios-instance.ts`.

## 15. State Management

Client state:
- Auth: Zustand store in `src/hooks/use-auth.ts`.
- Toasts: Zustand store in `src/hooks/use-toast.ts`.
- Scan state: local hook state in `src/hooks/use-scan.ts`.
- Tables/filters/modals: local component state in `DataTable`, `ApiAccessPage`, `CreateApiKeyModal`, `UrlInputBox`.

Persistence:
- Tokens: `localStorage` via `tokenManager` in `src/lib/axios-instance.ts`.
- User object: helper exists in `src/lib/api.ts`, but `saveUser()` is not called in the current auth flow.
- Landing-to-dashboard pending URL state: `localStorage` in `UrlInputBox`.

Duplication / coupling:
- `Confirmed`: route protection expects cookies, while client auth uses `localStorage`.
- `Confirmed`: there are parallel auth concepts from NextAuth session and custom local token storage.
- `Confirmed`: scan hook and scan service abstract backend calls, but the service currently fabricates returned data.

Stale/race risks:
- Axios refresh queue is implemented, which reduces concurrent 401 duplication.
- Missing persisted user hydration means sidebar role state can drift from actual session state.
- `UrlInputBox` auto-submits pending content on dashboard mount, which can create unexpected navigation/submission behavior.

## 16. URL Evaluation Experience

Confirmed current flow:
1. User enters URL/CSV/TXT in `UrlInputBox`.
2. For landing variant, input is saved to `localStorage`; user is redirected to `/login` if no NextAuth session, otherwise hard-coded to `/dashboard/scan`.
3. For dashboard variant, `onCheck` triggers `useScan.predict()`.
4. `useScan.predict()` calls `scanService.predictUrl(url)`.
5. `scanService.predictUrl()` calls the generated predict endpoint but discards the response and returns a synthesized `PredictionResult` with fixed `id: '1'`, `isMalicious: false`, `accuracy: 0.95`, `suggested: 'safe'`.
6. Scan page navigates to `/predict/1`.
7. Result page calls `useScan.getResult(id)`.
8. `scanService.getPredictionResult(id)` returns another synthesized result object.

State coverage:
- Safe: yes
- Suspicious: no dedicated state
- Malicious: yes
- Unknown: no
- Failed: error toast only
- Pending: loading spinner page and landing loading view

Risk:
- `P0`: synthesized safe/malicious outputs can imply authoritative security analysis when the UI is not actually reflecting backend truth.

## 17. Dashboard and Visualization

Current dashboard:
- KPI cards for scanned URLs, malicious URLs, safe URLs, and accuracy.
- “Recent checks” list.
- “Weekly stats” progress bars.

Evidence:
- `src/app/(dashboard)/dashboard/page.tsx`

Findings:
- `Confirmed`: all values are hard-coded.
- `Confirmed`: no chart library is used despite design references showing richer visual summaries.
- `Confirmed`: no empty/loading/error states for dashboard data.
- `Confirmed`: no accessible data table alternative is needed yet because no actual chart library is rendered, but the current progress bars do not expose semantic data summaries.

## 18. Tables and Management Screens

Reusable table patterns:
- `DataTable`: richer, browser-bar style, filters, expandable rows, pagination.
- `Table`: simpler semantic wrapper used by admin screens.

Issues:
- `Confirmed`: user/admin tables are inconsistent across `DataTable` and `Table`.
- `Confirmed`: admin tables lack search, loading, empty, and error states.
- `Confirmed`: no mobile fallback strategy is defined for wide admin tables beyond some `hiddenOnMobile` columns in `DataTable`.
- `Confirmed`: row actions are placeholders in admin pages.

## 19. Responsive Design Review

Supported breakpoints found in code:
- Tailwind defaults plus ad hoc responsive utilities such as `md:`, `lg:`, `max-[680px]`.

Findings by breakpoint:
- `375 x 812`: auth pages use a fixed `440px` right panel in login/register, which will overflow on narrow mobile widths.
- `768 x 1024`: dashboard shell still assumes permanent sidebar; no mobile drawer/collapse logic exists.
- `1280 x 800`: primary layouts are serviceable.
- `1440 x 900`: matches local exported references most closely.
- `1920 x 1080`: content can feel under-filled because most dashboard/admin pages are not as dense as the design exports.

Evidence:
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/profile/ProfilePage.tsx`

## 20. Accessibility Review

| Priority | Screen or Component | Issue | Evidence | Recommended Direction |
| -------- | ------------------- | ----- | -------- | --------------------- |
| P0 | Result and landing content | Security state communication relies on simulated content and decorative emoji/iconography | `src/components/SEMDApp.tsx`, `src/components/result/ResultView.tsx` | Replace simulated semantics with real backend state before trusting status UI |
| P1 | Modal | No focus trap or initial focus management | `src/components/ui/modal.tsx` | Add focus management and aria-modal behavior |
| P1 | Toasts | No `aria-live` region | `src/components/ui/toast.tsx` | Add polite live announcements |
| P1 | Auth form labels | `Input` labels are visual only and not bound with `htmlFor`/`id` | `src/components/ui/input.tsx` | Generate ids and bind labels |
| P1 | Icon-only GitHub login button | No explicit accessible label beyond title | `src/components/auth/SocialLoginRow.tsx` | Add `aria-label` |
| P1 | Header/profile icon button | Notification/user button has no label | `src/components/layout/header.tsx` | Add accessible name |
| P2 | Structural emoji use | Multiple sections use emoji as primary iconography | landing sections, `ResultView` | Replace with SVG icons in implementation phase |
| P2 | Focus visibility consistency | Some custom buttons/inputs rely on hover styling more than visible focus | multiple UI primitives | Normalize focus ring tokens |
| P2 | OTP labels | OTP inputs have English digit labels only in Thai app context | `src/components/ui/otp-input.tsx` | Improve localized screen reader text |

## 21. Animation Readiness

Existing animation:
- Tailwind custom keyframes in `tailwind.config.ts`
- Framer Motion variants in `src/lib/motion-variants.ts`
- Animated buttons/cards/lists/page wrappers
- Decorative auth background drift

Safe future opportunities:
- Page entry for dashboard cards
- Scan-in-progress state with clearer staged progress
- Result-state transitions between pending/safe/suspicious/malicious
- Sidebar collapse on tablet/mobile
- Modal entrance/exit with focus-safe choreography
- Chart and table reveal once real data is connected

Constraints:
- `Confirmed`: no reduced-motion handling exists.
- `Confirmed`: some hover/tap animations are applied broadly and should be reviewed for accessibility/performance.

## 22. Asset Inventory

| Asset | File | Used In | Active | Figma Equivalent | Recommendation |
| ----- | ---- | ------- | ------ | ---------------- | -------------- |
| Favicon | `src/app/favicon.ico` | app shell | Yes | Not confirmed | Preserve |
| Next/Vercel sample assets | `public/next.svg`, `public/vercel.svg` | Not used | No | None | Can be ignored later |
| Exported design references | `design/*.png`, `design/*.jpg` | documentation | Yes | Yes | Preserve as refactor reference |
| Mascot SVG idea | commented inside `src/components/auth/SEMDMascot.tsx` | auth pages | No visible mascot rendered | likely intended | Clarify whether mascot should be restored |
| reCAPTCHA logo | external Google image URL | auth pages | Yes | None | Accept as service requirement |

Fonts:
- `Confirmed`: Kanit is actively loaded from Google fonts in `src/app/layout.tsx`.
- `Not found`: a loaded source for `font-display` / `font-body`.

## 23. UI Gap Analysis

| Priority | Screen | Finding | Figma Evidence | Code Evidence | Recommended Direction |
| -------- | ------ | ------- | -------------- | ------------- | --------------------- |
| P0 | Login -> 2FA | 2FA transition is visually implemented but functionally mismatched | `Auth twofa login.png` | `src/app/(auth)/login/page.tsx`, `src/app/(auth)/two-factor/page.tsx` | Preserve visuals, fix token handoff and setup sequence |
| P0 | Scan/result | Current result can misrepresent backend truth because it is synthesized | `Web - Predicted result (danger).png`, `Web - Predicted result (safe).jpg` | `src/services/scan.service.ts` | Wire result UI to actual prediction payload before visual polish |
| P1 | Dashboard | Figma shows denser summary and clearer management context than code | `User dashboard.png` | `src/app/(dashboard)/dashboard/page.tsx` | Preserve theme, rebuild composition to match Figma density |
| P1 | Admin management | Figma includes multi-section admin/master-admin IA; code only has 3 simplified pages | admin exports | `src/app/(admin)/admin/*`, `src/components/layout/sidebar.tsx` | Preserve current routes, clarify missing admin scope before refactor |
| P1 | API access | Figma table/action layout is stronger than current mix of mock docs and modal | `User access api.png` | `src/app/(dashboard)/api-access/page.tsx` | Preserve feature set, improve action hierarchy and data wiring |
| P2 | Profile | Figma uses a more direct editable profile form; current screen uses card collage with mock data | `User profile info.png` | `src/components/profile/ProfilePage.tsx` | Retain theme, simplify profile workflow |
| P2 | Auth pages | Visual tone is aligned but mascot/illustration identity is partially missing | auth exports | `src/components/auth/SEMDMascot.tsx` | Decide whether mascot is part of final brand direction |
| P2 | Tables | Figma tables use more explicit admin filters and badges | admin/user exports | `DataTable`, admin `Table` pages | Standardize table primitive and badge semantics |

## 24. Code Quality Findings

| Priority | Finding | Evidence | Impact | Recommended Direction |
| -------- | ------- | -------- | ------ | --------------------- |
| P0 | Route guarding is effectively disabled | `src/config/route-config.ts` returns `true` immediately from `shouldIgnoreRoute()` | Middleware protection does not run | Fix before trusting auth UX |
| P0 | Middleware auth source does not match client auth persistence | `src/middleware.ts`, `src/lib/axios-instance.ts` | Route auth and role checks can never be consistent | Unify session/token source |
| P0 | 2FA login query contract is broken | `src/app/(auth)/login/page.tsx`, `src/app/(auth)/two-factor/page.tsx` | Users cannot complete intended 2FA flow reliably | Align param names and payload |
| P0 | Scan service ignores backend prediction payload and fabricates result | `src/services/scan.service.ts` | Security verdict UI can be misleading | Bind to real response shape |
| P1 | 2FA setup page never fetches secret/QR from backend | `src/app/(auth)/two-factor-setup/page.tsx`, `src/services/auth.service.ts` | Setup UI is non-functional | Use `setup2FA()` and real QR/secret |
| P1 | `Header` imports `useRouter` from `next/router` in an App Router app | `src/components/layout/header.tsx` | Runtime/build risk | Replace with App Router APIs or remove |
| P1 | Multiple Tailwind utility names are undefined in theme | e.g. `text-info`, `font-display`, `text-primary-dark`, `gray-primary-dark` across `src/components/**` | Styling inconsistency and possible missing CSS | Normalize token aliases |
| P1 | `UrlInputBox` redirects authenticated landing users to `/dashboard/scan`, but implemented scan route is `/scan` | `src/components/shared/UrlInputBox.tsx`, `src/app/(dashboard)/scan/page.tsx` | Broken navigation path | Align route usage |
| P2 | `saveUser()` helper is never used | `src/lib/api.ts`, search usage | Sidebar/user persistence incomplete | Hydrate/store user once auth contract is clarified |
| P2 | Existing `.next` manifest appears partial | `.next/server/app-paths-manifest.json` contains only root/login/api/favicon entries | Local build artifacts are stale and not trustworthy | Rebuild once runtime is available |

## 25. Current UI Screenshots

`Not captured`.

Reason:
- No executable `node`, `npm`, `bun`, or browser binary was available in the accessible environment during this investigation.

Placeholder path:
- `docs/current-ui/README.md`

## 26. Figma Reference Screenshots

Copied references:
- `docs/figma-reference/Auth login.png`
- `docs/figma-reference/Auth register.png`
- `docs/figma-reference/Auth twofa login.png`
- `docs/figma-reference/Auth twofa register.png`
- `docs/figma-reference/User dashboard.png`
- `docs/figma-reference/User report url.png`
- `docs/figma-reference/User Url flag management.png`
- `docs/figma-reference/User access api.png`
- `docs/figma-reference/User access code.png`
- `docs/figma-reference/User profile info.png`
- `docs/figma-reference/System management  - user management.png`
- `docs/figma-reference/System management  - Url flag management.png`
- `docs/figma-reference/System management  - api access management.png`
- `docs/figma-reference/Web - Predicted result (danger).png`
- `docs/figma-reference/Web - Predicted result (safe).jpg`
- `docs/figma-reference/design-tokens.tokens.json`

Figma link:
- Root: `https://www.figma.com/design/ni8hvhT4NI2pTRb5t3wV4c/SEMD?node-id=0-1&p=f`

Node IDs:
- Root node: `0:1` from supplied URL.
- Per-frame node IDs: `Not found` from available local exports.

## 27. Build and Validation Results

| Command | Purpose | Result | Important Output |
| ------- | ------- | ------ | ---------------- |
| `bash -lc 'node -v && npm -v && command -v google-chrome || command -v chromium || command -v chromium-browser || command -v firefox'` | Check runtime/browser availability | Failed | `node: command not found` |
| `bash -lc 'command -v bun && bun --version && command -v google-chrome || command -v chromium || command -v chromium-browser || command -v firefox || true'` | Check Bun/browser availability | Inconclusive | No accessible executable path returned |
| `npm run dev` | Start dev server | Not run | blocked by missing runtime |
| `npm run build` | Production build | Not run | blocked by missing runtime |
| `npm run lint` | Lint | Not run | blocked by missing runtime |
| `tsc --noEmit` | Type check | Not run | blocked by missing runtime |
| Unit/integration/E2E tests | Validation | Not found / not run | no test scripts or config found |
| Storybook | UI sandbox | Not found | no Storybook config found |

Missing environments/services:
- Node/Bun runtime
- Browser executable
- Backend API
- Valid env vars for OAuth/reCAPTCHA/API

## 28. Refactoring Boundaries

### Must Preserve

- Existing API contracts generated from `../semd-backend/openapi.yaml`
- Existing route URLs unless clearly broken and agreed
- Current theme identity and token palette
- Current role concepts: user, admin, master admin
- URL-evaluation domain model and result-state semantics
- Thai-first text rendering support

### Safe to Improve

- Shared component boundaries
- Page composition and information hierarchy
- Loading, empty, and error presentation
- Responsive shell behavior
- Accessibility
- Table usability
- Motion and micro-interactions
- Hard-coded style alias cleanup

### Requires Clarification

- Whether the mascot is part of the intended final brand
- Whether landing should remain publicly interactive or route directly to authenticated scan only
- Whether access-code and master-admin AI screens are still in scope
- Whether NextAuth and custom token auth should coexist
- Final backend response shape for prediction status granularity beyond safe/danger

## 29. Recommended Future Implementation Sequence

1. Stabilize auth/session source of truth and route protection.
2. Replace synthesized scan/result data with real generated API payloads.
3. Normalize token aliases and shared UI primitive styling.
4. Refactor the dashboard shell for responsive sidebar/header behavior.
5. Improve login/register/2FA flows while preserving the current visual direction.
6. Rebuild dashboard KPIs/charts to match the exported design references.
7. Refactor reports, flags, and API access around real data tables and actions.
8. Improve admin management screens and clarify missing master-admin scope.
9. Add consistent loading, empty, success, and error states.
10. Apply accessibility fixes.
11. Add subtle reduced-motion-aware animation.
12. Add runtime validation, screenshot capture, and visual regression once tooling is available.

## 30. Open Questions

- Should the frontend standardize on NextAuth session, custom token auth, or a coordinated hybrid?
- What is the intended production route for authenticated scanning: `/scan` or `/dashboard/scan`?
- What exact prediction states does the backend expose: safe, suspicious, malicious, unknown, failed, pending?
- Are access-code and master-admin AI management screens still part of the roadmap?
- Are local `design/` exports the latest approved Figma references, or has the Figma file changed since those exports were produced?
