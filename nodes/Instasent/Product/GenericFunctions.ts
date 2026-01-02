import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export interface IInstasentProductApiCredentials {
	apiToken: string;
	projectUid: string;
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

export interface IProject {
	uid: string;
	id: string;
	name: string;
}

export interface ISegment {
	uid: string;
	name: string;
	type: string;
}

export interface ICampaign {
	id: string;
	title: string;
	campaignAt: string;
	status: string;
}

export interface IAutomation {
	id: string;
	title: string;
	status: string;
}

export interface ISmsSender {
	id: string;
	from: string;
	status: string;
}

const BASE_URL = 'https://api.instasent.com/v1';

export function getBaseUrl(): string {
	return BASE_URL;
}

export async function instasentProductApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | IDataObject[],
	qs?: IDataObject,
) {
	const credentials = await this.getCredentials('instasentProductApi') as unknown as IInstasentProductApiCredentials;
	const baseUrl = getBaseUrl();

	const options = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Authorization': `Bearer ${credentials.apiToken}`,
		} as { [key: string]: string },
		qs,
		body,
		json: true,
		// rejectUnauthorized: false,
		// strictSSL: false,
	};

	if (body) {
		options.headers['Content-Type'] = 'application/json';
	}

	try {
		return await this.helpers.request(options);
	} catch (error: any) {
		// Extract meaningful error message from HTTP errors
		if (error.response) {
			const statusCode = error.response.statusCode || error.response.status;
			const responseBody = error.response.body || error.response.data;

			let errorMessage = `HTTP ${statusCode}`;

			if (responseBody) {
				if (typeof responseBody === 'string') {
					errorMessage += `: ${responseBody}`;
				} else if (responseBody.message) {
					errorMessage += `: ${responseBody.message}`;
				} else if (responseBody.error) {
					errorMessage += `: ${responseBody.error}`;
				} else if (responseBody.errors && Array.isArray(responseBody.errors)) {
					errorMessage += `: ${responseBody.errors.join(', ')}`;
				} else {
					errorMessage += `: ${JSON.stringify(responseBody)}`;
				}
			}

			const httpError = new Error(errorMessage);
			(httpError as any).httpCode = statusCode;
			(httpError as any).response = responseBody;
			throw httpError;
		}
		throw error;
	}
}

export async function instasentProductApiRequestForProject(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | IDataObject[],
	qs?: IDataObject,
) {
	const credentials = await this.getCredentials('instasentProductApi') as unknown as IInstasentProductApiCredentials;
	const projectEndpoint = `/project/${credentials.projectUid}${endpoint}`;
	return instasentProductApiRequest.call(this, method, projectEndpoint, body, qs);
}

export function getDatasourceId(datasourceId?: string): string {
	return datasourceId && datasourceId.trim() !== '' ? datasourceId : 'dsapi';
}

/**
 * Builds Audience QueryFilter body from user-provided QueryFilter
 * @param queryFilterJson - User-provided QueryFilter JSON string (whole object with root property)
 * @param limit - Limit from UI (overrides any limit in QueryFilter)
 * @param cursor - Cursor from UI (overrides any cursor in QueryFilter)
 * @returns Complete QueryFilter body object
 */
export function buildAudienceQueryFilter(
	queryFilterJson: string,
	limit?: number,
	cursor?: string,
): IDataObject {
	const body: IDataObject = {};

	// Parse user-provided QueryFilter
	if (queryFilterJson && queryFilterJson.trim() !== '' && queryFilterJson.trim() !== '{}') {
		try {
			const userFilter = JSON.parse(queryFilterJson);
			// Use the user's QueryFilter as-is
			Object.assign(body, userFilter);
		} catch {
			// Invalid JSON, use empty object
		}
	}

	// Override limit and cursor with UI values (UI takes precedence)
	if (limit !== undefined) {
		body.limit = limit;
	}
	if (cursor) {
		body.cursor = cursor;
	}

	return body;
}

/**
 * Builds Event QueryFilter body from user-provided QueryFilter
 * @param queryFilterJson - User-provided QueryFilter JSON string (whole object with root property)
 * @param limit - Limit from UI (overrides any limit in QueryFilter)
 * @param cursor - Cursor from UI (overrides any cursor in QueryFilter)
 * @returns Complete QueryFilter body object
 */
export function buildEventQueryFilter(
	queryFilterJson: string,
	limit?: number,
	cursor?: string,
): IDataObject {
	const body: IDataObject = {};

	// Parse user-provided QueryFilter
	if (queryFilterJson && queryFilterJson.trim() !== '' && queryFilterJson.trim() !== '{}') {
		try {
			const userFilter = JSON.parse(queryFilterJson);
			// Use the user's QueryFilter as-is
			Object.assign(body, userFilter);
		} catch {
			// Invalid JSON, use empty object
		}
	}

	// Override limit and cursor with UI values (UI takes precedence)
	if (limit !== undefined) {
		body.limit = limit;
	}
	if (cursor) {
		body.cursor = cursor;
	}

	return body;
}

/**
 * Builds QueryFilter query parameters from simple filters and/or advanced QueryFilter JSON
 * @param simpleFilters - Simple key-value filters (e.g., { status: 'active' })
 * @param queryFilterJson - Advanced QueryFilter JSON string (optional)
 * @param start - Pagination start (required if limit is provided)
 * @param limit - Pagination limit
 * @param sort - Sort string (e.g., 'name:asc')
 * @returns Query string parameters object
 */
export function buildQueryFilter(
	simpleFilters?: IDataObject,
	queryFilterJson?: string,
	start?: number,
	limit?: number,
	sort?: string,
): IDataObject {
	const qs: IDataObject = {};

	// Add pagination (both start and limit are required together)
	if (limit !== undefined) {
		qs._start = start !== undefined ? start : 0;
		qs._limit = limit;
	}

	// Add sorting
	if (sort) {
		qs._sort = sort;
	}

	// Add simple filters as URL query parameters (field_operator=value format)
	if (simpleFilters) {
		for (const [key, value] of Object.entries(simpleFilters)) {
			if (value !== undefined && value !== null && value !== '') {
				// If it's already in field_operator format, use as-is
				if (key.includes('_')) {
					qs[key] = value;
				} else {
					// Default to 'eq' operator
					qs[`${key}_eq`] = value;
				}
			}
		}
	}

	// Add advanced QueryFilter JSON if provided
	if (queryFilterJson && queryFilterJson.trim() !== '' && queryFilterJson.trim() !== '{}') {
		try {
			const parsed = JSON.parse(queryFilterJson);
			// Only add if it's not an empty object
			if (Object.keys(parsed).length > 0) {
				// Send QueryFilter via _q parameter
				qs._q = JSON.stringify(parsed);
			}
		} catch (error) {
			// Invalid JSON, ignore
			console.warn('Invalid QueryFilter JSON, ignoring:', error);
		}
	}

	return qs;
}
