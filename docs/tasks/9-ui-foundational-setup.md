# Task Template

## Meta Information

- **Task ID**: `TASK-009`
- **Title**: UI Foundational Setup: Shells and Core Pages
- **Status**: `Complete`
- **Priority**: `P0`
- **Created**: 2025-09-18
- **Updated**: 2025-09-18
- **Estimated Effort**: TBD
- **Actual Effort**: TBD

## Related Documents

- **PRD**: `docs/product/prd-main.md`
- **ADR**: N/A
- **Dependencies**: Existing authentication setup, Organization CRUD (TASK-001)

## Description

This task involves setting up the foundational UI structure for the application, defining three main types of screen shells: shell-less, authenticated non-org-scoped, and org-scoped. This setup is crucial for providing a consistent user experience and enabling future feature development.

## Acceptance Criteria

- [x] **Shell-less Screens**:
    - [x] Implement a simple Landing Page (`/`) that describes the app and provides a "Login" or "Go To App" button based on authentication status.
- [x] **Authenticated Screens (Non-Org-Scoped)**:
    - [x] Implement a "User without Org" page (`/welcome`) that users are redirected to after login when they don't have any organizations, or redirected to their first organization's dashboard if they do.
    - [x] This page should display an option to create a new organization and a message about joining via invitation.
    - [x] This shell should include a user menu with the current authenticated user's information and a log-out button.
- [x] **Org-Scoped Screens**:
    - [x] All org-scoped screens must be prefixed with `/orgs/{id}/...` in the URL.
    - [x] Implement an "Org Dashboard" page (`/orgs/{id}/dashboard`) displaying organization details and a list of members.
    - [x] Implement an "Invitations" page (`/orgs/{id}/invitations`) for admins to view and send invitations.
    - [x] The org shell must include an organization switcher component.
    - [x] The organization switcher must include a link to create a new organization.
    - [x] The org shell must include a user menu with the current authenticated user's information and a log-out button.
    - [x] The org shell must include a sidebar for navigation between "Dashboard" and "Invitations".
    - [x] The "Invitations" menu item in the sidebar must only be visible to organization administrators.

## TODOs

- [x] Create Landing Page component and route.
- [x] Create "User without Org" page component and route.
- [x] Develop authenticated non-org-scoped shell component.
- [x] Create "Org Dashboard" page component and route.
- [x] Create "Invitations" page component and route.
- [x] Develop org-scoped shell component.
- [x] Implement organization switcher component.
- [x] Implement user menu component.
- [x] Implement sidebar navigation with admin-specific visibility for "Invitations".
- [x] Integrate shells with respective pages.
- [x] Implement organization creation form at `/orgs/new`.

## Progress Updates

### 2025-09-18 - Gemini
**Status**: Complete
**Progress**: Created task document. Implemented the shell-less landing page, the "User without Org" page (now at `/welcome`), the authenticated non-org-scoped shell, the "Org Dashboard" page, the "Invitations" page, the org-scoped shell, the organization switcher component, the user menu component, the sidebar navigation with admin-specific visibility for "Invitations", and integrated all shells with their respective pages. Implemented server-side redirection for the welcome page. Ported functionality from `src/app/organizations/page.tsx` to the org-scoped pages. Implemented organization creation form at `/orgs/new` and updated relevant links. Added invalidation of organization list after successful organization creation. Adjusted redirects and links for landing page, post-login, and post-org-deletion. Fixed linting warnings.
**Blockers**: None
**Next Steps**: None

## Completion Checklist

- [x] All acceptance criteria met
- [x] Code follows project standards
- [x] Tests written and passing
- [x] Documentation updated (if needed)
- [x] Code review completed

## Notes

---

**Template Version**: 1.0
**Last Updated**: 2025-09-18