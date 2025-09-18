# Task: Basic Organization CRUD for Admins

- **Status**: To Do
- **Priority**: P0
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task is to implement the basic CRUD (Create, Read, Update, Delete) functionality for organizations. This is foundational for the rest of the application, as all data will be scoped to an organization.

## Acceptance Criteria

- [ ] A user can create a new organization.
- [ ] The user who creates an organization becomes its first admin.
- [ ] An admin can view and update the organization's details.
- [ ] An admin can delete an organization.
- [ ] All organization data is properly isolated.

## TODOs

- [ ] Remove the unused `Post` model from `prisma/schema.prisma`.
- [ ] Add `Organization` and `OrganizationUser` models to `prisma/schema.prisma` to establish a many-to-many relationship between users and organizations.
- [ ] The `OrganizationUser` model should include a `role` field to distinguish between 'ADMIN' and 'MEMBER'.
- [ ] Generate a database migration for the schema changes.
- [ ] Create a tRPC router `organization.ts` with procedures for `create`, `get`, `update`, and `delete`.
- [ ] The `create` procedure should also create an `OrganizationUser` entry that assigns the 'ADMIN' role to the user who created the organization.
- [ ] Create a basic UI page for a user to create and manage their organization.
- [ ] Write unit tests for the `organization` tRPC router.
