# Task: Expense Categories

- **Status**: Done
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task is to implement the management of expense categories. Administrators should be able to create, edit, and delete categories for their organization. These categories will be used to classify expenses.

## Acceptance Criteria

- [x] An admin can create a new expense category with a name and optional description.
- [x] An admin can edit the name and description of an existing category.
- [x] An admin can delete a category.
- [x] Expense categories are scoped to an organization.

## TODOs

- [x] Create a `Category` model in `prisma/schema.prisma` with fields for `name`, `description`, and `organizationId`.
- [x] Generate a database migration for the new model.
- [x] Create a tRPC router `category.ts` with procedures for `create`, `update`, `delete`, and `list`.
- [x] The procedures must enforce that only admins can manage categories.
- [x] Create a UI for admins to manage expense categories.
- [x] Write unit tests for the `category` tRPC router.