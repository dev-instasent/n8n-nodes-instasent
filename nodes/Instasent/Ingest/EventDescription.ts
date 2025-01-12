import { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an event for a contact',
				action: 'Create an event',
			},
		],
		default: 'create',
	},
];

export const eventFields: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Unique identifier of the user',
	},
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Unique identifier for this event. Used for deduplication.',
	},
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
				resource: ['event'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},
	{
		displayName: 'Event Date',
		name: 'eventDate',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Date and time when the event occurred (ISO 8601 format YYYY-MM-DDTHH:MM:SS.SSSZ)',
	},
	{
		displayName: 'Event Parameters',
		name: 'eventParameters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			loadOptionsMethod: 'getEventParameters',
			loadOptionsDependsOn: ['eventType'],
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'parameters',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Parameter Name or ID',
						name: 'name',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getEventParameters',
							loadOptionsDependsOn: ['eventType'],
						},
						default: '',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the parameter',
					},
				],
			},
		],
		description: 'Parameters for the selected event type',
	},
];
