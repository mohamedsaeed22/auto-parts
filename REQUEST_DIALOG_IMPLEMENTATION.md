# Request Accept/Reject Dialog Implementation

## Overview

Enhanced the RequestsPage with two-step Accept dialog and Reject confirmation dialog with payment method selection.

## Features Implemented

### 1. Reject Confirmation Dialog (`RejectConfirmDialog.tsx`)

- Shows confirmation dialog before rejecting a request
- Displays warning message about the irreversible action
- Requires user confirmation to proceed with rejection

### 2. Accept Request Dialog (`AcceptRequestDialog.tsx`)

- **Two-step process:**

  **Step 1: Address Selection**

  - Select from existing addresses
  - Or add a new delivery address with full form
  - Progress indicator showing current step

  **Step 2: Payment Method Selection**

  - Choose between:
    - **Cash on Delivery**: Payment upon delivery, dialog closes after success
    - **Credit Card**: Redirects to payment URL returned from API

### 3. Updated RequestsPage.tsx

- Replaced old `AddressSelectionDialog` with new `AcceptRequestDialog`
- Added `RejectConfirmDialog` for rejection confirmation
- Updated handler functions:
  - `handleAcceptRequest()`: Opens accept dialog
  - `handleRejectRequest()`: Opens reject confirmation dialog
  - `handleAcceptConfirm()`: Processes accept with address and payment method
  - `handleRejectConfirm()`: Processes rejection after confirmation

### 4. API Updates (`requestsApi.ts`)

- Added `payment_method` field to `ApproveRequestRequest` interface
- Added `payment_url` field to `ApproveRequestResponse` interface
- Supports both "cash" and "credit_card" payment methods

### 5. Payment Flow

- **Cash Payment**:
  1. User selects cash → Submits request
  2. Dialog closes on success
  3. Request status updated
- **Credit Card Payment**:
  1. User selects credit card → Submits request
  2. API returns `payment_url`
  3. User redirected to payment gateway
  4. After payment, user returns with payment status in URL params
  5. `PaymentAlert` component shows success/failure toast
  6. URL params cleaned after 3 seconds

## Translation Keys Added

### English (userProfile.json)

```json
"rejectDialog": {
  "title": "Reject Request",
  "description": "Are you sure you want to reject this request?",
  "warning": "Once rejected, you will need to create a new request...",
  "cancel": "Cancel",
  "confirm": "Yes, Reject"
},
"acceptDialog": {
  "step1": "Address",
  "step2": "Payment",
  "paymentTitle": "Select Payment Method",
  "choosePayment": "Choose your payment method",
  "cashPayment": "Cash on Delivery",
  "creditCardPayment": "Credit Card",
  "creditCardNote": "You will be redirected to secure payment...",
  "next": "Next",
  "back": "Back",
  "confirm": "Accept Request"
}
```

### Arabic (userProfile.json)

Corresponding Arabic translations added for all dialog texts.

## Files Modified

1. **New Components:**

   - `src/components/userprofile/AcceptRequestDialog.tsx`
   - `src/components/userprofile/RejectConfirmDialog.tsx`

2. **Updated Components:**
   - `src/components/userprofile/RequestsPage.tsx`
3. **Updated API:**

   - `src/services/api/requestsApi.ts`

4. **Updated Translations:**
   - `src/lib/i18n/translations/en/userProfile.json`
   - `src/lib/i18n/translations/ar/userProfile.json`

## User Experience Flow

1. User sees "Submitted" request with pricing from admin
2. Clicks "Accept" button:
   - Step 1: Selects or adds delivery address
   - Step 2: Chooses payment method (cash or credit card)
   - Confirms acceptance
3. If credit card selected, redirects to payment gateway
4. Returns with payment status and sees toast notification
5. URL params auto-cleaned after toast disappears

Or clicks "Reject" button:

- Sees confirmation dialog with warning
- Must confirm to proceed with rejection
- Request status updated to rejected

## Benefits

✅ Clear two-step process for accepting requests
✅ Payment method selection integrated into accept flow
✅ Seamless credit card payment with external gateway
✅ Confirmation dialog prevents accidental rejections
✅ Fully translated in English and Arabic
✅ Responsive design for all screen sizes
✅ Progress indicator for better UX
