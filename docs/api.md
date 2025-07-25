# API Documentation

This document provides comprehensive documentation for the **Little Phil Ignite** REST API.

## 🔐 Authentication

All API endpoints require authentication via Better Auth session cookies. The API uses organization-based access control where users can only access resources within their organization.

### Authentication Headers
```http
Cookie: better-auth.session_token=<session_token>
```

### Authorization Checks
- **User Authentication**: All endpoints verify user session
- **Organization Access**: Resources are scoped to user's organization
- **Resource Ownership**: Additional ownership checks for sensitive operations

## 📊 API Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { /* response payload */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { /* additional error context */ }
  }
}
```

### Pagination
Paginated endpoints include metadata:
```json
{
  "success": true,
  "data": {
    "items": [/* array of items */],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

## 🎯 Campaigns API

Campaigns are AI-generated email sequences for fundraising.

### Create Campaign
```http
POST /api/campaigns
```

**Request Body:**
```json
{
  "brief": "End-of-year fundraising for education programs",
  "ctaUrl": "https://donate.charity.org/education",
  "segmentId": "uuid-segment-id", // optional
  "senderId": "uuid-sender-id",
  "domainSenderId": "uuid-domain-sender-id" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-campaign-id"
  }
}
```

### Get Campaigns List
```http
GET /api/campaigns?page=1
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "uuid-campaign-id",
        "createdAt": 1640995200000,
        "title": "End-of-Year Education Campaign",
        "clickCount": 45,
        "contactCount": 1200,
        "emailsSent": 856,
        "status": "running"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Update Campaign
```http
PATCH /api/campaigns/{id}
```

**Request Body:**
```json
{
  "title": "Updated Campaign Title",
  "strategy": "Updated strategy content",
  "summary": "Updated summary",
  "segmentId": "new-segment-id"
}
```

### Get Campaign Details
```http
GET /api/campaigns/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ctaUrl": "https://donate.charity.org/education",
    "segmentId": "uuid-segment-id",
    "segmentName": "Major Donors",
    "domainSenderId": "uuid-domain-sender-id",
    "domainSenderName": "donations@charity.org",
    "title": "End-of-Year Education Campaign",
    "strategy": "AI-generated strategy content...",
    "summary": "Campaign summary..."
  }
}
```

### Get Campaign Content
```http
GET /api/campaigns/{id}/content
```

**Response:**
```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "id": "uuid-email-id",
        "day": 1,
        "sample": "Email content preview...",
        "subject": "Join us in making education accessible"
      }
    ]
  }
}
```

### Get Campaign Stats
```http
GET /api/campaigns/{id}/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clickCount": 45,
    "contactCount": 1200,
    "emailsSent": 856
  }
}
```

### Get Campaign Metadata
```http
GET /api/campaigns/{id}/metadata
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "draft",
    "draftStep": "strategy"
  }
}
```

### Complete Campaign Strategy
```http
POST /api/campaigns/{id}/complete-strategy
```

Triggers AI generation of campaign strategy and moves to content phase.

### Complete Campaign Content
```http
POST /api/campaigns/{id}/complete-content
```

Triggers AI generation of email content and moves to review phase.

### Launch Campaign
```http
POST /api/campaigns/{id}/launch
```

Launches the campaign and starts email delivery.

### Pause Campaign
```http
POST /api/campaigns/{id}/pause
```

Pauses an active campaign.

### Estimate Campaign Price
```http
GET /api/campaigns/{id}/estimate-price
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimatedCost": 250.50,
    "currency": "USD",
    "breakdown": {
      "emailDelivery": 180.00,
      "aiGeneration": 45.50,
      "enrichment": 25.00
    }
  }
}
```

### Improve Campaign Email
```http
POST /api/campaigns/{id}/emails/{emailId}/improve
```

**Request Body:**
```json
{
  "improvements": "Make the tone more personal and add urgency"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sample": "Improved email content..."
  }
}
```

## 👥 Contacts API

Manage donor contacts and enrichment.

### Create Contact
```http
POST /api/contacts
```

**Request Body:**
```json
{
  "email": "donor@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Example Corp",
  "jobTitle": "CEO"
}
```

### Get Contacts List
```http
GET /api/contacts?page=1&search=john
```

**Query Parameters:**
- `page` (optional): Page number
- `search` (optional): Search term for filtering

### Import Contacts
```http
POST /api/contacts/upload
```

**Request:** Multipart form data with CSV file
- `file`: CSV file with contact data

### Bulk Enrich Contacts
```http
POST /api/contacts/bulk-enrich
```

Enriches multiple contacts using Apollo.io integration.

### Enrich Single Contact
```http
POST /api/contacts/{id}/enrich
```

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "CEO",
    "company": "Example Corp",
    "enrichmentStatus": "completed",
    "apolloData": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "companySize": "50-100"
    }
  }
}
```

### Get Contact Enrichment Status
```http
GET /api/contacts/{id}/enrich
```

### Export Contacts
```http
GET /api/contacts/export
```

Returns CSV file download of all contacts.

## 🎯 Segments API

Manage contact segmentation for targeted campaigns.

### Create Segment
```http
POST /api/segments
```

**Request Body:**
```json
{
  "name": "Major Donors",
  "description": "Donors who have given $1000+",
  "criteria": {
    "minDonation": 1000,
    "location": "US",
    "interests": ["education", "health"]
  }
}
```

### Get Segments List
```http
GET /api/segments
```

### Get Segment Details
```http
GET /api/segments/{id}
```

### Update Segment
```http
PATCH /api/segments/{id}
```

### Delete Segment
```http
DELETE /api/segments/{id}
```

## 🏢 Organizations API

Manage organization settings and members.

### Create Organization
```http
POST /api/organisations
```

**Request Body:**
```json
{
  "name": "Charity Name",
  "slug": "charity-name",
  "description": "Making a difference in education"
}
```

### Get Current Organization
```http
GET /api/organisations/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-org-id",
    "name": "Charity Name",
    "slug": "charity-name",
    "description": "Making a difference in education",
    "createdAt": 1640995200000
  }
}
```

### Update Organization
```http
PATCH /api/organisations/me
```

**Request Body:**
```json
{
  "name": "Updated Charity Name",
  "description": "Updated description"
}
```

### Get Organization Members
```http
GET /api/members
```

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "uuid-user-id",
        "email": "admin@charity.org",
        "name": "Admin User",
        "role": "admin",
        "joinedAt": 1640995200000
      }
    ]
  }
}
```

## 📧 Domains API

Manage email sending domains and authentication.

### Get Domains List
```http
GET /api/domains
```

**Response:**
```json
{
  "success": true,
  "data": {
    "domains": [
      {
        "id": "uuid-domain-id",
        "domain": "charity.org",
        "isVerified": true,
        "createdAt": 1640995200000,
        "senders": [
          {
            "id": "uuid-sender-id",
            "email": "donations@charity.org",
            "name": "Donations Team"
          }
        ]
      }
    ]
  }
}
```

### Create Domain
```http
POST /api/domains
```

**Request Body:**
```json
{
  "domain": "charity.org"
}
```

### Verify Domain
```http
POST /api/domains/{id}/verify
```

Initiates domain verification process with DNS records.

### Create Domain Sender
```http
POST /api/domains/{id}/senders
```

**Request Body:**
```json
{
  "email": "donations@charity.org",
  "name": "Donations Team"
}
```

## 🔗 Click Tracking API

Track email engagement and clicks.

### Track Click
```http
GET /c/{token}
```

Redirects to destination URL and records engagement metrics.

## 🔧 System APIs

### Authentication
```http
GET /api/auth/session
POST /api/auth/sign-in
POST /api/auth/sign-out
POST /api/auth/sign-up
```

Uses Better Auth for session management.

### Background Jobs
```http
GET /api/inngest
POST /api/inngest
PUT /api/inngest
```

Inngest webhook endpoints for background job processing.

## 📝 Request Validation

All request bodies are validated using Zod schemas. Common validation rules:

### Email Validation
- Must be valid email format
- Domain restrictions may apply

### Required Fields
- All required fields must be present
- Cannot be null or empty strings

### Data Types
- UUIDs must be valid UUID format
- Dates are Unix timestamps
- Numbers must be within reasonable ranges

## 🚨 Error Codes

Common error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Access denied to resource",
    "code": "FORBIDDEN"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_ERROR"
  }
}
```

## 🔄 Rate Limiting

API endpoints are subject to rate limiting:

- **General endpoints**: 100 requests per minute per user
- **AI endpoints**: 10 requests per minute per organization
- **File uploads**: 5 requests per minute per user
- **Enrichment**: Limited by Apollo.io API quotas

## 📊 Monitoring

All API requests are logged with:
- Request/response timing
- Error rates and types
- User and organization context
- Third-party service status

## 🧪 Testing

### Development Environment
- Base URL: `http://localhost:3200/api`
- Authentication: Local session cookies
- Database: Local PostgreSQL or development cloud DB

### Staging Environment
- Base URL: `https://staging.littlephilignite.com/api`
- Authentication: Staging session cookies
- Database: Staging PostgreSQL

### Production Environment
- Base URL: `https://app.littlephilignite.com/api`
- Authentication: Production session cookies
- Database: Production PostgreSQL with replicas

## 🔍 Debugging

### Request Logging
Enable detailed request logging in development:
```bash
DEBUG=api:* npm run dev
```

### Database Queries
Monitor database queries with Drizzle:
```bash
npx drizzle-kit studio
```

### Third-party Services
- **OpenAI**: Monitor usage in OpenAI dashboard
- **Resend**: Check delivery status in Resend console
- **Apollo**: Verify enrichment quotas and usage

---

## 📚 Additional Resources

- **[Database Schema](./database.md)** - Complete schema documentation
- **[Environment Setup](./environment-setup.md)** - API key configuration
- **[Deployment Guide](./deployment.md)** - Production API setup
- **[Troubleshooting](./troubleshooting.md)** - Common API issues

**Next Steps**: Review the [Database Documentation](./database.md) to understand data relationships and schema.