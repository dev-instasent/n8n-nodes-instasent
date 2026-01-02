# n8n-nodes-instasent

This is an n8n community node. It lets you use Instasent in your n8n workflows.

Instasent is a customer data platform that allows you to collect, manage, and analyze customer data in real-time. This package provides two integration nodes:

- **Instasent Product** - Full access to projects, audiences, segments, campaigns, automations, and SMS messaging
- **Instasent Data Source** - High-volume data ingestion for contacts and events

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Run in development:

Modify the endpoints so it targets the dev env and enforce no-certificate check with:

	NODE_TLS_REJECT_UNAUTHORIZED=0 n8n-node dev

## Nodes

### Instasent Product

The main integration node for interacting with Instasent projects. Use this for:

- Reading project information and specifications
- Managing audience contacts (search, get, scroll)
- Working with segments, campaigns, and automations
- Sending / Reading SMS messages
- Ingesting contacts and events via the Data Source stream

#### Resources & Operations

| Resource | Operations |
|----------|------------|
| **Organization** | Get (includes account/funds info if token has appropriate scope) |
| **Project** | Get info, Get attributes, Get event types, Get event parameters |
| **Audience** | Get by user ID, Get by audience ID, Search by phone, Search by email, Get events, Search, Scroll, Scroll by segment, Search events, Scroll events |
| **Data Source Stream** | Get stream, Get stream specs, Get stats, Get contact, Push contacts, Push events, Delete contact |
| **Segment** | List, List dynamic, Get |
| **Campaign** | List, Get |
| **Automation** | List, Get |
| **SMS Sender** | List |
| **SMS** | Get, List by audience, List by send, List by campaign, List by automation, List direct, Create direct |

#### Credentials

You need the following credentials for the **Instasent Product API**:

- **Project UID** - Your Instasent project unique identifier (found in project settings)
- **API Token** - Your Product API authentication token (create one in your project settings)

> **Note:** To use the Data Source Stream operations (ingestion), ensure you have created an API datasource in your Instasent project. If you leave the Data Source ID empty, the system will automatically use the first available API datasource.

---

### Instasent Data Source

A specialized node for high-volume data ingestion into an Instasent API Data Source. Use this when you need dedicated datasource-level access for:

- Creating or updating contacts
- Sending events
- Deleting contacts

#### Operations

| Resource | Operations |
|----------|------------|
| **Contact** | Add/Update, Delete |
| **Event** | Create |

#### Credentials

You need the following credentials for the **Instasent Data Source API**:

- **Project UID** - Your Instasent project unique identifier
- **Data Source ID** - The specific datasource identifier within your project
- **API Token** - Your Data Source API authentication token (webhook token)

To get these credentials, add an n8n Data Source to your Instasent project. You can find the credentials in the Setup tab.

## When to Use Which Node

| Use Case | Recommended Node |
|----------|------------------|
| Get organization/project info | Instasent Product |
| Send SMS messages | Instasent Product |
| Read SMS messages | Instasent Product |
| Read audience contacts | Instasent Product |
| List campaigns/automations | Instasent Product |
| High-volume contact/event ingestion | Either (Product has also access to Data Source ingestion operations) |
| Dedicated Data Source access | Instasent Data Source (No access to project resources) |

## Compatibility

- Requires n8n version >= 1.0.0
- Node.js >= 18.10

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Instasent Documentation](https://docs.instasent.com/)
- [Instasent Help Center](https://help.instasent.com/)
