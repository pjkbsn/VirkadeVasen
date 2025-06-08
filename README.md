VirkadeVäsen - Handcrafted Macramé Ornaments
VirkadeVäsen Banner

An elegant e-commerce platform for handcrafted macramé ornaments and home decor, built with modern web technologies.

- Features -
  User Authentication - Secure login and registration via Supabase Auth
  Product Browsing - Browse products by category, color, or latest additions
  Shopping Cart - Add products to cart, adjust quantities, and checkout
  Payment Processing - Secure payments through Stripe integration
  Responsive Design - Seamless experience on all devices
- Tech Stack -
  Frontend
  Next.js 14 - React framework with server and client components
  TypeScript - Type-safe code
  Tailwind CSS - Utility-first styling
  Shadcn/UI - Component library for rapid UI development
  Zustand - State management
  Backend
  Next.js API Routes - Serverless API endpoints
  Server Actions - Modern data mutation approach
  Supabase - Database, authentication, and storage
  Stripe - Payment processing
  Zod - Runtime schema validation
- Getting Started -
  Prerequisites
  Node.js 18+
  npm or yarn
  Supabase account
  Stripe account (for payment processing)
  Environment Setup
  Create a .env.local file with the following variables:

Installation
Open http://localhost:3000 to see the application.

Database Setup
Create a Supabase project
Run the database schema in schema.sql
Set up Row Level Security (RLS) policies as needed

- Project Structure -
  🔐 Authentication
  The application uses Supabase Authentication with email/password login. Role-based access controls protect admin functionality.

💳 Payment Processing
Payments are processed via Stripe Checkout with seamless integration:

Secure checkout redirection
Payment confirmation
Cart clearing upon successful payment
🚀 Deployment
The site is deployed on Vercel for optimal Next.js performance.

📱 Responsive Design
The application is fully responsive with layouts optimized for:

Mobile devices
Tablets
Desktop computers
👥 Contributors
Philip Jakobsson
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
