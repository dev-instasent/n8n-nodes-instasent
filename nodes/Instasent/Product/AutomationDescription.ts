import { INodeProperties } from 'n8n-workflow';
import { queryFilterFields } from './QueryFilterFields';

export const automationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['automation'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all automations. Requires PROJECT_AUTOMATION_READ scope.',
				action: 'List automations',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific automation by ID. Requires PROJECT_AUTOMATION_READ scope.',
				action: 'Get automation',
			},
		],
		default: 'list',
	},
];

export const automationFields: INodeProperties[] = [
	// Automation ID (for get)
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
				resource: ['automation'],
				operation: ['get'],
			},
		},
		default: '',
		description:
			'The automation to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	// Pagination for list
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['automation'],
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
				resource: ['automation'],
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
	// Filters
	...queryFilterFields.map((field) => ({
		...field,
		default: JSON.stringify(
			{ filter: [{ field: 'status', operator: 'in', value: ['active'] }] },
			null,
			2,
		),
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['list'],
			},
		},
	})),
];
