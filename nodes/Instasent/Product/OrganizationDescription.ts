import { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get organization info including token details and projects list. If token has ACCOUNT_READ scope, also includes account/funds information.',
				action: 'Get organization info',
			},
		],
		default: 'get',
	},
];

export const organizationFields: INodeProperties[] = [];
