import { INodeProperties } from 'n8n-workflow';
import { queryFilterFields } from './QueryFilterFields';

export const smsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sms'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an SMS message by ID. Requires PROJECT_DIRECT_READ scope.',
				action: 'Get SMS',
			},
			{
				name: 'List by Audience',
				value: 'listByAudience',
				description: 'List SMS messages for an audience contact. Requires PROJECT_DIRECT_READ scope.',
				action: 'List SMS by audience',
			},
			{
				name: 'List by Automation',
				value: 'listByAutomation',
				description: 'List SMS messages for an automation. Requires PROJECT_DIRECT_READ scope.',
				action: 'List SMS by automation',
			},
			{
				name: 'List by Campaign',
				value: 'listByCampaign',
				description: 'List SMS messages for a campaign. Requires PROJECT_DIRECT_READ scope.',
				action: 'List SMS by campaign',
			},
			{
				name: 'List by Send',
				value: 'listBySend',
				description: 'List SMS messages by Send entity. Requires PROJECT_DIRECT_READ scope.',
				action: 'List SMS by send',
			},
			{
				name: 'List Direct',
				value: 'listDirect',
				description: 'List direct SMS messages (not part of campaigns/automations). Requires PROJECT_DIRECT_READ scope.',
				action: 'List direct SMS',
			},
			{
				name: 'Send Direct SMS',
				value: 'createDirect',
				description: 'Send a direct SMS message to an audience contact. Requires PROJECT_DIRECT_WRITE scope.',
				action: 'Send direct SMS',
			},
		],
		default: 'get',
	},
];

export const smsFields: INodeProperties[] = [
	// SMS ID (for get)
	{
		displayName: 'SMS ID',
		name: 'smsId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the SMS message to retrieve',
	},
	// Audience ID (for listByAudience and createDirect)
	{
		displayName: 'Audience ID or Phone',
		name: 'audienceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listByAudience', 'createDirect'],
			},
		},
		default: '',
		description:
			'The audience contact ID or phone number. Phone numbers will be normalized automatically, International code is mandatory.',
	},
	// Send ID (for listBySend)
	{
		displayName: 'Send ID',
		name: 'sendId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listBySend'],
			},
		},
		default: '',
		description: 'The Send entity ID',
	},
	// Campaign ID (for listByCampaign)
	{
		displayName: 'Campaign Name or ID',
		name: 'campaignId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCampaigns',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listByCampaign'],
			},
		},
		default: '',
		description:
			'The campaign to list SMS for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Option Index',
		name: 'optionIdx',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listByCampaign'],
			},
		},
		default: 0,
		description: 'The campaign option index (0-indexed). Defaults to 0 (first option).',
	},
	// Automation ID (for listByAutomation)
	{
		displayName: 'Automation Name or ID',
		name: 'automationId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAutomations',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listByAutomation'],
			},
		},
		default: '',
		description:
			'The automation to list SMS for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Message Index',
		name: 'messageIdx',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listByAutomation'],
			},
		},
		default: 0,
		description: 'The automation message index (0-indexed). Defaults to 0 (first message).',
	},
	// Sender ID (for createDirect)
	{
		displayName: 'Sender Name or ID',
		name: 'senderId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSmsSenders',
		},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['createDirect'],
			},
		},
		default: '',
		description:
			'The SMS sender to use. Select "Default" to use the project\'s default sender. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	// SMS Text (for createDirect)
	{
		displayName: 'Message Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['createDirect'],
			},
		},
		default: '',
		description: 'The SMS message text to send',
	},
	{
		displayName: 'Allow Unicode',
		name: 'allowUnicode',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['createDirect'],
			},
		},
		default: false,
		description:
			'Whether to allow Unicode characters in the SMS. Enabling this may reduce the maximum character count.',
	},
	// Tracking Term (UTM Term) for createDirect
	{
		displayName: 'Tracking Term (UTM Term - Optional)',
		name: 'utmTerm',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['createDirect'],
			},
		},
		default: '',
		typeOptions: {
			maxLength: 40,
		},
		description:
			'Optional tracking term (up to 40 chars) to tag all events related to this message (delivery, clicks, unsubscribes, sales, etc.). Useful for differentiating event sources (e.g., "repurchase" for repurchase reminders).',
	},
	// Tracking Term (UTM Term) for listDirect
	{
		displayName: 'Tracking Term (UTM Term - Optional)',
		name: 'listDirectUtmTerm',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listDirect'],
			},
		},
		default: '',
		typeOptions: {
			maxLength: 40,
		},
		description: 'Optional tracking term (up to 40 chars) to filter direct SMS messages by the tracking term used when sending them',
	},
	// Pagination for list operations
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: [
					'listByAudience',
					'listBySend',
					'listByCampaign',
					'listByAutomation',
					'listDirect',
				],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: [
					'listByAudience',
					'listBySend',
					'listByCampaign',
					'listByAutomation',
					'listDirect',
				],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	...queryFilterFields.map((field) => ({
		...field,
		default: JSON.stringify(
			{ filter: [{ field: 'status', operator: 'in', value: ['delivered', 'sent', ['enqueued']] }] },
			null,
			2,
		),
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: [
					'listByAudience',
					'listBySend',
					'listByCampaign',
					'listByAutomation',
					'listDirect',
				],
			},
		},
	})),
];
