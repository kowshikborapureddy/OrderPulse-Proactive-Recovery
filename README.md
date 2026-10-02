# OrderPulse — Proactive Recovery for Food Delivery

> **When delivery fails, recover the meal — not just the money.**

OrderPulse is a **working browser-based product prototype** exploring proactive recovery in food delivery. It monitors a demo order flow, detects meaningful delivery risk, explains what happened, evaluates policy-eligible recovery options, and lets the customer make the final decision.

**Core principle:** **AI recommends. Policy controls. Customer decides.**

---

## Product Problem

Customers can discover delivery problems only after an order is already significantly delayed. OrderPulse explores a more proactive experience:

**Detect risk earlier → communicate clearly → offer meaningful recovery → let the customer decide.**

---

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

What the Current Prototype Includes
Food delivery
- Restaurant discovery and food categories
- Search, filters and sorting
- Restaurant menus
- Cart and quantity management
- Demo checkout
- Generated demo order IDs
- Order tracking:
  Confirmed → Preparing → Picked Up → On the Way → Delivered
Proactive recovery
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
- Recovery state reflected on the order
- Delivered-order safeguards
Product Decision Model
OrderPulse deliberately separates responsibilities:
Layer	Responsibility
AI-assisted layer	Explain events and recommend among allowed options
Policy layer	Decide which recovery actions are eligible
Customer	Make the final recovery decision
Application logic	Control order state, prices and demo actions


This prevents the AI layer from silently making financial or order-state decisions.
AI Approach
A future production implementation could use AI to:
- Summarize delivery events
- Explain a delivery risk in plain language
- Recommend a policy-approved recovery option
- Personalize the explanation based on order context
The current prototype does not claim a live AI model is connected. It uses predefined demo scenarios and clearly labels simulated behavior.
The same principle applies to restaurant/courier data, payments, refunds and support: these are demo flows, not live integrations.
Automation-First Product Direction
The detailed internal workflow is:
Monitor → Detect → Warn → Explain → Options → Choose → Track
The intended customer experience is simpler:
Proactive alert → concise explanation → recommendation → relevant choices → customer decision → confirmation
The customer should not have to manually operate the internal monitoring workflow.
Example Recovery Scenario
A typical demo scenario:
Order Confirmed
      ↓
Preparing
      ↓
Kitchen backlog detected
      ↓
Delivery risk detected
      ↓
Customer receives proactive warning
      ↓
System checks available recovery options
      ↓
OrderPulse recommends an appropriate option
      ↓
Customer chooses
      ↓
Decision is saved
      ↓
Order continues to be monitored

Example customer message
Your order may be delayed

The restaurant is experiencing a preparation delay.
Your order has not been picked up yet.

OrderPulse recommends:
Keep waiting

We'll continue monitoring and update you when
new delivery information becomes available.

[ Keep waiting ]
[ Request cancellation ]
[ Choose replacement ]

Only options allowed by the configured demo policy should be shown.
Product & Technical Architecture
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

Recovery eligibility is centralized in application logic rather than being inferred from explanation text.
Tech Stack
- React
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS
- Lucide React
- Browser local storage for demo persistence
Product Flow
Home / Discovery
        ↓
Restaurant
        ↓
Menu
        ↓
Cart
        ↓
Demo Checkout
        ↓
Order Confirmation
        ↓
Order Tracking
        ↓
Delivery Risk Detection
        ↓
OrderPulse Recovery
        ↓
Customer Decision
        ↓
Recovery Confirmation
        ↓
Continued Tracking

Recovery Actions
1. Continue Waiting
The customer chooses to continue with the current order.
The system:
- Saves the decision
- Keeps the order active
- Resumes monitoring
- Preserves the decision after refresh
2. Request Cancellation
The system checks the configured demo cancellation policy before allowing the request.
The system:
- Checks eligibility
- Shows the applicable policy
- Requires customer confirmation
- Saves the request state
- Does not claim that a real refund was processed
3. Choose a Replacement
Replacement is only presented when the demo scenario contains replacement availability.
The system:
- Checks demo availability
- Shows the replacement option
- Saves the replacement request
- Displays the pending state where appropriate
- Does not claim real restaurant inventory
4. Contact Support
The customer can request support through a demo handoff flow.
The system:
- Creates a demo support reference
- Saves the support state
- Shows a confirmation
- Does not claim that a real support agent was contacted
AI Safety & Guardrails
OrderPulse treats AI as an assistive layer.
AI can
- Summarize
- Explain
- Recommend
- Interpret unstructured event information
AI cannot independently control
- Order state
- Refund rules
- Prices
- Cancellation eligibility
- Replacement eligibility
- Financial actions
- Customer decisions
Important principle:
AI recommends. Policy controls. Customer decides.

Current AI Status
The current version uses predefined demo scenarios.
The prototype clearly distinguishes simulated behavior from production capabilities.
There is currently no connected:
- Live AI model
- Live courier feed
- Live restaurant feed
- Production payment system
- Production refund system
- Production support system
This is intentional so the product does not overclaim capabilities that are not implemented.
Demo Data
The application uses realistic sample data so the workflow can be tested immediately.
Demo data includes:
- Restaurants
- Menu items
- Food categories
- Customer order details
- Order states
- Delivery events
- Recovery scenarios
- Recovery policies
The current prototype stores demo state in the browser.
Persistence
The current demo uses browser-based persistence.
This allows:
- Orders to remain after refresh
- Recovery decisions to remain saved
- Notification history to remain available
- Demo state to remain available during the session/browser lifecycle
A production implementation would move persistent state to a backend database.
Notifications
OrderPulse includes a browser-based demo notification system for delivery-risk events and recovery decisions.
Current prototype behavior includes:
- Proactive risk notification
- Decision notification
- Notification history
- Read/unread state
- Notification deduplication
- Persistence across refreshes
Production requirement
True background push notifications when the browser/tab is closed would require:
- Push service
- Service worker
- Backend/background processing
- Push credentials
- Production event infrastructure
Validation & Demo Tests
The current implementation has been tested around:
Scenario	Expected behavior
Small delay	No unnecessary alert
Significant delivery risk	Proactive alert
Continue waiting	Decision is saved
Eligible cancellation	Request state is saved
Ineligible cancellation	Request is blocked with explanation
Replacement available	Replacement request can be submitted
Replacement unavailable	Replacement is not offered
Contact support	Demo handoff is created
Browser refresh	Demo state persists
Duplicate event	Duplicate notification is prevented
Delivered order	Recovery actions are restricted


Acceptance Criteria
The prototype should allow a user to:
- Browse restaurants and food categories
- Search for restaurants, dishes and cuisines
- Apply filters and sorting
- Open a restaurant
- View menu items
- Add items to a cart
- Change quantities
- Complete a demo checkout
- Receive a generated order ID
- Track the order
- Trigger a simulated delivery delay
- See delivery risk information
- Understand what happened
- See relevant recovery options
- Make a recovery decision
- See the updated recovery state
- Refresh the browser and retain demo state
- View notification history
Product Design Principles
1. Proactive, not reactive
The customer should hear about a meaningful issue before they have to complain.
2. Simple customer experience
The system should handle internal monitoring automatically.
3. Human decision at the right moment
The customer should remain in control of meaningful recovery decisions.
4. Policy-controlled actions
AI should not bypass business rules.
5. Transparent AI
The product should clearly communicate when behavior is simulated or AI is unavailable.
6. No unnecessary complexity
Internal product logic should not become customer-facing operational burden.
Product Metrics
Potential success metrics for a production implementation include:
Customer experience
- Delivery complaint rate
- Recovery choice rate
- Customer decision completion rate
- Recovery satisfaction
- Support contact rate
Product usage
- Recovery alert open rate
- Recovery option selection rate
- Notification engagement
- Repeat usage
Operational metrics
- Time from risk detection to customer notification
- Time from notification to customer decision
- Recovery completion rate
- Cancellation request rate
- Replacement request rate
AI quality
- Explanation accuracy
- Recommendation acceptance rate
- Recommendation correction rate
- Hallucination/error rate
- AI response latency
Current Limitations
This is a working product prototype/demo, not a production food-delivery integration.
Production would require:
- Live restaurant/order/courier event ingestion
- Server-side order and event storage
- Background processing
- Real push notifications
- Production authentication and authorization
- Real payment/refund processing
- Real customer-support integration
- Stronger privacy and security controls
- Observability and monitoring
- Production-grade error handling
- Evaluation infrastructure for AI recommendations
The current prototype does not claim any of these production integrations are complete.
Future Architecture
A production version could evolve toward:
Restaurant / Courier Events
          ↓
     Event Gateway
          ↓
    Event Processing
          ↓
   Risk Detection Engine
          ↓
      Policy Engine
          ↓
    AI Recommendation
          ↓
   Customer Notification
          ↓
     Customer Choice
          ↓
     Action Executor
          ↓
    Order / Support System

Roadmap
Phase 1 — Prototype
- Food discovery
- Restaurant browsing
- Cart
- Demo checkout
- Order tracking
- Simulated delivery events
- Proactive recovery
- Policy-controlled decisions
- Notification history
Phase 2 — Production Foundation
- Backend order state
- Live event ingestion
- Server-side event history
- Production authentication
- Background processing
- Push notifications
- Support integration
Phase 3 — AI Layer
- Model-backed explanations
- AI recommendation engine
- Recommendation evaluation
- Confidence handling
- AI quality monitoring
- Human-review workflows
Phase 4 — Recovery Intelligence
- Recovery analytics
- Experimentation framework
- Customer outcome optimization
- Personalized recovery strategies
- Predictive delivery-risk models
Product Research & Case Study
The project started from the product question:
What if a food-delivery platform spoke up before the customer had to complain?

The product exploration covered:
Problem Definition
      ↓
Customer Journey
      ↓
Opportunity Identification
      ↓
Product Concept
      ↓
PRD
      ↓
Wireframes
      ↓
Prototype
      ↓
Implementation
      ↓
Testing
      ↓
Iteration

Product Artifacts
Product Case Study
[Open OrderPulse Product Case Study PDF](./OrderPulse Product Case Study PDF.pdf)
Product Requirements Document
[Open OrderPulse PRD](./OrderPulse_PRD.docx)
Product Design
Figma — OrderPulse Product Design
Product Write-up
Read the Medium Case Study
Running the Project Locally
Prerequisites
- Node.js
- npm
Clone the repository
git clone https://github.com/kowshikborapureddy/OrderPulse-Proactive-Recovery.git
cd OrderPulse-Proactive-Recovery

Install dependencies
npm install

Run development server
npm run dev

The terminal will display the local development URL.
Production build
npm run build

Project Structure
OrderPulse-Proactive-Recovery/
│
├── public/
│
├── src/
│   ├── components/
│   ├── lib/
│   ├── routes/
│   └── ...
│
├── figma/
│
├── OrderPulse Product Case Study PDF.pdf
├── OrderPulse_PRD.docx
├── README.md
├── roadmap.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...

Development Approach
OrderPulse was developed using an AI-assisted product-building workflow.
The development process combined:
- Product problem framing
- User journey design
- Product requirements
- Wireframing
- AI-assisted coding
- Iterative prototyping
- Recovery policy logic
- Manual testing
- Product refinement
AI was used as a development accelerator while product decisions and business rules remained explicitly defined.
Why This Project Matters
OrderPulse is an exploration of how product management and AI-assisted development can work together.
It demonstrates:
- Product problem definition
- Customer-centric thinking
- Product strategy
- UX flow design
- PRD writing
- AI product thinking
- Policy-based product logic
- Frontend development
- Prototype implementation
- Testing
- Iteration
The central idea is simple:
Don't wait for the customer to complain. Detect the problem, explain it clearly, and give the customer meaningful control.

Project Status
Status: Working product prototype / demo
Product focus: Proactive recovery for food delivery
Domain: Consumer technology / Food delivery
Primary focus: AI-assisted product experience
Author
Kowshik Borapureddy
Product Management • AI Product • Product Engineering
- GitHub: https://github.com/kowshikborapureddy
- Portfolio: https://kowshik-portfolio-gamma.vercel.app/
Disclaimer
OrderPulse is an independent product project and is not affiliated with or operated by any food-delivery company referenced for UX inspiration.

### One thing I recommend before Vercel

Your current README is now much more suitable for a **Product Management + AI Product + builder portfolio**.

Also, I've deliberately kept claims such as **“working product prototype/demo”** rather than calling it a production platform or claiming live AI/courier/payment integrations.

For the Vercel screen you showed earlier, your current configuration is already appropriate:

**Repository:** `OrderPulse-Proactive-Recovery`  
**Root Directory:** `./`  
**Application Preset:** `TanStack Start`

You can proceed with the Vercel deployment from that screen.
