# Task: User Invitations

- **Status**: To Do
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task involves implementing the functionality for administrators to invite new users to their organization. Invited users will receive an email and can then join the organization.

## Acceptance Criteria

- [ ] An admin can invite a new user by providing their email address.
- [ ] An invitation record is created in the database.
- [ ] The invited user receives an email with a link to join the organization.
- [ ] When the user clicks the link and signs up/logs in, they are added to the organization as a 'MEMBER'.
- [ ] Users can see a list of pending invitations for their organization.

## TODOs

- [ ] Create an `Invitation` model in `prisma/schema.prisma` to store invitation details (email, organizationId, token).
- [ ] Generate a database migration for the new model.
- [ ] Create a tRPC router `invitation.ts` with procedures for:
    - `create` (to send an invitation)
    - `accept` (to join the organization)
    - `list` (to see pending invitations)
- [ ] Implement the email sending logic for invitations.
- [ ] Create a UI for admins to send invitations.
- [ ] Create a page for users to accept invitations.
