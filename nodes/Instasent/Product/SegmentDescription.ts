import { INodeProperties } from 'n8n-workflow';
import { queryFilterFields } from './QueryFilterFields';

export const segmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['segment'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all segments',
				action: 'List segments',
			},
			{
				name: 'List Dynamic',
				value: 'listDynamic',
				description: 'List dynamic segments that don\'t require parameters',
				action: 'List dynamic segments',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific segment',
				action: 'Get segment',
			},
		],
		default: 'list',
	},
];

export const segmentFields: INodeProperties[] = [
	// Segment UID (for get)
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
				resource: ['segment'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The segment to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	// Segment parameter (for dynamic segments)
	{
		displayName: 'Parameter',
		name: 'segmentParameter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'For dynamic segments, the parameter value (e.g., "val1|val2")',
	},
	// Pagination for list
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['segment'],
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
				resource: ['segment'],
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
				resource: ['segment'],
				operation: ['list'],
			},
		},
	})),
];
