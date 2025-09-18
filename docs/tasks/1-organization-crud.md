# Task: Basic Organization CRUD for Admins

- **Status**: Done
- **Priority**: P0
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task is to implement the basic CRUD (Create, Read, Update, Delete) functionality for organizations. This is foundational for the rest of the application, as all data will be scoped to an organization.

## Acceptance Criteria

- [x] A user can create a new organization.
- [x] The user who creates an organization becomes its first admin.
- [x] An admin can view and update the organization's details.
- [x] An admin can delete an organization.
- [x] All organization data is properly isolated.

## TODOs

- [x] Remove the unused `Post` model from `prisma/schema.prisma`.
- [x] Add `Organization` and `OrganizationUser` models to `prisma/schema.prisma` to establish a many-to-many relationship between users and organizations.
- [x] The `OrganizationUser` model should include a `role` field to distinguish between 'ADMIN' and 'MEMBER'.
- [x] Generate a database migration for the schema changes.
- [x] Create a tRPC router `organization.ts` with procedures for `create`, `get`, `update`, and `delete`.
- [x] The `create` procedure should also create an `OrganizationUser` entry that assigns the 'ADMIN' role to the user who created the organization.
- [x] Create a basic UI page for a user to create and manage their organization.
- [x] Write unit tests for the `organization` tRPC router.
