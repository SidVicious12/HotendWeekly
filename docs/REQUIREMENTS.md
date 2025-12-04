# HotendWeekly - Project Requirements Document

## 🎯 Project Overview

**Project Name:** HotendWeekly  
**Domain:** [hotendweekly.com](http://hotendweekly.com/)  
**Description:** A hybrid newsletter + AI-powered tool for discovering and delivering 3D printed parts. The platform helps users find trending, useful, or fun 3D prints via LLM prompts — and optionally have them fulfilled via an on-demand print network.

## 🧠 Vision Statement

HotendWeekly is more than a newsletter. It is:
- 🧠 **An AI-powered discovery engine** for 3D printable content
- 🛠️ **A maker tool** that evolves into a product platform
- 📦 **A fulfillment gateway** — starting with API-connected farms (Craftcloud, Hubs) and potentially evolving into a distributed print network
- 🧑‍💻 **A launchpad for STL creators** to feature their designs and offer fulfillment

## 🏗️ Technical Architecture

### Phase 0 - Current Implementation

#### 🔹 Frontend
- **Framework:** Next.js 14 with TypeScript (React-based)
- **Styling:** Tailwind CSS
- **Hosting:** Hostinger
- **Design Goals:** Clean, brandable UI with newsletter archive, AI print search, and "Get this printed" buttons
- **Current Status:** ✅ SSENSE-inspired minimal design implemented

#### 🔹 Backend (Planned)
- **Primary Database:** Supabase with Postgres
  - Newsletter issues storage
  - STL metadata management
  - Order tracking and fulfillment
  - User authentication (when implemented)
  - REST/GraphQL API endpoints
  - File storage for STL links and thumbnails

#### 🔹 Serverless Functions
- **Platform:** Cloudflare Workers or AWS Lambda
- **Purpose:**
  - Wrap GPT API requests
  - Rate limiting and request sanitization
  - Result formatting and curation
  - Route print job requests to vendors (e.g., Craftcloud)

#### 🔹 LLM Integration
- **Provider:** OpenAI GPT-4 Turbo
- **Use Cases:**
  - Answer print queries
  - Suggest relevant models
  - Return curated links with summaries
- **Workflow:** User Query → API search → Result curation → Summary response

#### 🔹 Payment Processing
- **Platform:** Stripe
- **Use Cases:**
  - STL sales and licensing
  - Premium newsletter tier subscriptions
  - "Print and deliver" service transactions

#### 🔹 Newsletter Management
- **Platform:** Buttondown or ConvertKit
- **Integration:** Form on site connects to newsletter backend
- **Optional:** Sync subscriber list with Supabase database

#### 🔹 Additional Tools (Optional)
- **Shipping:** Shippo or Pirate Ship for order fulfillment
- **Content:** OpenGraph scraping for STL link previews
- **Analytics:** Usage tracking and performance monitoring

## 📋 Functional Requirements

### Core Features

#### 1. Newsletter Archive
- **Description:** Browsable archive of past newsletter issues
- **Status:** ✅ Editorial section implemented with SSENSE-style design
- **Features:**
  - Clean article listing with categories
  - Individual article pages with rich content
  - Responsive design for all devices
  - SEO-optimized content structure

#### 2. AI Print Search
- **Description:** LLM-powered search for 3D printable content
- **Status:** 🔄 Planned for Phase 1
- **Features:**
  - Natural language query processing
  - Curated results with model suggestions
  - Integration with STL repositories
  - Smart filtering and categorization

#### 3. Newsletter Signup
- **Description:** Email subscription management
- **Status:** ✅ Basic form implemented, needs backend integration
- **Features:**
  - Clean signup form on homepage
  - Integration with newsletter platform
  - Subscriber preference management

#### 4. Print Fulfillment (Future)
- **Description:** "Get this printed" functionality
- **Status:** 🔄 Planned for Phase 2
- **Features:**
  - Integration with print service APIs
  - Order tracking and management
  - Shipping and delivery coordination

### User Experience Requirements

#### Design Principles
- **Aesthetic:** SSENSE-inspired minimal design ✅
- **Typography:** Light weights, uppercase tracking, clean hierarchy ✅
- **Color Scheme:** Monochromatic with subtle grays ✅
- **Layout:** Grid-based, generous whitespace ✅
- **Navigation:** Simple, intuitive, mobile-responsive ✅

#### Performance Requirements
- **Load Time:** < 3 seconds on 3G networks
- **Mobile Optimization:** Fully responsive design ✅
- **SEO:** Proper meta tags, structured data
- **Accessibility:** WCAG 2.1 AA compliance

## 🗂️ Content Strategy

### Editorial Content
- **Focus:** 3D printing technology, materials, industry news
- **Style:** Professional, informative, minimal design presentation ✅
- **Frequency:** Weekly newsletter with additional editorial content
- **Categories:** Recent news, technology reviews, material guides

### AI-Generated Content
- **Search Results:** Curated model recommendations
- **Summaries:** Brief descriptions of recommended prints
- **Categories:** Functional, decorative, educational, prototyping

## 🔒 Security & Privacy

### Data Protection
- **User Data:** Minimal collection, transparent usage
- **Payment Security:** PCI DSS compliant through Stripe
- **API Security:** Rate limiting, input sanitization
- **Privacy Policy:** Clear terms and data handling practices

### Technical Security
- **Authentication:** Secure user login system (when implemented)
- **API Keys:** Secure storage and rotation
- **HTTPS:** SSL/TLS encryption for all traffic
- **Input Validation:** Sanitization of all user inputs

## 📊 Success Metrics

### Phase 0 (Current)
- **Newsletter Signups:** Target engagement metrics
- **Site Performance:** Load times and user experience
- **Content Quality:** Editorial engagement and sharing

### Phase 1 (AI Integration)
- **Search Usage:** Query volume and success rates
- **User Engagement:** Time on site, return visits
- **Content Discovery:** Click-through rates on AI suggestions

### Phase 2 (Fulfillment)
- **Order Conversion:** Search-to-order conversion rates
- **Customer Satisfaction:** Order fulfillment quality
- **Revenue Growth:** Sustainable business model metrics

## 🛣️ Development Roadmap

### ✅ Phase 0 - Foundation (Completed)
- Next.js application with SSENSE-style design
- Editorial section with blog functionality
- Newsletter signup form
- Responsive, accessible design
- Basic SEO optimization

### 🔄 Phase 1 - AI Integration (Next)
- Supabase backend setup
- OpenAI GPT-4 integration
- AI search functionality
- STL metadata database
- Enhanced content management

### 🔄 Phase 2 - Fulfillment Platform
- Print service API integrations
- Order management system
- Payment processing with Stripe
- User account system
- Advanced analytics

### 🔄 Phase 3 - Community Platform
- STL creator profiles
- Community features
- Advanced AI recommendations
- Distributed print network
- Premium subscription tiers

## 📁 Current File Structure

```
/HotendWeekly
├── src/
│   ├── app/
│   │   ├── page.tsx (Homepage with SSENSE design)
│   │   ├── layout.tsx (Global layout)
│   │   ├── globals.css (Tailwind styles)
│   │   └── blog/ (Editorial section)
│   │       ├── page.tsx (Editorial listing)
│   │       └── bambu-lab-flagship-delay-2025/
│   │           └── page.tsx (Sample article)
│   └── components/
│       ├── NewsletterSignup.tsx
│       └── SearchInterface.tsx
├── package.json
├── next.config.js
├── tailwind.config.js
├── README.md
├── DEPLOYMENT.md
└── REQUIREMENTS.md (This document)
```

## 🔧 Development Environment

### Local Setup
```bash
npm install
npm run dev
```
- **Development URL:** http://localhost:3002
- **Build Command:** `npm run build`
- **Static Export:** Configured for Hostinger deployment

### Deployment
- **Platform:** Hostinger
- **Domain:** hotendweekly.com
- **Build Process:** Static site generation with Next.js
- **CDN:** Hostinger's built-in CDN

## 📞 Stakeholder Communication

### Project Owner Requirements
- Clean, professional design that reflects quality content ✅
- Fast, responsive website that works on all devices ✅
- Scalable architecture for future AI and fulfillment features ✅
- SEO-optimized content structure for organic growth ✅

### Technical Requirements Met
- Modern React/Next.js architecture ✅
- Tailwind CSS for maintainable styling ✅
- TypeScript for type safety ✅
- Responsive design with mobile-first approach ✅
- Static site generation for optimal performance ✅

---

**Document Version:** 1.0  
**Last Updated:** December 16, 2024  
**Status:** Phase 0 Complete, Phase 1 Planning