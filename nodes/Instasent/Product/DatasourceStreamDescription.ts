import { INodeProperties } from 'n8n-workflow';

export const datasourceStreamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
			},
		},
		options: [
			{
				name: 'Delete Contact',
				value: 'deleteContact',
				description: 'Deletes a contact from the Data Source Stream',
				action: 'Delete contact',
			},
			{
				name: 'Get Contact',
				value: 'getContact',
				description: 'Get a specific contact from the Data Source Stream',
				action: 'Get stream contact',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				description: 'Get statistics for the datasource',
				action: 'Get datasource stats',
			},
			{
				name: 'Get Stream',
				value: 'getStream',
				description: 'Get stream information for a datasource',
				action: 'Get stream info',
			},
			{
				name: 'Get Stream Specs',
				value: 'getStreamSpecs',
				description: 'Get specifications for the stream (attributes, events)',
				action: 'Get stream specs',
			},
			{
				name: 'Push Contacts',
				value: 'pushContacts',
				description: 'Push contacts to the Data Source Stream',
				action: 'Push contacts',
			},
			{
				name: 'Push Events',
				value: 'pushEvents',
				description: 'Push events to the Data Source Stream',
				action: 'Push events',
			},
		],
		default: 'getStream',
	},
];

export const datasourceStreamFields: INodeProperties[] = [
	// Data Source ID (optional, defaults to "dsapi")
	{
		displayName: 'Data Source ID (Optional)',
		name: 'datasourceId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
			},
		},
		default: '',
		description: 'The Data Source ID. Leave empty to use "dsapi" which auto-resolves to the first available API datasource. To use ingestion capabilities, ensure you have created an API datasource in your project.',
	},
	// Spec type (for getStreamSpecs)
	{
		displayName: 'Spec Type',
		name: 'specType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['getStreamSpecs'],
			},
		},
		options: [
			{
				name: 'Attributes',
				value: 'attributes',
			},
			{
				name: 'Events',
				value: 'events',
			},
			{
				name: 'Event Parameters',
				value: 'event-parameters',
			},
		],
		default: 'attributes',
		description: 'The type of specifications to retrieve',
	},
	// Event type (for event-parameters spec)
	{
		displayName: 'Event Type',
		name: 'specEventType',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['getStreamSpecs'],
				specType: ['event-parameters'],
			},
		},
		default: '',
		description: 'The event type to get parameters for',
	},
	// User ID (for getContact and deleteContact)
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['getContact', 'deleteContact'],
			},
		},
		default: '',
		description: 'The user ID of the contact',
	},
	// Contact properties (for pushContacts)
	{
		displayName: 'User ID',
		name: 'contactUserId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushContacts'],
			},
		},
		default: '',
		description: 'The unique identifier for the contact',
	},
	{
		displayName: 'Contact Properties',
		name: 'contactProperties',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushContacts'],
			},
		},
		default: {},
		options: [
			{
				name: 'property',
				displayName: 'Property',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'field',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getStreamAttributes',
							loadOptionsDependsOn: ['datasourceId'],
						},
						default: '',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to set',
					},
				],
			},
		],
		description: 'The properties to set for the contact',
	},
	{
		displayName: 'Sync',
		name: 'sync',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushContacts', 'pushEvents'],
			},
		},
		description: 'Whether to process synchronously instead of queuing. Only enable when you need immediate processing.',
	},
	// Event properties (for pushEvents)
	{
		displayName: 'User ID',
		name: 'eventUserId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushEvents'],
			},
		},
		default: '',
		description: 'The unique identifier for the contact',
	},
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushEvents'],
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
			loadOptionsMethod: 'getStreamEventTypes',
			loadOptionsDependsOn: ['datasourceId'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushEvents'],
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
				resource: ['datasourceStream'],
				operation: ['pushEvents'],
			},
		},
		default: '',
		description: 'Date and time when the event occurred (ISO 8601 format YYYY-MM-DDTHH:MM:SS.SSSZ). Defaults to current time.',
	},
	{
		displayName: 'Event Parameters',
		name: 'eventParameters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['datasourceStream'],
				operation: ['pushEvents'],
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
							loadOptionsMethod: 'getStreamEventParameters',
							loadOptionsDependsOn: ['datasourceId', 'eventType'],
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
