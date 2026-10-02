# OrderPulse — Proactive Recovery for Food Delivery

<p align="center">
  <strong>When delivery fails, recover the meal — not just the money.</strong>
</p>

<p align="center">
  A working browser-based product prototype exploring proactive recovery in food delivery.
</p>

<p align="center">
  <a href="https://order-pulse-proactive-recovery.vercel.app">Live Demo</a> •
  <a href="https://www.figma.com/community/file/1684126733595502890/orderpulse-proactive-recovery-for-late-night-food-delivery">Figma</a> •
  <a href="https://medium.com/@kowshikborapureddy/orderpulse-proactive-recovery-for-late-night-food-delivery-4954bb6d41be">Case Study</a>
</p>

---

## Product Overview

OrderPulse is a product concept and working prototype for a **proactive recovery layer in food delivery**.

Instead of waiting for a customer to complain after an order becomes seriously late, OrderPulse explores how a delivery platform can:

**detect risk → explain the issue → evaluate recovery options → recommend an action → let the customer decide.**

### Core principle

> **AI recommends. Policy controls. Customer decides.**

---

## The Problem

Delivery failures create uncertainty for customers.

Typical experience:

> Order is delayed → customer waits → customer complains → support investigates → recovery happens late.

OrderPulse explores a proactive model:

> **Delivery risk detected → customer informed early → meaningful options presented → customer stays in control.**

---

## Product Flow

```text
Customer places order
        ↓
Monitor delivery events
        ↓
Detect meaningful risk
        ↓
Check policy eligibility
        ↓
Evaluate available recovery options
        ↓
Notify customer
        ↓
AI-assisted recommendation
        ↓
Customer chooses
        ↓
Save decision
        ↓
Continue tracking
```

Monitoring, risk detection and policy evaluation are designed as background product logic rather than tasks the customer has to manually operate.

---

## What the Prototype Includes

### Food delivery experience

- Restaurant discovery
- Food categories
- Search
- Filters and sorting
- Restaurant menus
- Cart and quantity management
- Demo checkout
- Generated order IDs
- Order tracking

### Proactive recovery

- Simulated delivery-risk events
- Early delivery warnings
- Delivery-event explanations
- Revised ETA handling without guessing unavailable values
- Policy-controlled recovery options
- Continue waiting
- Cancellation request
- Replacement request
- Demo support handoff
- Recovery decision persistence
- Notification history
- Notification deduplication
- Delivered-order safeguards

---

## Recovery Decision Model

| Layer | Responsibility |
|---|---|
| AI-assisted layer | Explain the situation and recommend among allowed options |
| Policy layer | Determine which actions are eligible |
| Customer | Make the final recovery decision |
| Application logic | Control order state, pricing and demo actions |

This separation prevents the AI layer from independently changing financial or order-state decisions.

---

## Customer Experience

The internal decision workflow is:

**Monitor → Detect → Warn → Explain → Options → Choose → Track**

The intended customer experience is:

**Proactive alert → Explanation → Recommendation → Relevant choices → Customer decision → Confirmation**

The customer should not have to manage the internal monitoring workflow.

### Example

**Your order may be delayed**

The restaurant is experiencing a preparation delay and your order has not yet been picked up.

**OrderPulse recommends:** Keep waiting

We'll continue monitoring and update you when new information becomes available.

**Available options**

- Keep waiting
- Request cancellation
- Choose a replacement

Only policy-eligible options should be shown.

---

## AI Product Approach

OrderPulse treats AI as an **assistive layer**.

### Potential AI responsibilities

- Summarize delivery events
- Explain delivery risk in simple language
- Recommend among policy-approved recovery options
- Personalize recovery explanations

### Non-AI product controls

- Order state
- Prices
- Cancellation eligibility
- Replacement availability
- Refund rules
- Financial actions
- Final customer decision

### Current AI status

The current prototype uses **predefined demo scenarios**.

It does **not** claim live:

- AI model inference
- Restaurant feeds
- Courier telemetry
- Payment processing
- Refund processing
- Support-agent integration

---

## Demo Scenarios

| Scenario | Prototype behavior |
|---|---|
| Small delay | No unnecessary alert |
| Kitchen backlog | Proactive recovery warning |
| Eligible cancellation | Cancellation request can be submitted |
| Ineligible cancellation | Request is blocked with explanation |
| Replacement available | Replacement can be requested |
| Replacement unavailable | Replacement is not offered |
| Support request | Demo handoff created |
| Duplicate event | Duplicate notification prevented |
| Browser refresh | Demo state persists |
| Delivered order | Recovery actions are restricted |

---

## Technical Architecture

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

The current prototype uses browser persistence for the demo experience.

---

## Tech Stack

- React
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS
- Lucide React
- Browser local storage

---

## Product Thinking

The project combines:

- Problem framing
- Customer journey analysis
- Product requirements
- UX flow design
- Prototyping
- AI product thinking
- Policy-based product logic
- Frontend implementation
- Testing
- Iteration

### Product principle

> **Don't wait for the customer to complain. Detect the problem, explain it clearly, and give the customer meaningful control.**

---

## Success Metrics

Potential production metrics include:

### Customer

- Delivery complaint rate
- Recovery choice rate
- Decision completion rate
- Recovery satisfaction
- Support contact rate

### Product

- Recovery alert open rate
- Recovery option selection rate
- Notification engagement
- Repeat usage

### Operational

- Risk-to-notification time
- Notification-to-decision time
- Recovery completion rate
- Cancellation request rate
- Replacement request rate

### AI

- Explanation accuracy
- Recommendation acceptance rate
- Recommendation correction rate
- AI error/hallucination rate
- Response latency

---

## Roadmap

### Phase 1 — Prototype

- Food discovery
- Restaurant browsing
- Cart and demo checkout
- Order tracking
- Simulated delivery events
- Proactive recovery
- Policy-controlled recovery
- Notifications

### Phase 2 — Production Foundation

- Live order event ingestion
- Backend event storage
- Production authentication
- Background processing
- Real push notifications
- Support integration

### Phase 3 — AI Layer

- Model-backed explanations
- Recommendation engine
- AI evaluation framework
- Confidence handling
- Quality monitoring
- Human-review workflows

### Phase 4 — Recovery Intelligence

- Recovery analytics
- Experiment framework
- Predictive delivery-risk models
- Personalized recovery strategies
- Customer outcome optimization

---

## Current Limitations

This repository contains a **working prototype/demo**, not a production food-delivery integration.

A production implementation would require:

- Live restaurant/order/courier event sources
- Server-side order and event storage
- Background workers
- Production push infrastructure
- Authentication and authorization
- Payment/refund integrations
- Customer-support systems
- Privacy and security controls
- Observability and monitoring
- AI evaluation infrastructure

---

## Product Artifacts

### Case Study

[Open the Product Case Study PDF](./OrderPulse%20Product%20Case%20Study%20PDF.pdf)

### PRD

[Open the Product Requirements Document](./OrderPulse_PRD.docx)

### Figma

[Open OrderPulse in Figma](https://www.figma.com/community/file/1684126733595502890/orderpulse-proactive-recovery-for-late-night-food-delivery)

### Medium

[Read the OrderPulse case study](https://medium.com/@kowshikborapureddy/orderpulse-proactive-recovery-for-late-night-food-delivery-4954bb6d41be)

### Live Demo

[Open OrderPulse](https://order-pulse-proactive-recovery.vercel.app)

---

## Run Locally

### Prerequisites

- Node.js
- npm

### Install

```bash
git clone https://github.com/kowshikborapureddy/OrderPulse-Proactive-Recovery.git
cd OrderPulse-Proactive-Recovery
npm install
```

### Start development server

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## Project Structure

```text
OrderPulse-Proactive-Recovery/
├── public/
├── src/
│   ├── components/
│   ├── lib/
│   ├── routes/
│   └── ...
├── figma/
├── OrderPulse Product Case Study PDF.pdf
├── OrderPulse_PRD.docx
├── README.md
├── roadmap.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Project Status

**Status:** Working product prototype / demo

**Domain:** Consumer technology • Food delivery

**Focus:** Proactive recovery • AI-assisted product experience

---

## Built With AI-Assisted Development

OrderPulse was developed using AI-assisted coding and prototyping workflows.

AI was used to accelerate implementation, while:

- product requirements
- UX decisions
- recovery policies
- interaction logic
- testing
- product trade-offs

remained explicitly defined and reviewed.

---

## About the Project

OrderPulse is an independent product project focused on the intersection of:

**Product Management + AI Product Thinking + Product Engineering**

It explores how a delivery product can move from a reactive support model toward a more proactive recovery experience.

---

## Author

**Kowshik Borapureddy**

Product Management • AI Product • Product Engineering

- [GitHub](https://github.com/kowshikborapureddy)
- [Portfolio](https://kowshik-portfolio-gamma.vercel.app/)

---

> OrderPulse is an independent product project and is not affiliated with or operated by any food-delivery company referenced for UX inspiration.
