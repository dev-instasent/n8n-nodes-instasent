import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export interface IInstasentIngestApiCredentials {
	projectId: string;
	datasourceId: string;
	apiToken: string;
}

export interface IAttributeSpec {
	uid: string;
	displayLabel: string;
	description: string;
	dataType: string;
	multivalue: number;
	requiredInWebhook: boolean;
	readOnly: boolean;
	visible: boolean;
	custom: boolean;
}

export interface IEventSpec {
	uid: string;
	name: string;
	emoji: string;
}

export interface IEventParameterSpec {
	parameter: string;
	title: string;
	description: string;
	dataType: string;
	required: boolean;
	multiValue: number;
}

export function getBaseUrl(credentials: IInstasentIngestApiCredentials): string {
	return `https://api.instasent.com/v1/project/${credentials.projectId}/datasource/${credentials.datasourceId}`;
}

export async function instasentApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | IDataObject[],
	qs?: IDataObject,
) {
	const credentials = await this.getCredentials('instasentIngestApi') as unknown as IInstasentIngestApiCredentials;
	const baseUrl = getBaseUrl(credentials);

	const options = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Authorization': `Bearer ${credentials.apiToken}`,
		} as { [key: string]: string },
		qs,
		body,
		json: true,
	};

	if (body) {
		options.headers['Content-Type'] = 'application/json';
	}

	return this.helpers.request(options);
}
