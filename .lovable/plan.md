# Automation-first recovery experience

## Goal
Make recovery customer-led only at the decision point while preserving the current OrderPulse design, demo event system, order tracking, persistence, and notification history.

## Changes
- Add automatic demo monitoring for active orders so a stage-appropriate simulated risk is evaluated without customer input; keep event deduplication and active-order guards.
- Replace the prominent seven-step workflow with one concise risk alert, a short “What happened” explanation, a clearly labeled demo recommendation, and only policy-eligible choices.
- Hide cancellation when the demo refund/cancellation policy does not allow it, hide replacement without confirmed demo availability, and hide support after a handoff already exists.
- Keep confirmations, saved outcomes, continued monitoring, refresh persistence, and notification deduplication unchanged.
- Move the internal Monitor → Detect → Warn → Explain → Options → Choose → Track sequence, event history, and simulator controls into a secondary expandable “How OrderPulse handled this” area.
- Keep every existing demo safety statement and the principle “AI recommends. Policy controls. Customer decides.”

## Technical details
- Extend the browser-local store with a timed monitor that routes automatic simulated events through the existing centralized event handler.
- Keep recovery eligibility and recommendation derivation centralized around the existing scenario and policy functions.
- Update only recovery presentation and the minimum supporting state/policy logic; do not alter restaurant data, navigation, tracking stages, or storage format.

## Verification
- Exercise automatic risk creation and one notification on an active order.
- Verify concise alert, explanation, recommendation, and scenario-specific eligible actions.
- Verify waiting, eligible cancellation, replacement, and support confirmations persist after refresh.
- Verify unavailable replacement and policy-ineligible cancellation are not shown.
- Verify repeated monitoring does not duplicate alerts or notifications, and delivered/cancelled orders receive no recovery action.
- Check desktop and mobile layouts, runtime console, and the latest build status.
