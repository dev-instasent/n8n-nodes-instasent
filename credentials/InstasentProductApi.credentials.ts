import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InstasentProductApi implements ICredentialType {
	name = 'instasentProductApi';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = 'Instasent Product API';
	documentationUrl = 'https://docs.instasent.com/';
	icon = 'file:instasent.svg' as any;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'Your Instasent Product API Bearer Token. Create one in your Instasent project settings.',
		},
		{
			displayName: 'Project UID',
			name: 'projectUid',
			type: 'string',
			typeOptions: {
				password: false,
			},
			default: '',
			required: true,
			description:
				'The UID of the project to interact with. Go to your Instasent project settings to find it.',
		}
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
			baseURL: '=https://api.instasent.com/v1/project/{{$credentials.projectUid}}',
			method: 'GET',
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
			skipSslCertificateValidation: true,
		},
	};
}
