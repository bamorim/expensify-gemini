# Task: Policy Management

- **Status**: To Do
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task involves implementing the functionality for administrators to define expense policies. Policies control spending and determine whether an expense requires manual review or can be auto-approved.

## Acceptance Criteria

- [ ] An admin can create a policy for a specific expense category.
- [ ] A policy defines a maximum amount for an expense.
- [ ] A policy specifies whether expenses under the limit should be auto-approved or require manual review.
- [ ] Policies can be applied to the entire organization or to specific users.

## TODOs

- [ ] Create a `Policy` model in `prisma/schema.prisma`.
- [ ] The model should include fields for `categoryId`, `amount`, `period`, `reviewRule` (auto-approve/manual), and optionally `userId`.
- [ ] Generate a database migration for the new model.
- [ ] Create a tRPC router `policy.ts` with procedures for `create`, `update`, `delete`, and `list`.
- [ ] The procedures must enforce that only admins can manage policies.
- [ ] Create a UI for admins to manage policies.
- [ ] Write unit tests for the `policy` tRPC router.
