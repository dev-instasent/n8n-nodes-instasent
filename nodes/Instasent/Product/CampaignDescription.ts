import { INodeProperties } from 'n8n-workflow';
import { queryFilterFields } from './QueryFilterFields';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all campaigns. Requires PROJECT_CAMPAIGN_READ scope.',
				action: 'List campaigns',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific campaign by ID. Requires PROJECT_CAMPAIGN_READ scope.',
				action: 'Get campaign',
			},
		],
		default: 'list',
	},
];

export const campaignFields: INodeProperties[] = [
	// Campaign ID (for get)
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
				resource: ['campaign'],
				operation: ['get'],
			},
		},
		default: '',
		description:
			'The campaign to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	// Pagination for list
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['list'],
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
				resource: ['campaign'],
				operation: ['list'],
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
		default: JSON.stringify({ filter: [{ field: 'status', operator: 'in', value: ['draft', 'sent'] }] }, null, 2),
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['list'],
			},
		},
	})),
];
