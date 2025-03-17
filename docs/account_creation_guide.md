# Account Creation and Integration Guide

This guide provides detailed instructions for setting up all the necessary accounts and integrations for your ConfidentKids SaaS application. Since you mentioned you're not technical, these instructions are designed to be as clear as possible.

## Table of Contents
1. [Cloudflare Account Setup](#cloudflare-account-setup)
2. [Clerk.dev Account Setup](#clerkdev-account-setup)
3. [Stripe Account Setup](#stripe-account-setup)
4. [SendGrid Account Setup](#sendgrid-account-setup)
5. [Mixpanel Account Setup](#mixpanel-account-setup)
6. [Google Analytics Setup](#google-analytics-setup)
7. [Domain Name Registration](#domain-name-registration)
8. [Connecting All Services](#connecting-all-services)

## Cloudflare Account Setup

Cloudflare will host your application, provide your database, and handle your domain.

### Step 1: Create a Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Click "Sign Up" in the top-right corner
3. Enter your email address and create a password
4. Verify your email address

### Step 2: Set Up Cloudflare Pages
1. In the Cloudflare dashboard, click on "Pages" in the left sidebar
2. Click "Create a project"
3. Connect your GitHub account when prompted
4. Select your ConfidentKids repository
5. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/` (leave as default)
6. Click "Save and Deploy"

### Step 3: Create D1 Database
1. In the Cloudflare dashboard, click on "Workers & Pages"
2. Click on "D1" in the left sidebar
3. Click "Create database"
4. Name it "confident-kids-db"
5. Choose a location close to your target audience
6. Click "Create"
7. Note the database ID (you'll need this later)

### Step 4: Configure Custom Domain
1. In the Cloudflare dashboard, click on "Websites"
2. Click "Add a Site"
3. Enter your domain name (e.g., confidentkids.com)
4. Select the Free plan (you can upgrade later)
5. Follow the instructions to update your domain's nameservers
6. Once your domain is added, go to the Pages project
7. Click on "Custom domains"
8. Click "Set up a custom domain"
9. Enter your domain name and follow the prompts

## Clerk.dev Account Setup

Clerk.dev will handle user authentication for your application.

### Step 1: Create a Clerk Account
1. Go to [clerk.dev](https://clerk.dev)
2. Click "Sign Up" in the top-right corner
3. You can sign up with GitHub, Google, or email
4. Complete the registration process

### Step 2: Create a Clerk Application
1. In the Clerk dashboard, click "Add Application"
2. Name your application "ConfidentKids"
3. Select "Next.js" as your framework
4. Choose your authentication methods:
   - Email/Password (recommended)
   - Google (recommended)
   - Apple (optional)
   - Others as desired
5. Click "Create Application"

### Step 3: Configure Authentication Settings
1. In your Clerk application dashboard, go to "JWT Templates"
2. Create a new template for your application
3. Add the following claims:
   - `sub` (Subject)
   - `name` (Full name)
   - `email` (Email address)
4. Go to "Webhooks" in the left sidebar
5. Add a new webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/clerk` (replace with your actual domain)
   - Select events: `user.created`, `user.updated`, `user.deleted`
6. Copy your API keys from the "API Keys" section:
   - Publishable Key
   - Secret Key

## Stripe Account Setup

Stripe will handle payments and subscriptions for your application.

### Step 1: Create a Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Create account"
3. Enter your email address and create a password
4. Complete the registration process with your business details
5. Verify your email address

### Step 2: Set Up Subscription Products
1. In the Stripe dashboard, go to "Products" in the left sidebar
2. Click "Add product"
3. Create the Basic Plan:
   - Name: "Basic Plan"
   - Description: "Essential confidence-building tools for one child"
   - Pricing:
     - Monthly: $9.99
     - Yearly: $99 (save ~17%)
   - Click "Save product"
4. Repeat for Family Plan:
   - Name: "Family Plan"
   - Description: "Complete confidence-building tools for up to 3 children"
   - Pricing:
     - Monthly: $14.99
     - Yearly: $149 (save ~17%)
5. Repeat for Premium Plan:
   - Name: "Premium Plan"
   - Description: "Advanced confidence-building tools with expert guidance"
   - Pricing:
     - Monthly: $19.99
     - Yearly: $199 (save ~17%)

### Step 3: Configure Webhook
1. In the Stripe dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe` (replace with your actual domain)
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the webhook signing secret (you'll need this later)

### Step 4: Get API Keys
1. In the Stripe dashboard, go to "Developers" > "API keys"
2. Copy your Publishable Key and Secret Key
3. Note: Use test keys for development and live keys for production

## SendGrid Account Setup

SendGrid will handle email notifications for your application.

### Step 1: Create a SendGrid Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Click "Start for Free"
3. Enter your email address, create a password, and provide your details
4. Complete the registration process
5. Verify your email address

### Step 2: Verify Your Sender Identity
1. In the SendGrid dashboard, go to "Settings" > "Sender Authentication"
2. Click "Verify a Single Sender"
3. Fill in your sender details:
   - From Name: "ConfidentKids"
   - From Email: Use a professional email from your domain (e.g., hello@confidentkids.com)
   - Company Name: Your company name
   - Address, City, State, Zip, Country: Your business address
4. Click "Create"
5. Verify the email address by clicking the link in the verification email

### Step 3: Create Email Templates
1. In the SendGrid dashboard, go to "Email API" > "Dynamic Templates"
2. Click "Create Template"
3. Create templates for:
   - Welcome Email
   - Subscription Confirmation
   - Weekly Activity Recommendations
   - Progress Reports
4. Design each template using the drag-and-drop editor
5. Save each template and note the Template IDs

### Step 4: Get API Key
1. In the SendGrid dashboard, go to "Settings" > "API Keys"
2. Click "Create API Key"
3. Name it "ConfidentKids API Key"
4. Select "Full Access" or customize permissions as needed
5. Click "Create & View"
6. Copy the API key (you'll only see it once)

## Mixpanel Account Setup

Mixpanel will track user analytics for your application.

### Step 1: Create a Mixpanel Account
1. Go to [mixpanel.com](https://mixpanel.com)
2. Click "Get Started" or "Sign Up"
3. Enter your email address and create a password
4. Complete the registration process
5. Verify your email address

### Step 2: Create a Project
1. In the Mixpanel dashboard, click "Create Project"
2. Name your project "ConfidentKids"
3. Select your timezone and region
4. Click "Create Project"

### Step 3: Set Up Events
1. In your project, go to "Data Management" > "Events"
2. Add the following events to track:
   - User Registration
   - Subscription Purchase
   - Activity Completion
   - Pillar Progress
   - Login
   - Page View

### Step 4: Get Project Token
1. In your project, go to "Project Settings"
2. Copy your Project Token
3. This token will be used to initialize Mixpanel in your application

## Google Analytics Setup

Google Analytics will provide website traffic insights.

### Step 1: Create a Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Enter your account name (e.g., "ConfidentKids")
4. Configure data sharing settings as preferred
5. Click "Next"

### Step 2: Create a Property
1. Enter your property name (e.g., "ConfidentKids Website")
2. Select your reporting time zone and currency
3. Click "Next"
4. Enter your business information
5. Click "Create"

### Step 3: Set Up Data Stream
1. Select "Web" as your platform
2. Enter your website URL (e.g., https://confidentkids.com)
3. Enter your website name (e.g., "ConfidentKids")
4. Click "Create stream"
5. Copy your Measurement ID (starts with "G-")

## Domain Name Registration

If you don't already have a domain name, you'll need to register one.

### Step 1: Choose a Domain Registrar
Recommended options:
- [Namecheap](https://www.namecheap.com)
- [Google Domains](https://domains.google)
- [GoDaddy](https://www.godaddy.com)

### Step 2: Register Your Domain
1. Go to your chosen registrar's website
2. Search for your desired domain name (e.g., confidentkids.com)
3. If available, add it to your cart
4. Complete the purchase process
5. You'll receive confirmation and ownership details by email

### Step 3: Connect Domain to Cloudflare
1. In your domain registrar's dashboard, find the nameserver settings
2. Update the nameservers to the ones provided by Cloudflare during the "Add a Site" process
3. Save the changes
4. Wait for DNS propagation (can take up to 24-48 hours)

## Connecting All Services

Once you have set up all the accounts, you'll need to connect them to your application.

### Step 1: Update Environment Variables
Your developer will need to update the `.env.local` file with all the API keys and secrets you've collected:

```
# Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_FAMILY_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# SendGrid
SENDGRID_API_KEY=SG...

# Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Step 2: Update Cloudflare Configuration
Your developer will need to update the `wrangler.toml` file with your D1 database ID:

```toml
name = "confident-kids-app"
compatibility_date = "2023-01-01"

[[d1_databases]]
binding = "DB"
database_name = "confident-kids-db"
database_id = "your-database-id"
```

### Step 3: Deploy the Application
Follow the deployment instructions in the [Launch Instructions](./launch_instructions.md) document to deploy your application to Cloudflare Pages.

## Troubleshooting Common Issues

### Cloudflare Integration Issues
- Ensure your domain's nameservers are correctly set to Cloudflare's nameservers
- Check that your Cloudflare Pages project is correctly linked to your GitHub repository
- Verify that your D1 database ID is correctly entered in wrangler.toml

### Authentication Issues
- Confirm that your Clerk.dev API keys are correctly entered in your environment variables
- Ensure the Clerk.dev webhook URL matches your actual domain
- Check that you've selected the appropriate authentication methods

### Payment Processing Issues
- Verify that your Stripe API keys are correctly entered in your environment variables
- Ensure your Stripe webhook URL matches your actual domain
- Check that your product and price IDs are correctly configured

### Email Sending Issues
- Confirm that your SendGrid API key is correctly entered in your environment variables
- Ensure your sender identity is verified
- Check that your email templates are correctly configured

## Next Steps

After setting up all accounts and integrations:

1. Share all API keys and configuration details with your developer
2. Follow the [Launch Instructions](./launch_instructions.md) to deploy your application
3. Test all functionality in a staging environment before going live
4. Launch your application and begin your marketing efforts

For any questions or assistance with account setup, please refer to each service's documentation or contact their support teams.
