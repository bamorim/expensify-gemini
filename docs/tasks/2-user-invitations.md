# Task: User Invitations

- **Status**: Done
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task involves implementing the functionality for administrators to invite new users to their organization. Invited users will receive an email and can then join the organization.

## Acceptance Criteria

- [x] An admin can invite a new user by providing their email address.
- [x] An invitation record is created in the database.
- [x] The invited user receives an email with a link to join the organization.
- [x] When the user clicks the link and signs up/logs in, they are added to the organization as a 'MEMBER'.
- [x] Users can see a list of pending invitations for their organization.

## TODOs

- [x] Create an `Invitation` model in `prisma/schema.prisma` to store invitation details (email, organizationId, token).
- [x] Generate a database migration for the new model.
- [x] Create a tRPC router `invitation.ts` with procedures for:
    - `create` (to send an invitation)
    - `accept` (to join the organization)
    - `list` (to see pending invitations)
- [x] Implement the email sending logic for invitations.
- [x] Create a UI for admins to send invitations.
- [x] Create a page for users to accept invitations.
- [x] Write unit tests for the `invitation` tRPC router.
