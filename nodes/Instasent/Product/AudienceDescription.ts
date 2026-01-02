import { INodeProperties } from 'n8n-workflow';

export const audienceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['audience'],
			},
		},
		options: [
			{
				name: 'Delete Contact',
				value: 'delete-contact',
				description:
					'Deletes a contact from the audience permanently. Requires PROJECT_AUDIENCE_WRITE scope.',
				action: 'Delete contact permanently',
			},
			{
				name: 'Email Subscribe',
				value: 'email-subscribe',
				description:
					'Subscribe a contact to email communications. Requires PROJECT_AUDIENCE_WRITE scope.',
				action: 'Subscribe contact to email',
			},
			{
				name: 'Email Unsubscribe',
				value: 'email-unsubscribe',
				description:
					'Unsubscribe a contact from email communications. Requires PROJECT_AUDIENCE_WRITE scope.',
				action: 'Unsubscribe contact from email',
			},
			{
				name: 'Get by Audience ID',
				value: 'getById',
				description: 'Get audience contact by internal audience ID',
				action: 'Get contact by audience ID',
			},
			{
				name: 'Get by Unique Attribute',
				value: 'get',
				description: 'Get audience contact by any of the project unique attributes',
				action: 'Get contact by any of the unique attributes',
			},
			{
				name: 'Get Contact Events',
				value: 'getEvents',
				description:
					'Get latest events for an audience contact classified by event type (requires PROJECT_AUDIENCE_DATA_EVENTS scope)',
				action: 'Get contact events',
			},
			{
				name: 'Scroll',
				value: 'scroll',
				description:
					'Scroll through audience contacts using cursor-based pagination. Requires PROJECT_AUDIENCE_LIST scope.',
				action: 'Scroll audience contacts',
			},
			{
				name: 'Scroll by Segment',
				value: 'scrollBySegment',
				description:
					'Scroll through contacts in a specific segment. Requires PROJECT_AUDIENCE_LIST scope.',
				action: 'Scroll segment contacts',
			},
			{
				name: 'Scroll Events',
				value: 'scrollEvents',
				description:
					'Scroll through audience events using cursor-based pagination. Requires AUDIENCE_DATA_EVENTS scope.',
				action: 'Scroll audience events',
			},
			{
				name: 'Search',
				value: 'search',
				description:
					'Search audience contacts using our AudienceQueryFilter. Max 50 results, no pagination allowed.',
				action: 'Search audience contacts',
			},
			{
				name: 'Search by Email',
				value: 'searchByEmail',
				description: 'Search for audience contacts by email address (returns up to 10 matches)',
				action: 'Search contacts by email',
			},
			{
				name: 'Search by Phone',
				value: 'searchByPhone',
				description: 'Search for audience contacts by phone number (returns up to 10 matches)',
				action: 'Search contacts by phone',
			},
			{
				name: 'Search Events',
				value: 'searchEvents',
				description:
					'Search audience events using our EventsQueryFilter. Max 50 results, no pagination. Requires AUDIENCE_DATA_EVENTS scope.',
				action: 'Search audience events',
			},
			{
				name: 'SMS Subscribe',
				value: 'sms-subscribe',
				description:
					'Subscribe a contact to SMS communications. Requires PROJECT_AUDIENCE_WRITE scope.',
				action: 'Subscribe contact to SMS',
			},
			{
				name: 'SMS Unsubscribe',
				value: 'sms-unsubscribe',
				description:
					'Unsubscribe a contact from SMS communications. Requires PROJECT_AUDIENCE_WRITE scope.',
				action: 'Unsubscribe contact from SMS',
			},
		],
		default: 'get',
	},
];

export const audienceFields: INodeProperties[] = [
	// Get by User ID
	{
		displayName: 'User ID / Unique Value',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The user ID to search for across unique attributes (email, phone, etc.)',
	},
	// Get by Audience ID
	{
		displayName: 'Audience ID',
		name: 'audienceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['getById', 'getEvents'],
			},
		},
		default: '',
		description: 'The internal audience contact ID',
	},
	// Search by Phone
	{
		displayName: 'Phone Number',
		name: 'userPhone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['searchByPhone'],
			},
		},
		default: '',
		description: 'The phone number to search for (will be normalized automatically)',
	},
	// Search by Email
	{
		displayName: 'Email Address',
		name: 'userEmail',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['searchByEmail'],
			},
		},
		default: '',
		description: 'The email address to search for',
	},
	// Search - Audience QueryFilter JSON (Elasticsearch-based)
	{
		displayName: 'Audience Query Filter (JSON)',
		name: 'queryFilterJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['search', 'scroll', 'scrollBySegment'],
			},
		},
		default: JSON.stringify({
			root: {
				type: 'group',
				join: 'and',
				children: [
					{
						type: 'attribute_condition',
						key: '_phone_mobile',
						operator: 'exists',
						values: [],
					},
				],
			},
			sortField: '_date_updated',
			sortAsc: false,
		}, null, 2),
		description: 'The AudienceQueryFilter as JSON. Must be an object with a root property. You can provide the full QueryFilter object with properties like root, sortField, sortAsc, etc. See <a href="https://docs.instasent.com">Instasent documentation</a> for AudienceQueryFilter syntax.',
	},
	// Search Events - Event QueryFilter JSON (Elasticsearch-based)
	{
		displayName: 'Event Query Filter (JSON)',
		name: 'queryFilterJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['searchEvents', 'scrollEvents'],
			},
		},
		default: JSON.stringify({
			root: {
				type: 'group',
				join: 'and',
				children: [
					{
						type: 'event_condition',
						key: 'event-type',
						operator: 'matches-string',
						values: ['update'],
					},
				],
			},
			sortField: 'created-at',
			sortAsc: false,
		}, null, 2),
		description: 'The EventQueryFilter as JSON. Must be an object with a root property. You can provide the full AudienceQueryFilter object with properties like root, sortField, sortAsc, etc. See <a href="https://docs.instasent.com">Instasent documentation</a> for EventQueryFilter syntax.',
	},
	// Limit
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['search', 'scroll', 'scrollBySegment', 'searchEvents', 'scrollEvents'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	// Cursor (for scroll operations)
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['scroll', 'scrollBySegment', 'scrollEvents'],
			},
		},
		default: '',
		description: 'Cursor for pagination. Leave empty for first page, or pass the cursor from the previous response.',
	},
	// Segment UID (for scroll by segment)
	{
		displayName: 'Segment Name or ID',
		name: 'segmentUid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSegments',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['scrollBySegment'],
			},
		},
		default: '',
		description: 'The segment to scroll through. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	// Segment parameter (for dynamic segments)
	{
		displayName: 'Segment Parameter',
		name: 'segmentParameter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['scrollBySegment'],
			},
		},
		default: '',
		description: 'For dynamic segments, the parameter value (e.g., "val1|val2")',
	},
	// Audience ID for stream actions
	{
		displayName: 'Audience ID',
		name: 'streamAudienceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['sms-subscribe', 'sms-unsubscribe', 'email-subscribe', 'email-unsubscribe', 'delete-contact'],
			},
		},
		default: '',
		description: 'The audience contact ID',
	},
	// Reason for unsubscribe actions
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['sms-unsubscribe', 'email-unsubscribe'],
			},
		},
		default: '',
		description: 'Reason for unsubscription',
	},
	// UTM Source
	{
		displayName: 'UTM Source',
		name: 'utmSource',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['sms-unsubscribe', 'email-unsubscribe'],
			},
		},
		default: '',
		description: 'UTM source parameter for tracking',
	},
	// UTM Medium
	{
		displayName: 'UTM Medium',
		name: 'utmMedium',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['sms-unsubscribe', 'email-unsubscribe'],
			},
		},
		default: '',
		description: 'UTM medium parameter for tracking',
	},
	// UTM Campaign
	{
		displayName: 'UTM Campaign',
		name: 'utmCampaign',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['sms-unsubscribe', 'email-unsubscribe'],
			},
		},
		default: '',
		description: 'UTM campaign parameter for tracking',
	},
	// Sync flag for stream actions
	{
		displayName: 'Sync',
		name: 'sync',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['audience'],
				operation: ['sms-subscribe', 'sms-unsubscribe', 'email-subscribe', 'email-unsubscribe', 'delete-contact'],
			},
		},
		description: 'Whether to process synchronously instead of queuing. Only enable when you need immediate processing.',
	},
];
