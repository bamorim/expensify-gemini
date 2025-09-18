# Task: Expense Submission

- **Status**: To Do
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task enables employees to submit their expenses for reimbursement. The system will use the policy engine to validate the expense and determine the appropriate workflow (auto-approval or manual review).

## Acceptance Criteria

- [ ] A user can submit an expense with a date, amount, category, and description.
- [ ] The system identifies and applies the correct policy for the user and category.
- [ ] Expenses that violate a policy (e.g., over the maximum amount) are automatically rejected.
- [ ] Compliant expenses are either auto-approved or sent for manual review, based on the policy.
- [ ] The user can see the status of their submitted expenses.

## TODOs

- [ ] Create an `Expense` model in `prisma/schema.prisma`.
- [ ] The model should include fields for `amount`, `date`, `description`, `status`, `userId`, `categoryId`, and `organizationId`.
- [ ] Generate a database migration for the new model.
- [ ] Implement the Policy Resolution Engine logic to find the applicable policy for an expense.
- [ ] Create a tRPC router `expense.ts` with a `submit` procedure.
- [ ] The `submit` procedure will contain the logic for validating the expense against the policy.
- [ ] Create a UI for users to submit expenses and view their expense history.
- [ ] Write unit tests for the expense submission logic.
