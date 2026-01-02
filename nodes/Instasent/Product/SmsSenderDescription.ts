import { INodeProperties } from 'n8n-workflow';
import { queryFilterFields } from './QueryFilterFields';

export const smsSenderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['smsSender'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all SMS senders for the project',
				action: 'List SMS senders',
			},
		],
		default: 'list',
	},
];

export const smsSenderFields: INodeProperties[] = [
	// Pagination for list
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['smsSender'],
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
				resource: ['smsSender'],
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
	...queryFilterFields.map(field => ({
		...field,
		displayOptions: {
			show: {
				resource: ['smsSender'],
				operation: ['list'],
			},
		},
	})),
];
