import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get project information',
				action: 'Get project info',
			},
			{
				name: 'Get Attributes',
				value: 'getAttributes',
				description: 'Get project attribute specifications',
				action: 'Get attribute specs',
			},
			{
				name: 'Get Event Types',
				value: 'getEventTypes',
				description: 'Get available event type specifications',
				action: 'Get event type specs',
			},
			{
				name: 'Get Event Parameters',
				value: 'getEventParameters',
				description: 'Get parameter specifications for a specific event type',
				action: 'Get event parameter specs',
			},
		],
		default: 'get',
	},
];

export const projectFields: INodeProperties[] = [
	{
		displayName: 'Event Type Name or ID',
		name: 'eventType',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getEventTypes',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['getEventParameters'],
			},
		},
		default: '',
		description: 'The event type to get parameters for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
];
