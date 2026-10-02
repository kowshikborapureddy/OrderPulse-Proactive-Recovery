# OrderPulse

OrderPulse — Working Food Delivery & Proactive Recovery MVP

Build a fully functional, responsive food-delivery web application called OrderPulse, inspired by the uploaded food-delivery UI reference images.

This must be a working application, not just a landing page, static mockup, or collection of non-functional screens.

1. Product vision

OrderPulse is a food-delivery experience that helps customers discover food, place orders, track delivery, and receive proactive recovery options when a delivery may be delayed or disrupted.

Core product principle:

AI recommends. Policy controls. Customer decides.

2. Design and visual direction

Use the uploaded food-delivery screenshots as visual inspiration for:

Food category carousels with food illustrations or images.

Restaurant discovery cards with ratings, cuisine, location, offers, and delivery estimates.

Search bars, location selection, filters, and sorting.

Food menu pages with attractive item cards, prices, descriptions, and Add buttons.

Modern, spacious layouts with rounded cards and responsive navigation.

Do not copy another brand's logo, name, or exact interface. Create an original OrderPulse identity.

Use OrderPulse's existing visual identity:

Midnight navy and deep blue as the primary brand colors.

Indigo and violet for buttons, active states, and highlights.

White or soft neutral backgrounds for food discovery and menu pages.

Mint green for successful states.

Coral/red only for delivery warnings and errors.

Use high-quality food images, clear typography, responsive layouts, and a mobile-first experience. Avoid excessive animations and clutter.

3. Customer-facing pages

Build these pages with working navigation and interactions:

A. Home / Food Discovery

Location selector.

Search for restaurants and food.

Food category carousel: Biryani, North Indian, South Indian, Pizza, Desserts, Burgers, Rolls, Noodles, and more.

Restaurant cards with image, name, cuisine, rating, delivery estimate, and available offers.

Search, category selection, filters, and sorting must work.

B. Restaurant and Menu

Open a restaurant to view its menu.

Show food images, item names, descriptions, prices, vegetarian indicators, and availability.

Add or remove items from the cart.

Support quantity changes and calculate the subtotal.

C. Cart and Checkout

Display selected items and quantities.

Calculate item subtotal, delivery fee, taxes or other charges if configured, and final total.

Collect customer name, phone number, and delivery address.

Include a demo checkout flow with a clear order confirmation.

Do not collect real payment information or claim that a payment has been processed.

D. Order Confirmation and Tracking

Generate a unique order ID.

Display restaurant, items, order total, and estimated delivery time.

Show delivery stages: Order Confirmed → Preparing → Picked Up → On the Way → Delivered.

Allow the customer to open the OrderPulse recovery experience from the active order.

4. Core feature — Proactive OrderPulse Recovery

This is the main differentiating feature and must work in the MVP.

Create a dedicated recovery interface for each active order.

The flow should be:

Monitor Order → Detect Delivery Risk → Early Warning → Explain the Situation → Show Recovery Options → Customer Chooses → Track Recovery.

Include a working demo scenario where a delivery becomes delayed.

When the demo delay is triggered:

Update the order to show a delivery-risk state.

Display an early warning to the customer.

Explain the reason using the demo data available.

Show the revised ETA only when it is supplied by the demo system. Never invent a live ETA.

Present available actions based on configured demo policies.

Recovery options:

Continue waiting and monitor the order.

Choose an available alternative or replacement, if configured.

Request cancellation and display the applicable demo refund policy.

Contact support.

When a customer chooses an option, update the order state and show a confirmation screen.

Do not guarantee a refund unless the configured demo policy explicitly allows it. Do not automatically cancel an order or make a purchase decision for the customer.

5. AI-assisted explanation

Implement an AI-assisted recovery layer only if a working model/API integration can be configured.

The AI may summarize provided delivery events, explain the risk, and recommend among policy-approved options.

Keep eligibility, prices, refund rules, and order state changes controlled by application logic.

If no AI API is configured, provide a clearly labelled demo explanation using predefined scenarios. Do not pretend that a real AI model or live delivery integration is running.

6. Demo data and backend

Use realistic sample restaurants, menus, food images, and delivery scenarios so the application can be tested immediately.

Use Supabase for persistent storage and authentication if the project environment supports it.

Suggested data entities:

Restaurants

Menu items

Customer profiles

Orders and order items

Delivery events

Recovery actions

Demo recovery policies

Keep customer data private. A customer should only be able to access their own orders.

If Supabase credentials are not configured, implement a functional local demo with persistent browser storage and clearly indicate that it is demo mode.

7. Navigation and user experience

Desktop navigation: OrderPulse logo, Home, Search, My Orders, and Cart.

Mobile navigation: Home, Search, Orders, and Cart.

Include loading states, empty states, validation messages, success confirmations, and error handling.

Every button, filter, navigation item, cart action, and recovery action must have a meaningful working interaction.

8. Technical requirements

React with TypeScript.

Responsive, reusable components.

Tailwind CSS for styling.

Supabase integration where configured.

Clean and maintainable project structure.

Functional routing between pages.

No dead buttons or placeholder screens presented as completed features.

9. Acceptance criteria

Consider the MVP complete only when a user can:

Browse restaurants and food categories.

Search for food and open a restaurant menu.

Add food to a cart and update quantities.

Complete a demo checkout and receive an order ID.

Track the order through its delivery stages.

Trigger a demo delivery delay.

See the risk explanation and available recovery choices.

Select an option and see the order's updated recovery status.

Refresh the page and retain demo order data.

Build the application in working stages. Start with the food discovery, restaurant menu, cart, and demo checkout. Then implement order tracking and proactive recovery. Do not stop after generating the homepage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f70156d1-5c87-49ef-bc8a-d3f2f639c59b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
