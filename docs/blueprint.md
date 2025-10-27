# Blueprint

A short blueprint goes here.
## AfgAiHub — Flutter Master Blueprint

This document is a complete, actionable blueprint for converting the AfgAiHub Next.js frontend into a production-ready Flutter app, and for prompting Gemini to generate the code incrementally (file-by-file). It maps the existing Firebase/Functions + HesabPay backend to Flutter app architecture, screens, data models, navigation, state management, testing, CI, and developer tasks.

Use this blueprint as the single source of truth when prompting Gemini to scaffold, implement, and test screens and services.

## Contract (2–3 bullets)
- Inputs: Firebase project (Auth, Firestore, Functions), HesabPay credentials (HESABPAY_KEY, HESABPAY_WEBHOOK_SECRET, MERCHANT_PIN), assets from /src/components and /public.
- Outputs: A Flutter app that replicates key user flows (auth, agent dashboard, payment, subscription management, multi-vendor payouts) with the same Firestore schema and function contracts.
- Error modes: network failures, unauthenticated calls, invalid webhook payloads, payment provider errors; app surfaces friendly messages and retries where appropriate.

## Architecture Overview
- Presentation: Flutter (Widgets, Material), responsive layout (adaptive for mobile/tablet), accessible by default.
- State: Riverpod (recommended) for DI, modular providers, and easy testability. Alternative: Provider + ChangeNotifier if you prefer minimal dependencies.
- Services: Firebase wrappers (AuthService, FirestoreService, FunctionsService), HesabPay client (for client-side UX only — real money ops via Functions). All API calls go through services so Gemini can generate isolated files.
- Navigation: go_router for declarative routes and nested navigation (dashboard, agent flows, payment flow).
- Testing: unit tests (flutter_test), widget tests, and integration tests (integration_test) using Firebase Emulator for E2E.

## Key Packages (recommended)
- firebase_core, firebase_auth, cloud_firestore, firebase_functions
- flutter_riverpod, freezed & build_runner (data classes), json_serializable
- go_router, http (for optional direct HesabPay calls if needed), intl
- flutter_localizations, flutter_test, integration_test

## Project layout (recommended)
- lib/
	- main.dart
	- app.dart (Root widget, provider scope, router)
	- src/
		- features/
			- auth/
				- auth_service.dart
				- sign_in_page.dart
			- dashboard/
				- dashboard_page.dart
				- agents/
			- payments/
				- payment_service.dart
				- payment_session_model.dart
				- checkout_webview.dart
				- payment_success_page.dart
				- payment_fail_page.dart
		- shared/
			- widgets/
			- utils/
			- constants.dart
		- providers/
			- auth_provider.dart
			- payment_provider.dart

## Screens and Flow Mapping
1. Onboarding / Login
	 - SignInPage: email/password + social providers (reuse firebase_auth).
2. Dashboard
	 - DashboardPage: lists agent cards (mirrors `components/agents/*`), quick actions.
3. Agent Experience Screens
	 - AgentDetail / AgentForm: replicate existing agents' UIs and actions.
4. Payments Flow
	 - PaymentInitiateWidget: collects items and calls Functions `createPaymentSession` via Firebase Functions SDK.
	 - CheckoutWebView: either open `checkout_url` in external browser or embed via WebView and listen for postMessage events (HesabPay may post messages). For embedded, use flutter_webview_plugin or webview_flutter with javascriptChannels for postMessage.
	 - PaymentSuccessPage / PaymentFailPage: read payload either from URL params (when redirected) or from postMessage and show details; optionally poll Firestore `payment_sessions/{sessionId}` to confirm final status.
5. Vendor Distribution (Admin)
	 - DistributePaymentPage: authenticated-only, collects vendors list and calls `distributePayment` via callable function.

## Data Models (FireStore mapping)
- PaymentSession
	- sessionId: string
	- checkout_url: string
	- userId: string | null
	- guest: bool
	- items: List<Item>
	- status: 'pending'|'success'|'failed'

- PaymentTransaction
	- transaction_id, session_id, status, amount, webhookPayload

- PaymentDistribution
	- txnId, initiatorUserId, vendors, status, response

Define these as Freezed data classes and use json_serializable for encode/decode.

## Firebase Functions / API Contracts (what the Flutter app calls)
- createPaymentSession (callable)
	- Request: { items, email?, successUrl, failUrl }
	- Response: { success: true, checkout_url, sessionId }
- distributePayment (callable)
	- Request: { vendors: [{ account_number, amount, description? }] }
	- Response: { success: true, transactionId, summary }

Important: Always call these via Firebase Functions SDK to ensure secrets remain server-side.

## Payments UX Implementation Notes
- Redirect flow: prefer opening the `checkout_url` in an external browser (safer) and using deep links or success/fail redirect URLs with encoded JSON (or sessionId) so the app can fetch the updated session from Firestore.
- Embedded flow: if using WebView, ensure origin validation for postMessage events and only accept `paymentSuccess`, `paymentFailure`, and `paymentCancelled` types.
- Polling: on redirect, show a loading screen and poll `payment_sessions/{sessionId}` for status updates; fallback to manual refresh if webhook delay.

## Error Handling and UX Considerations
- Show friendly messages for network errors, function failures, and payment cancellations.
- Implement exponential backoff for polling and retries for transient network failures.
- For critical payment flows, show transaction ID and link to support.

## i18n & Accessibility
- Use `intl` package and extract strings. Provide RTL support and ensure color contrast.
- Use semantic labels for screen readers and scalable text.

## Testing Strategy
- Unit tests: services and providers mocking Firebase via fake implementations or mockito.
- Widget tests: key screens (Payment flow, Dashboard, Auth). Mock Firebase calls.
- Integration tests: using Firebase Emulator Suite to run E2E: initiate session -> simulate HesabPay webhook to emulator -> verify subscription grant.

## CI / Release
- GitHub Actions pipeline: lint, flutter analyze, unit tests, integration tests (optional emulator), build APK / IPA artifacts.
- Release: use codemagic or GitHub Actions with fastlane for production builds.

## Gemini Prompt Templates (file-by-file generation)
Below are ready-to-use prompts for Gemini. Each prompt instructs Gemini to generate one file and associated tests. When invoking, attach the repository context and the target path.

Prompt: Create Flutter Payment Service (file: lib/src/features/payments/payment_service.dart)
"You are a senior Flutter engineer. Generate a single Dart file at lib/src/features/payments/payment_service.dart. It must: import firebase_functions and cloud_firestore, expose functions createPaymentSession(items, email) and distributePayment(vendors) that call the callable functions 'createPaymentSession' and 'distributePayment'. Use Riverpod Provider for dependency injection. Include method-level doc comments, null-safety, and unit-test-friendly separation of concerns (no UI code). Return a typed response model PaymentSessionResult. Do not create other files. Keep file under 200 LOC."

Prompt: Create Payment Session Model (file: lib/src/features/payments/payment_session_model.dart)
"Generate a Freezed data class PaymentSession with fields: sessionId, checkoutUrl, userId, guest, items (List<Item>), status, createdAt. Add JsonSerializable support. Provide fromJson/toJson. Ensure null-safety."

Prompt: Create Checkout WebView & Listener (file: lib/src/features/payments/checkout_webview.dart)
"Generate a Widget CheckoutWebView that accepts checkoutUrl and sessionId. Use webview_flutter and a JavascriptChannel to listen for postMessage events. Validate event.origin against allowed origins ['https://api.hesab.com','https://checkout.hesab.com'] and trigger a navigator push to PaymentSuccessPage when paymentSuccess arrives. Include minimal styling and accessibility labels."

Prompt: Create Payment Success Page (file: lib/src/features/payments/payment_success_page.dart)
"Generate a StatelessWidget PaymentSuccessPage that reads a sessionId from arguments, fetches `payment_sessions/{sessionId}` from Firestore, shows transaction_id and a link to Dashboard. Use Riverpod to read services. Write one widget test that verifies loading -> success state using a mock Firestore."

Prompt: Create Riverpod Providers (file: lib/src/providers/payment_provider.dart)
"Generate a Riverpod file that exposes paymentServiceProvider and paymentSessionProvider (FutureProvider.family for reading a session by id). Keep providers testable and documented."

Constraints for Gemini prompts
- Always return only the file content for the requested path unless asked for tests or multiple files.
- Follow repository's TypeScript-to-Dart data shape for payment objects (match Firestore fields in docs/HESABPAY_INTEGRATION.md).
- Each generation must include simple inline unit tests (where requested) using flutter_test and mockito/fake implementations.

## Bootstrapping commands (developer quick-start)
1. Create Flutter project:
	 - flutter create afgaichub_flutter
2. Add packages:
	 - flutter pub add firebase_core firebase_auth cloud_firestore firebase_functions flutter_riverpod go_router webview_flutter http json_serializable freezed build_runner intl
3. Scaffold providers and services per the layout above.

## Next steps I can take for you
1. Generate `docs/blueprint.md` (done) — now I can: generate the first Flutter files (app skeleton, auth, payment service) using Gemini prompts above.
2. Produce a GitHub Actions workflow to build Flutter artifacts.
3. Create emulator-driven integration tests that simulate HesabPay webhooks.

If you'd like me to start generating Flutter files with Gemini prompt templates, tell me which file to generate first (recommended: `payment_service.dart` and `payment_session_model.dart`).

---
Revision notes: This blueprint maps directly to the backend function contracts and Firestore collection names in this repository. Use sandbox HesabPay keys during development and never embed secrets in the app.

# **App Name**: AfgAiHub

## Core Features:

- QuranTutor: An AI agent specializing in spiritual guidance and knowledge of the Quran, powered by Gemini API and Firestore to store user interactions and preferences.
- DoctorAssistant: A medical AI agent providing preliminary medical information and assistance, powered by Gemini API. Integrated with Firestore to maintain user history and health records.
- RealEstateAgent: An AI agent assisting with real estate inquiries and property information, utilizing Gemini API and linked to Firestore for storing property details and user preferences.
- AppPrototyper: A prompt-to-app builder AI agent that generates app prototypes based on user descriptions. It uses the Gemini API tool to transform textual descriptions into functional code, saved and managed within Firestore.
- AntiqueAuthenticator: An AI agent that analyzes images of antiques to provide authentication insights, powered by Gemini API. Firestore integration facilitates the storage of authentication reports and image data.
- HesabPay Integration: Enables secure payment processing for premium features and services within the AI ecosystem.
- User Authentication: Secure user authentication managed via Firebase Auth, allowing personalized experiences and data storage.

## Style Guidelines:

- Primary color: Vivid indigo (#4B0082) to evoke innovation and intellect.
- Background color: Very light grey-blue (#F0F8FF), near white, offering a clean, uncluttered backdrop that subtly complements the indigo primary color, ensuring it remains the focal point.
- Accent color: Purple (#800080) to highlight key interactive elements and enhance visual interest, providing a harmonious yet distinct contrast within the color scheme.
- Headline font: 'Space Grotesk', a sans-serif font for a modern, tech-forward feel; body font: 'Inter', a versatile sans-serif font, for readability.
- Use a consistent set of minimalist icons to represent different agents and functionalities, maintaining a clean and intuitive user experience.
- Employ subtle Framer Motion animations for transitions and interactions, enhancing user engagement without overwhelming the interface.
- A modular dashboard layout that allows users to easily access and manage different AI agents and their respective functions.