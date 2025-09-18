# Task: Review Workflow

- **Status**: To Do
- **Priority**: P1
- **Author**: Gemini
- **Last Updated**: September 2025
- **Relevant PRDs**: [prd-main.md](../product/prd-main.md)

## Description

This task focuses on building the interface and logic for reviewers to approve or reject expenses that require manual review.

## Acceptance Criteria

- [ ] A reviewer can see a list of expenses assigned to them for review.
- [ ] A reviewer can approve or reject an expense.
- [ ] A reviewer can add a comment when approving or rejecting an expense.
- [ ] The status of the expense is updated accordingly (`APPROVED` or `REJECTED`).
- [ ] The user who submitted the expense is notified of the outcome.

## TODOs

- [ ] Create a tRPC router `review.ts` with procedures for:
    - `list` (to get expenses pending review)
    - `approve`
    - `reject`
- [ ] The procedures must enforce that only authorized reviewers can take action.
- [ ] Implement logic to assign expenses to the correct reviewer(s).
- [ ] Create a UI for reviewers to see and manage their queue of expenses.
- [ ] Create a UI for employees to see the status and any review comments on their expenses.
- [ ] Write unit tests for the review workflow.
