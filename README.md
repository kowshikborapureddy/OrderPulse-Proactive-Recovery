# OrderPulse — Proactive Recovery for Food Delivery

> **When delivery fails, recover the meal — not just the money.**

OrderPulse is a **working browser-based product prototype** exploring proactive recovery in food delivery. It monitors a demo order flow, detects meaningful delivery risk, explains what happened, evaluates policy-eligible recovery options, and lets the customer make the final decision.

**Core principle:** **AI recommends. Policy controls. Customer decides.**

## Product Problem

Customers can discover delivery problems only after an order is already significantly delayed. OrderPulse explores a more proactive experience:

**Detect risk earlier → communicate clearly → offer meaningful recovery → let the customer decide.**

## Core Experience

```text
Customer places order
        ↓
OrderPulse monitors demo delivery events
        ↓
Delivery risk is detected
        ↓
Policy eligibility is checked
        ↓
Relevant recovery options are evaluated
        ↓
Customer receives a proactive alert
        ↓
OrderPulse recommends an option
        ↓
Customer decides
        ↓
Decision is saved
        ↓
Order continues to be tracked
```

## What the Current Prototype Includes

### Food delivery

- Restaurant discovery and food categories
- Search, filters and sorting
- Restaurant menus
- Cart and quantity management
- Demo checkout
- Generated demo order IDs
- Order tracking: **Confirmed → Preparing → Picked Up → On the Way → Delivered**

### Proactive recovery

- Simulated delivery-risk events
- Early risk alerts
- Delivery-event explanation
- ETA handling without inventing unavailable values
- Policy-controlled recovery choices
- Continue waiting
- Cancellation request with demo policy checks
- Replacement request with demo availability rules
- Demo support handoff
- Recovery decision persistence
- Notification history and deduplication
- Delivered-order safeguards

## Product Decision Model

OrderPulse deliberately separates responsibilities:

| Layer | Responsibility |
|---|---|
| AI-assisted layer | Explain events and recommend among allowed options |
| Policy layer | Decide which recovery actions are eligible |
| Customer | Make the final recovery decision |
| Application logic | Control order state, prices and demo actions |

This prevents the AI layer from silently making financial or order-state decisions.

## AI Approach

A future production implementation could use AI to:

- summarize delivery events
- explain a delivery risk in plain language
- recommend a policy-approved recovery option
- personalize the explanation based on order context

The current prototype **does not claim a live AI model is connected**. It uses predefined demo scenarios and clearly labels simulated behavior.

The same principle applies to restaurant/courier data, payments, refunds and support: these are demo flows, not live integrations.

## Automation-first Product Direction

The detailed internal workflow is:

**Monitor → Detect → Warn → Explain → Options → Choose → Track**

The intended customer experience is simpler:

**Proactive alert → concise explanation → recommendation → relevant choices → customer decision → confirmation**

The customer should not have to manually operate the internal monitoring workflow.

## Product & Technical Architecture

```text
UI / Routes
    ↓
Order & Recovery Store
    ↓
Delivery Event Handler
    ↓
Recovery Policy Logic
    ↓
Customer Decision
    ↓
Persisted Demo State
    ↓
Notification History
```

Recovery eligibility is centralized in application logic rather than being inferred from explanation text.

## Tech Stack

- React
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS
- Lucide React
- Browser local storage for demo persistence

## Validation & Demo Tests

The current implementation has been tested around:

- Small delay → no unnecessary alert
- Significant risk → proactive alert
- Continue waiting → saved decision
- Eligible cancellation → request state saved
- Ineligible cancellation → blocked with explanation
- Replacement available → request can be submitted
- Replacement unavailable → not offered
- Support → demo handoff created
- Refresh → state persists
- Duplicate events → duplicate notification prevented
- Delivered order → recovery actions restricted

## Current Limitations

This is a **working prototype/demo**, not a production food-delivery integration.

Production would require:

- Live restaurant/order/courier event ingestion
- Server-side order and event storage
- Background processing
- Real push notifications
- Production authentication and authorization
- Real payment/refund processing
- Real customer-support integration
- Stronger privacy, security and observability controls
- Evaluation infrastructure for any production AI recommendations

## Run Locally

### Prerequisites

- Node.js
- npm

### Setup

```bash
git clone https://github.com/kowshikborapureddy/OrderPulse-Proactive-Recovery.git
cd OrderPulse-Proactive-Recovery
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Project Artifacts

- **[Product Case Study PDF](./OrderPulse%20Product%20Case%20Study%20PDF.pdf)**
- **[PRD](./OrderPulse_PRD.docx)**
- **[Figma Product Design](https://www.figma.com/community/file/1684126733595502890/orderpulse-proactive-recovery-for-late-night-food-delivery)**
- **[Medium Case Study](https://medium.com/@kowshikborapureddy/orderpulse-proactive-recovery-for-late-night-food-delivery-4954bb6d41be)**

## Roadmap

### Next

- Live order-event ingestion
- Backend event history
- Production push notifications
- Production authentication
- Support workflow integration

### Future

- Model-backed recovery explanations
- AI evaluation framework
- Richer policy engine
- Recovery analytics
- Experimentation framework for customer outcomes

## Why I Built OrderPulse

The product exploration started with one question:

> **What if a food-delivery platform spoke up before the customer had to complain?**

The project combines **product discovery, customer-journey thinking, requirements, prototyping, implementation, recovery logic, testing and iteration**.

## AI-Assisted Development

OrderPulse was developed using **AI-assisted coding/prototyping workflows**. Product requirements, interaction decisions, policy logic and testing were reviewed during implementation.

AI is treated as a development accelerator — not as a replacement for product judgment.

## Project Status

**Status:** Working product prototype / demo  
**Focus:** AI-assisted proactive recovery  
**Product:** Consumer food-delivery recovery experience

## Author

**Kowshik Borapureddy**

Product Management • AI Product • Product Engineering

- GitHub: https://github.com/kowshikborapureddy
- Portfolio: https://kowshik-portfolio-gamma.vercel.app/

---

> OrderPulse is an independent product project and is not affiliated with or operated by any food-delivery company referenced for UX inspiration.
