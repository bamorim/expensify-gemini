# Task Template

## Meta Information

- **Task ID**: `TASK-009`
- **Title**: UI Foundational Setup: Shells and Core Pages
- **Status**: `Not Started`
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

- [ ] **Shell-less Screens**:
    - [ ] Implement a simple Landing Page (`/`) that describes the app and provides a "Login" or "Go To App" button based on authentication status.
- [ ] **Authenticated Screens (Non-Org-Scoped)**:
    - [ ] Implement a "User without Org" page (`/no-org`) that users are redirected to after login if they don't belong to any organization.
    - [ ] This page should display an option to create a new organization and a message about joining via invitation.
    - [ ] This shell should include a user menu with the current authenticated user's information and a log-out button.
- [ ] **Org-Scoped Screens**:
    - [ ] All org-scoped screens must be prefixed with `/orgs/{id}/...` in the URL.
    - [ ] Implement an "Org Dashboard" page (`/orgs/{id}/dashboard`) displaying organization details and a list of members.
    - [ ] Implement an "Invitations" page (`/orgs/{id}/invitations`) for admins to view and send invitations.
    - [ ] The org shell must include an organization switcher component.
    - [ ] The organization switcher must include a link to create a new organization.
    - [ ] The org shell must include a user menu with the current authenticated user's information and a log-out button.
    - [ ] The org shell must include a sidebar for navigation between "Dashboard" and "Invitations".
    - [ ] The "Invitations" menu item in the sidebar must only be visible to organization administrators.

## TODOs

- [ ] Create Landing Page component and route.
- [ ] Create "User without Org" page component and route.
- [ ] Develop authenticated non-org-scoped shell component.
- [ ] Create "Org Dashboard" page component and route.
- [ ] Create "Invitations" page component and route.
- [ ] Develop org-scoped shell component.
- [ ] Implement organization switcher component.
- [ ] Implement user menu component.
- [ ] Implement sidebar navigation with admin-specific visibility for "Invitations".
- [ ] Integrate shells with respective pages.

## Progress Updates

### 2025-09-18 - Gemini
**Status**: Not Started
**Progress**: Created task document.
**Blockers**: None
**Next Steps**: Begin implementing the shell-less landing page.

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Code follows project standards
- [ ] Tests written and passing
- [ ] Documentation updated (if needed)
- [ ] Code review completed

## Notes

---

**Template Version**: 1.0
**Last Updated**: 2025-09-18