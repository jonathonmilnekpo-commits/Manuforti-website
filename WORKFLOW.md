# Manu Forti Website — Order Workflow Documentation

## Overview

This document describes the complete order workflow for Manu Forti Intelligence supplier analysis reports, from customer submission through to final delivery.

## File Structure

```
manuforti-website/
├── index.html          # Landing page with pricing and CTA
├── order.html          # Order form with payment selection
├── order-success.html  # Post-order confirmation page (optional)
├── css/
│   └── styles.css      # Shared styles (to be extracted)
├── js/
│   └── order.js        # Order form logic (to be extracted)
└── README.md           # This file
```

## Order Workflow

### Step 1: Customer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│  LANDING PAGE (index.html)                                       │
│  • Hero: "Take a grip of procurement with Manu Forti"           │
│  • Features, pricing, how it works                              │
│  • CTA: "Order Report Now" → order.html                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  ORDER FORM (order.html)                                         │
│  • Select tier (Standard/Premium/Enterprise)                    │
│  • Enter customer details                                        │
│  • Enter company information                                     │
│  • Specify supplier to analyze                                   │
│  • Upload supporting documents (optional)                        │
│  • Select payment method (Vipps/Stripe/Invoice)                 │
│  • Submit order                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  ORDER CONFIRMATION                                              │
│  • Generate order reference (MF-YYYY-XXXXX)                     │
│  • Display success message                                       │
│  • Send confirmation email to customer                           │
│  • Notify Aiden (Lead Agent)                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Payment Processing

| Method | Flow | Integration |
|--------|------|-------------|
| **Vipps** | Customer selects Vipps → Redirect to Vipps app → Confirm payment → Return to site | Vipps ePayment API |
| **Stripe** | Customer enters card details → Stripe processes → Webhook confirms → Order activated | Stripe Payment Intents API |
| **Invoice** | Customer receives invoice via email → 14-day payment terms → Order activated immediately | Manual/SendGrid |

### Step 3: Product 1 Pipeline Activation

```
Order Received
      │
      ▼
┌─────────────┐
│   VETTER    │ ← Security check on supplier data sources
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  RESEARCHER │ ← Gather financials, risks, ESG, competitors
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   VENTURE   │ ← Generate Product 1 deck with visuals
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  VALIDATOR  │ ← Quality check structure, graphics, metrics
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   AIDEN     │ ← Final review, add strategic insights
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  JONATHON   │ ← QC approval (spot-check / all Enterprise)
└──────┬──────┘
       │
       ▼
   DELIVERY
```

### Step 4: Delivery

| Tier | SLA | Workflow |
|------|-----|----------|
| **Standard** ($249) | 24 hours | Automated pipeline → Aiden review → Email PDF |
| **Premium** ($349) | 12 hours | Automated + enhanced analysis → Aiden review → Email PDF |
| **Enterprise** ($499) | 6 hours | Custom research → Full manual review → Priority delivery |

## Form Fields Reference

### Customer Details (Required)
- Full Name
- Email Address
- Phone Number (optional)
- Job Title (optional)

### Company Information (Required)
- Company Name
- Industry (dropdown)
- Country (dropdown)
- Company Number / VAT (optional)
- Company Website (optional)

### Supplier to Analyze (Required)
- Supplier Name
- Supplier Website (optional)
- Supplier Country (optional)
- Analysis Context (textarea, optional)

### Supporting Documents (Optional)
- File upload: PDF, Word, Excel (max 10MB each)
- Company registration docs
- Contracts
- Previous reports

### Payment Selection (Required)
- Tier selection (Standard/Premium/Enterprise)
- Payment method (Vipps/Card/Invoice)

## Technical Implementation

### Current State (Static HTML)
- Form data stored in localStorage for demo
- No backend integration yet
- Client-side validation only

### Production Requirements

#### Backend API Endpoints Needed:

```
POST /api/orders
  → Create new order
  → Return: order_reference, payment_url

GET /api/orders/:reference
  → Check order status
  → Return: status, payment_status, delivery_estimate

POST /api/webhooks/stripe
  → Stripe payment confirmation

POST /api/webhooks/vipps
  → Vipps payment confirmation

POST /api/notify/aiden
  → Send order notification to Aiden
```

#### Database Schema (Simplified):

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_reference VARCHAR(20) UNIQUE NOT NULL,
    tier VARCHAR(20) NOT NULL,
    price INTEGER NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_status VARCHAR(20) DEFAULT 'received',
    
    -- Customer
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_title VARCHAR(100),
    
    -- Company
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    country VARCHAR(2),
    company_number VARCHAR(50),
    company_website VARCHAR(255),
    
    -- Supplier
    supplier_name VARCHAR(255) NOT NULL,
    supplier_website VARCHAR(255),
    supplier_country VARCHAR(2),
    analysis_context TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- SLA tracking
    sla_hours INTEGER NOT NULL,
    sla_deadline TIMESTAMP
);
```

#### Integration Checklist:

- [ ] Stripe account setup + API keys
- [ ] Vipps merchant account + API keys
- [ ] SendGrid/Mailgun for transactional emails
- [ ] File upload storage (S3/Cloudflare R2)
- [ ] Webhook endpoints for payment confirmations
- [ ] Aiden notification system (webhook/email)
- [ ] Order management dashboard

## SLA Commitments

| Tier | Price | Delivery | Included Analysis |
|------|-------|----------|-------------------|
| Standard | $249 | 24 hours | Financial health, operational capability, risk rating, recommendation |
| Premium | $349 | 12 hours | Standard + ESG assessment, competitor benchmarking, commercial intelligence |
| Enterprise | $499 | 6 hours | Premium + custom scope, consultation call, dedicated support |

## Risk Scoring Integration

The order form captures context that feeds into risk scoring:

1. **Industry** → Adjusts risk weightings (e.g., energy = higher geopolitical weight)
2. **Supplier country** → Geopolitical risk factor
3. **Analysis context** → Custom risk factors to investigate
4. **Uploaded documents** → Additional data sources

Risk categories evaluated:
- Financial (revenue, EBITDA, debt, cash flow)
- Operational (capacity, certifications, track record)
- Geopolitical (country risk, sanctions, stability)
- ESG (environmental, social, governance ratings)

## Next Steps for Production

1. **Backend Development**
   - Set up Node.js/Express or Python/FastAPI server
   - Implement order creation API
   - Connect to PostgreSQL database

2. **Payment Integration**
   - Stripe: Create account, get API keys, implement Payment Intents
   - Vipps: Apply for merchant account, implement ePayment API
   - Invoice: Set up SendGrid for automated invoicing

3. **Notification System**
   - Aiden webhook endpoint
   - Customer confirmation emails
   - Status update emails

4. **File Storage**
   - Set up S3 bucket or Cloudflare R2
   - Implement secure upload/download

5. **Security**
   - HTTPS enforcement
   - Input validation/sanitization
   - Rate limiting
   - GDPR compliance for EU customers

## Demo Mode

Current implementation uses localStorage for demo purposes:
- Orders stored in browser
- No actual payment processing
- No backend persistence

To clear demo data:
```javascript
localStorage.removeItem('manuforti_orders');
```
