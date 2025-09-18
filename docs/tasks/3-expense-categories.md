# Task: Expense Categories

- **Status**: To Do
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task is to implement the management of expense categories. Administrators should be able to create, edit, and delete categories for their organization. These categories will be used to classify expenses.

## Acceptance Criteria

- [ ] An admin can create a new expense category with a name and optional description.
- [ ] An admin can edit the name and description of an existing category.
- [ ] An admin can delete a category.
- [ ] Expense categories are scoped to an organization.

## TODOs

- [ ] Create a `Category` model in `prisma/schema.prisma` with fields for `name`, `description`, and `organizationId`.
- [ ] Generate a database migration for the new model.
- [ ] Create a tRPC router `category.ts` with procedures for `create`, `update`, `delete`, and `list`.
- [ ] The procedures must enforce that only admins can manage categories.
- [ ] Create a UI for admins to manage expense categories.
- [ ] Write unit tests for the `category` tRPC router.
