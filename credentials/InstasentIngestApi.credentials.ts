import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InstasentIngestApi implements ICredentialType {
	name = 'instasentIngestApi';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = 'Instasent Data Source Api';
	documentationUrl = 'https://docs.instasent.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'string',
			typeOptions: {
				password: false,
			},
			default: '',
			required: true,
			description: 'Your Instasent Project ID',
		},
		{
			displayName: 'Datasource ID',
			name: 'datasourceId',
			type: 'string',
			typeOptions: {
				password: false,
			},
			default: '',
			required: true,
			description: 'Your Instasent Datasource ID',
		},
		{
			displayName: 'API Key',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Instasent Data Source API Bearer Token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://api.instasent.com/v1/project/{{$credentials.projectId}}/datasource/{{$credentials.datasourceId}}/stream',
			method: 'GET',
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};
}
