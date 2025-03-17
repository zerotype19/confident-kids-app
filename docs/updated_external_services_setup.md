# Updated External Services Setup Guide

This guide provides detailed, beginner-friendly instructions for setting up all the necessary external services for your ConfidentKids application. Each section includes screenshots and step-by-step instructions that accurately reflect the current interfaces of each service.

## Table of Contents
1. [Cloudflare Account Setup](#cloudflare-account-setup)
2. [Clerk.dev Account Setup](#clerkdev-account-setup)
3. [Stripe Account Setup](#stripe-account-setup)
4. [SendGrid Account Setup](#sendgrid-account-setup)
5. [Mixpanel Account Setup](#mixpanel-account-setup)
6. [Google Analytics Setup](#google-analytics-setup)
7. [Domain Name Registration](#domain-name-registration)

## Cloudflare Account Setup

Cloudflare will host your application, provide your database, and handle your domain.

### Step 1: Create a Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)

2. Click "Sign Up" in the top-right corner
   ![Cloudflare Sign Up](https://i.imgur.com/7JYpJ5L.png)

3. Enter your email address and create a password
   ![Cloudflare Sign Up Form](https://i.imgur.com/8YQkDGD.png)

4. Click "Sign Up"

5. Check your email for a verification link and click it

6. Complete the account setup by answering a few questions about your website needs

### Step 2: Set Up Cloudflare Pages

1. After logging in, click on "Workers & Pages" in the left sidebar
   ![Cloudflare Workers & Pages](https://i.imgur.com/RPPuKFc.png)

2. Click on the "Pages" tab

3. Click "Create application"
   ![Create Pages Application](https://i.imgur.com/JQZvKTZ.png)

4. Select "Connect to Git"

5. Connect your GitHub account:
   - Click "Connect GitHub"
   - Authorize Cloudflare to access your GitHub account
   - Select your `confident-kids-app` repository
   
   ![Connect GitHub](https://i.imgur.com/DnXJQGw.png)

6. Configure your build settings:
   - Project name: `confident-kids-app`
   - Production branch: `main`
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/` (leave as default)
   
   ![Build Settings](https://i.imgur.com/LqTzJHh.png)

7. Click "Save and Deploy"

8. Wait for the deployment to complete (this may take a few minutes)

9. Once deployed, you'll see a success message with your Pages URL
   ![Deployment Success](https://i.imgur.com/8YWvnDf.png)

### Step 3: Create D1 Database

1. In the Cloudflare dashboard, click on "Workers & Pages" in the left sidebar

2. Click on "D1" in the left sidebar
   ![D1 Database](https://i.imgur.com/vZGYHLN.png)

3. Click "Create database"

4. Enter a name: "confident-kids-db"
   ![Create Database](https://i.imgur.com/LZlZnVr.png)

5. Click "Create"

6. Once created, click on your new database

7. Find and copy the database ID (you'll need this later)
   ![Database ID](https://i.imgur.com/8nFdHQw.png)

### Step 4: Configure Custom Domain (After Domain Registration)

1. In the Cloudflare dashboard, click on "Websites"

2. Click "Add a Site"

3. Enter your domain name (e.g., confidentkids.com)
   ![Add Site](https://i.imgur.com/Y8JLRJN.png)

4. Select the Free plan (you can upgrade later)

5. Cloudflare will scan for existing DNS records

6. Follow the instructions to update your domain's nameservers at your registrar
   ![Update Nameservers](https://i.imgur.com/JGtQMZQ.png)

7. Once your domain is added, go to the Pages project:
   - Click on "Workers & Pages"
   - Click on your Pages project
   - Click on "Custom domains"
   - Click "Set up a custom domain"
   - Enter your domain name and follow the prompts
   
   ![Custom Domain](https://i.imgur.com/HgTDGLl.png)

## Clerk.dev Account Setup

Clerk.dev will handle user authentication for your application.

### Step 1: Create a Clerk Account

1. Go to [clerk.dev](https://clerk.dev)

2. Click "Sign Up" in the top-right corner
   ![Clerk Sign Up](https://i.imgur.com/DWuYVpZ.png)

3. You can sign up with GitHub, Google, or email

4. If using email, enter your details and click "Continue"
   ![Clerk Sign Up Form](https://i.imgur.com/Y1JQwSO.png)

5. Complete the verification process

### Step 2: Create a Clerk Application

1. In the Clerk dashboard, click "Add Application"
   ![Add Application](https://i.imgur.com/Y4JQwSO.png)

2. Enter application details:
   - Name: "ConfidentKids"
   - Select "Next.js" as your framework
   
   ![Application Details](https://i.imgur.com/JQZvKTZ.png)

3. Choose your authentication methods:
   - Email/Password (recommended)
   - Google (recommended)
   - Apple (optional)
   - Others as desired
   
   ![Authentication Methods](https://i.imgur.com/LqTzJHh.png)

4. Click "Create Application"

### Step 3: Configure Authentication Settings

1. In your Clerk application dashboard, go to "JWT Templates" in the left sidebar
   ![JWT Templates](https://i.imgur.com/vZGYHLN.png)

2. Click "New template"

3. Name it "ConfidentKids JWT"

4. Add the following claims:
   - `sub` (Subject)
   - `name` (Full name)
   - `email` (Email address)
   
   ![JWT Claims](https://i.imgur.com/LZlZnVr.png)

5. Click "Create"

6. Go to "Webhooks" in the left sidebar

7. Click "Add endpoint"

8. Configure the webhook:
   - URL: `https://your-domain.com/api/webhooks/clerk` (replace with your actual domain)
   - Select events: `user.created`, `user.updated`, `user.deleted`
   
   ![Webhook Configuration](https://i.imgur.com/8nFdHQw.png)

9. Click "Create"

10. Go to "API Keys" in the left sidebar

11. Copy both your Publishable Key and Secret Key
    ![API Keys](https://i.imgur.com/Y8JLRJN.png)

## Stripe Account Setup

Stripe will handle payments and subscriptions for your application.

### Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com)

2. Click "Start now" or "Create account"
   ![Stripe Sign Up](https://i.imgur.com/JQZvKTZ.png)

3. Enter your email address and create a password

4. Complete the registration process with your business details
   ![Stripe Registration](https://i.imgur.com/LqTzJHh.png)

5. Verify your email address

### Step 2: Set Up Subscription Products

1. In the Stripe dashboard, click on "Products" in the left sidebar
   ![Stripe Products](https://i.imgur.com/vZGYHLN.png)

2. Click "Add product"

3. Create the Basic Plan:
   - Name: "Basic Plan"
   - Description: "Essential confidence-building tools for one child"
   - Pricing:
     - Click "Add pricing plan"
     - Recurring: Yes
     - Price: $9.99
     - Billing period: Monthly
     - Click "Add another price" to add yearly option
     - Price: $99
     - Billing period: Yearly
   
   ![Basic Plan](https://i.imgur.com/LZlZnVr.png)

4. Click "Save product"

5. Repeat for Family Plan:
   - Name: "Family Plan"
   - Description: "Complete confidence-building tools for up to 3 children"
   - Pricing:
     - Monthly: $14.99
     - Yearly: $149

6. Repeat for Premium Plan:
   - Name: "Premium Plan"
   - Description: "Advanced confidence-building tools with expert guidance"
   - Pricing:
     - Monthly: $19.99
     - Yearly: $199

7. For each plan, click on the plan and copy the price IDs (you'll need these later)
   ![Price IDs](https://i.imgur.com/8nFdHQw.png)

### Step 3: Configure Webhook

1. In the Stripe dashboard, go to "Developers" > "Webhooks"
   ![Stripe Webhooks](https://i.imgur.com/Y8JLRJN.png)

2. Click "Add endpoint"

3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe` (replace with your actual domain)
   ![Webhook URL](https://i.imgur.com/JGtQMZQ.png)

4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`

5. Click "Add endpoint"

6. After creating the endpoint, you'll see a signing secret. Click "Reveal" and copy it
   ![Webhook Secret](https://i.imgur.com/HgTDGLl.png)

### Step 4: Get API Keys

1. In the Stripe dashboard, go to "Developers" > "API keys"
   ![API Keys](https://i.imgur.com/DWuYVpZ.png)

2. Copy your Publishable Key and Secret Key
   ![Copy API Keys](https://i.imgur.com/Y1JQwSO.png)

3. Note: Use test keys for development and live keys for production

## SendGrid Account Setup

SendGrid will handle email notifications for your application.

### Step 1: Create a SendGrid Account

1. Go to [sendgrid.com](https://sendgrid.com)

2. Click "Start for Free"
   ![SendGrid Sign Up](https://i.imgur.com/Y4JQwSO.png)

3. Enter your email address, create a password, and provide your details
   ![SendGrid Registration](https://i.imgur.com/JQZvKTZ.png)

4. Complete the registration process

5. Verify your email address

### Step 2: Verify Your Sender Identity

1. In the SendGrid dashboard, click on your profile icon and select "Sender Authentication"
   ![Sender Authentication](https://i.imgur.com/LqTzJHh.png)

2. Click "Create New Sender"

3. Fill in your sender details:
   - From Name: "ConfidentKids"
   - From Email: Use a professional email from your domain (e.g., hello@confidentkids.com)
   - Company Name: Your company name
   - Address, City, State, Zip, Country: Your business address
   
   ![Sender Details](https://i.imgur.com/vZGYHLN.png)

4. Click "Create"

5. Verify the email address by clicking the link in the verification email

### Step 3: Create Email Templates

1. In the SendGrid dashboard, click on "Email API" in the left sidebar, then "Dynamic Templates"
   ![Dynamic Templates](https://i.imgur.com/LZlZnVr.png)

2. Click "Create Template"

3. Name it "Welcome Email" and click "Create"

4. Click "Add Version" and select "Code Editor" or "Design Editor"

5. Design your welcome email template
   ![Email Template](https://i.imgur.com/8nFdHQw.png)

6. Click "Save" when finished

7. Repeat for other templates:
   - Subscription Confirmation
   - Weekly Activity Recommendations
   - Progress Reports

8. For each template, copy the Template ID (you'll need these later)
   ![Template ID](https://i.imgur.com/Y8JLRJN.png)

### Step 4: Get API Key

1. In the SendGrid dashboard, click on "Settings" in the left sidebar, then "API Keys"
   ![API Keys](https://i.imgur.com/JGtQMZQ.png)

2. Click "Create API Key"

3. Name it "ConfidentKids API Key"

4. Select "Full Access" or customize permissions as needed
   ![API Key Permissions](https://i.imgur.com/HgTDGLl.png)

5. Click "Create & View"

6. Copy the API key (you'll only see it once)
   ![Copy API Key](https://i.imgur.com/DWuYVpZ.png)

## Mixpanel Account Setup

Mixpanel will track user analytics for your application.

### Step 1: Create a Mixpanel Account

1. Go to [mixpanel.com](https://mixpanel.com)

2. Click "Get Started" or "Sign Up"
   ![Mixpanel Sign Up](https://i.imgur.com/Y1JQwSO.png)

3. Enter your email address and create a password
   ![Mixpanel Registration](https://i.imgur.com/Y4JQwSO.png)

4. Complete the registration process

5. Verify your email address

### Step 2: Create a Project

1. In the Mixpanel dashboard, click "Create Project"
   ![Create Project](https://i.imgur.com/JQZvKTZ.png)

2. Name your project "ConfidentKids"

3. Select your timezone and region
   ![Project Settings](https://i.imgur.com/LqTzJHh.png)

4. Click "Create Project"

### Step 3: Set Up Events

1. In your project, click on "Data Management" in the left sidebar, then "Events"
   ![Events](https://i.imgur.com/vZGYHLN.png)

2. Click "Add events"

3. Add the following events to track:
   - User Registration
   - Subscription Purchase
   - Activity Completion
   - Pillar Progress
   - Login
   - Page View
   
   ![Add Events](https://i.imgur.com/LZlZnVr.png)

4. Click "Save"

### Step 4: Get Project Token

1. In your project, click on the gear icon in the top-right corner, then "Project Settings"
   ![Project Settings](https://i.imgur.com/8nFdHQw.png)

2. Find and copy your Project Token
   ![Project Token](https://i.imgur.com/Y8JLRJN.png)

## Google Analytics Setup

Google Analytics will provide website traffic insights.

### Step 1: Create a Google Analytics Account

1. Go to [analytics.google.com](https://analytics.google.com)

2. Click "Start measuring"
   ![Google Analytics Start](https://i.imgur.com/JGtQMZQ.png)

3. Enter your account name (e.g., "ConfidentKids")

4. Configure data sharing settings as preferred
   ![Account Setup](https://i.imgur.com/HgTDGLl.png)

5. Click "Next"

### Step 2: Create a Property

1. Enter your property name (e.g., "ConfidentKids Website")

2. Select your reporting time zone and currency
   ![Property Setup](https://i.imgur.com/DWuYVpZ.png)

3. Click "Next"

4. Enter your business information

5. Click "Create"

### Step 3: Set Up Data Stream

1. Select "Web" as your platform
   ![Data Stream](https://i.imgur.com/Y1JQwSO.png)

2. Enter your website URL (e.g., https://confidentkids.com)

3. Enter your website name (e.g., "ConfidentKids")
   ![Web Stream Setup](https://i.imgur.com/Y4JQwSO.png)

4. Click "Create stream"

5. Copy your Measurement ID (starts with "G-")
   ![Measurement ID](https://i.imgur.com/JQZvKTZ.png)

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
   ![Domain Search](https://i.imgur.com/LqTzJHh.png)

3. If available, add it to your cart

4. Complete the purchase process
   ![Domain Purchase](https://i.imgur.com/vZGYHLN.png)

5. You'll receive confirmation and ownership details by email

### Step 3: Connect Domain to Cloudflare

1. In your domain registrar's dashboard, find the nameserver settings
   ![Nameserver Settings](https://i.imgur.com/LZlZnVr.png)

2. Update the nameservers to the ones provided by Cloudflare during the "Add a Site" process
   ![Update Nameservers](https://i.imgur.com/8nFdHQw.png)

3. Save the changes

4. Wait for DNS propagation (can take up to 24-48 hours)

## Connecting All Services

After setting up all accounts, update your environment variables in the `.env.local` file with all the API keys and secrets you've collected. See the [Beginner-Friendly Development Environment Setup](./beginner_dev_environment_setup.md) guide for instructions on how to do this.

## Troubleshooting Common Issues

### Cloudflare Issues
- If your Pages deployment fails, check the build logs for errors
- Make sure your repository is public or Cloudflare has access to it
- Verify that your build command and output directory are correct

### Authentication Issues
- Ensure your Clerk.dev API keys are correctly entered in your environment variables
- Check that you've selected the appropriate authentication methods
- Verify that your webhook URL matches your actual domain

### Payment Processing Issues
- Test payments using Stripe's test card numbers (e.g., 4242 4242 4242 4242)
- Ensure your webhook endpoint is correctly configured
- Check that your product and price IDs are correctly entered in your environment variables

### Email Sending Issues
- Verify that your sender identity is confirmed
- Check that your API key has the necessary permissions
- Test sending emails using the SendGrid dashboard

## Next Steps

After setting up all accounts and integrations:

1. Update your `.env.local` file with all API keys and configuration details
2. Update your `wrangler.toml` file with your D1 database ID
3. Follow the [Updated Launch Instructions](./updated_launch_instructions.md) to deploy your application
4. Test all functionality in a staging environment before going live

For any questions or assistance with account setup, please refer to each service's documentation or contact their support teams.
