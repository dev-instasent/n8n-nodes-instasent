import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	buildAudienceQueryFilter,
	buildEventQueryFilter,
	buildQueryFilter,
	getDatasourceId,
	instasentProductApiRequest,
	instasentProductApiRequestForProject,
} from './GenericFunctions';

import { organizationOperations, organizationFields } from './OrganizationDescription';
import { projectOperations, projectFields } from './ProjectDescription';
import { audienceOperations, audienceFields } from './AudienceDescription';
import { datasourceStreamOperations, datasourceStreamFields } from './DatasourceStreamDescription';
import { segmentOperations, segmentFields } from './SegmentDescription';
import { campaignOperations, campaignFields } from './CampaignDescription';
import { automationOperations, automationFields } from './AutomationDescription';
import { smsSenderOperations, smsSenderFields } from './SmsSenderDescription';
import { smsOperations, smsFields } from './SmsDescription';

import {
	getProjects,
	getProjectAttributes,
	getEventTypes,
	getEventParameters,
	getSegments,
	getDynamicSegments,
	getCampaigns,
	getAutomations,
	getSmsSenders,
	getStreamAttributes,
	getStreamEventTypes,
	getStreamEventParameters,
} from './LoadOptions';

export class InstasentProduct implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instasent Product',
		name: 'instasentProduct',
		icon: {
			light: 'file:../instasent.svg',
			dark: 'file:../instasent.dark.svg',
		},
		group: ['input', 'output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Instasent projects, audiences, segments, campaigns, automations, and SMS operations',
		defaults: {
			name: 'Instasent Product',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'instasentProductApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Audience',
						value: 'audience',
						description: 'Audience contact operations',
					},
					{
						name: 'Automation',
						value: 'automation',
						description: 'Automation management',
					},
					{
						name: 'Campaign',
						value: 'campaign',
						description: 'Campaign management',
					},
					{
						name: 'Data Source Stream',
						value: 'datasourceStream',
						description: 'Ingest contacts and events via the Data Source Stream. Add an API datasource to your project to use it.',
					},
					{
						name: 'Organization',
						value: 'organization',
						description: 'Organization information and account details',
					},
					{
						name: 'Project',
						value: 'project',
						description: 'Project information and specifications',
					},
					{
						name: 'Segment',
						value: 'segment',
						description: 'Segment management',
					},
					{
						name: 'SMS',
						value: 'sms',
						description: 'SMS message operations',
					},
					{
						name: 'SMS Sender',
						value: 'smsSender',
						description: 'SMS sender management',
					},
				],
				default: 'organization',
				required: true,
			},
			...organizationOperations,
			...organizationFields,
			...projectOperations,
			...projectFields,
			...audienceOperations,
			...audienceFields,
			...datasourceStreamOperations,
			...datasourceStreamFields,
			...segmentOperations,
			...segmentFields,
			...campaignOperations,
			...campaignFields,
			...automationOperations,
			...automationFields,
			...smsSenderOperations,
			...smsSenderFields,
			...smsOperations,
			...smsFields,
		],
	};

	methods = {
		loadOptions: {
			getProjects,
			getProjectAttributes,
			getEventTypes,
			getEventParameters,
			getSegments,
			getDynamicSegments,
			getCampaigns,
			getAutomations,
			getSmsSenders,
			getStreamAttributes,
			getStreamEventTypes,
			getStreamEventParameters,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let response: IDataObject | IDataObject[] = {};

				// ==================== ORGANIZATION ====================
				if (resource === 'organization') {
					if (operation === 'get') {
						response = await instasentProductApiRequest.call(this, 'GET', '/');
					}
				}

				// ==================== PROJECT ====================
				else if (resource === 'project') {
					if (operation === 'get') {
						response = await instasentProductApiRequestForProject.call(this, 'GET', '');
					} else if (operation === 'getAttributes') {
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/specs/attributes');
					} else if (operation === 'getEventTypes') {
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/specs/events');
					} else if (operation === 'getEventParameters') {
						const eventType = this.getNodeParameter('eventType', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/specs/events/${eventType}`);
					}
				}

				// ==================== AUDIENCE ====================
				else if (resource === 'audience') {
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/audience/user/${encodeURIComponent(userId)}`);
					} else if (operation === 'getById') {
						const audienceId = this.getNodeParameter('audienceId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/audience/${encodeURIComponent(audienceId)}`);
					} else if (operation === 'searchByPhone') {
						const userPhone = this.getNodeParameter('userPhone', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/audience/search/phone/${encodeURIComponent(userPhone)}`);
					} else if (operation === 'searchByEmail') {
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/audience/search/email/${encodeURIComponent(userEmail)}`);
					} else if (operation === 'getEvents') {
						const audienceId = this.getNodeParameter('audienceId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/audience/${encodeURIComponent(audienceId)}/events`);
					} else if (operation === 'search') {
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i) as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const body = buildAudienceQueryFilter(queryFilterJson, Math.min(limit, 50));
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/search', body);
					} else if (operation === 'scroll') {
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i) as string;
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						const body = buildAudienceQueryFilter(queryFilterJson, Math.min(limit, 100), cursor);
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/scroll', body);
					} else if (operation === 'scrollBySegment') {
						const segmentUid = this.getNodeParameter('segmentUid', i) as string;
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i) as string;
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						const segmentParameter = this.getNodeParameter('segmentParameter', i, '') as string;
						const body = buildAudienceQueryFilter(queryFilterJson, Math.min(limit, 100), cursor);
						const qs: IDataObject = {};
						if (segmentParameter) {
							qs.parameter = segmentParameter;
						}
						response = await instasentProductApiRequestForProject.call(this, 'POST', `/audience/segment/${encodeURIComponent(segmentUid)}/scroll`, body, qs);
					} else if (operation === 'searchEvents') {
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const body = buildEventQueryFilter(queryFilterJson, Math.min(limit, 50));
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/event/search', body);
					} else if (operation === 'scrollEvents') {
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						const body = buildEventQueryFilter(queryFilterJson, Math.min(limit, 100), cursor);
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/event/scroll', body);
					} else if (operation === 'sms-subscribe') {
						const audienceId = this.getNodeParameter('streamAudienceId', i) as string;
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const body: IDataObject = {
							audienceId,
						};
						const qs: IDataObject = {};
						if (sync) qs._sync = true;
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/stream/sms-subscribe', body, qs);
					} else if (operation === 'sms-unsubscribe') {
						const audienceId = this.getNodeParameter('streamAudienceId', i) as string;
						const reason = this.getNodeParameter('reason', i, '') as string;
						const utmSource = this.getNodeParameter('utmSource', i, '') as string;
						const utmMedium = this.getNodeParameter('utmMedium', i, '') as string;
						const utmCampaign = this.getNodeParameter('utmCampaign', i, '') as string;
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const body: IDataObject = {
							audienceId,
						};
						if (reason) body.reason = reason;
						if (utmSource) body['utm-source'] = utmSource;
						if (utmMedium) body['utm-medium'] = utmMedium;
						if (utmCampaign) body['utm-campaign'] = utmCampaign;
						const qs: IDataObject = {};
						if (sync) qs._sync = true;
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/stream/sms-unsubscribe', body, qs);
					} else if (operation === 'email-subscribe') {
						const audienceId = this.getNodeParameter('streamAudienceId', i) as string;
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const body: IDataObject = {
							audienceId,
						};
						const qs: IDataObject = {};
						if (sync) qs._sync = true;
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/stream/email-subscribe', body, qs);
					} else if (operation === 'email-unsubscribe') {
						const audienceId = this.getNodeParameter('streamAudienceId', i) as string;
						const reason = this.getNodeParameter('reason', i, '') as string;
						const utmSource = this.getNodeParameter('utmSource', i, '') as string;
						const utmMedium = this.getNodeParameter('utmMedium', i, '') as string;
						const utmCampaign = this.getNodeParameter('utmCampaign', i, '') as string;
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const body: IDataObject = {
							audienceId,
						};
						if (reason) body.reason = reason;
						if (utmSource) body['utm-source'] = utmSource;
						if (utmMedium) body['utm-medium'] = utmMedium;
						if (utmCampaign) body['utm-campaign'] = utmCampaign;
						const qs: IDataObject = {};
						if (sync) qs._sync = true;
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/stream/email-unsubscribe', body, qs);
					} else if (operation === 'delete-contact') {
						const audienceId = this.getNodeParameter('streamAudienceId', i) as string;
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const body: IDataObject = {
							audienceId,
						};
						const qs: IDataObject = {};
						if (sync) qs._sync = true;
						response = await instasentProductApiRequestForProject.call(this, 'POST', '/audience/stream/delete-contact', body, qs);
					}
				}

				// ==================== DATASOURCE STREAM ====================
				else if (resource === 'datasourceStream') {
					const datasourceId = getDatasourceId(this.getNodeParameter('datasourceId', i, '') as string);

					if (operation === 'getStream') {
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/datasource/${datasourceId}/stream`);
					} else if (operation === 'getStreamSpecs') {
						const specType = this.getNodeParameter('specType', i) as string;
						let endpoint = `/datasource/${datasourceId}/stream/specs/${specType}`;
						if (specType === 'event-parameters') {
							const specEventType = this.getNodeParameter('specEventType', i, '') as string;
							if (specEventType) {
								endpoint += `/${specEventType}`;
							}
						}
						response = await instasentProductApiRequestForProject.call(this, 'GET', endpoint);
					} else if (operation === 'getStats') {
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/datasource/${datasourceId}/stats`);
					} else if (operation === 'getContact') {
						const userId = this.getNodeParameter('userId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/datasource/${datasourceId}/stream/contacts/${encodeURIComponent(userId)}`);
					} else if (operation === 'pushContacts') {
						const userId = this.getNodeParameter('contactUserId', i) as string;
						const contactProperties = this.getNodeParameter('contactProperties', i) as IDataObject;
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const dryRun = this.getNodeParameter('dryRun', i, false) as boolean;
						const properties = (contactProperties.property as IDataObject[]) || [];

						const contact: { [key: string]: string } = {
							_user_id: userId,
						};

						for (const prop of properties) {
							contact[prop.field as string] = prop.value as string;
						}

						let endpoint = `/datasource/${datasourceId}/stream/contacts`;
						const queryParams: string[] = [];
						if (sync) queryParams.push('_sync');
						if (dryRun) queryParams.push('_dryRun');
						if (queryParams.length > 0) {
							endpoint += '?' + queryParams.join('&');
						}

						response = await instasentProductApiRequestForProject.call(this, 'POST', endpoint, [contact]);
					} else if (operation === 'pushEvents') {
						const userId = this.getNodeParameter('eventUserId', i) as string;
						const eventId = this.getNodeParameter('eventId', i) as string;
						const eventType = this.getNodeParameter('eventType', i) as string;
						const eventDate = this.getNodeParameter('eventDate', i, '') as string;
						const eventParameters = this.getNodeParameter('eventParameters', i) as { parameters: Array<{ name: string; value: string }> };
						const sync = this.getNodeParameter('sync', i, false) as boolean;
						const dryRun = this.getNodeParameter('dryRun', i, false) as boolean;

						const parameters: { [key: string]: string } = {};
						for (const param of eventParameters.parameters || []) {
							parameters[param.name] = param.value;
						}

						const eventData = {
							_user_id: userId,
							_event_id: eventId,
							_event_type: eventType,
							_event_date: eventDate || new Date().toISOString(),
							_event_parameters: parameters,
						};

						let endpoint = `/datasource/${datasourceId}/stream/events`;
						const queryParams: string[] = [];
						if (sync) queryParams.push('_sync');
						if (dryRun) queryParams.push('_dryRun');
						if (queryParams.length > 0) {
							endpoint += '?' + queryParams.join('&');
						}

						response = await instasentProductApiRequestForProject.call(this, 'POST', endpoint, [eventData]);
					} else if (operation === 'deleteContact') {
						const userId = this.getNodeParameter('userId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'DELETE', `/datasource/${datasourceId}/stream/contacts/${encodeURIComponent(userId)}`);
					}
				}

				// ==================== SEGMENT ====================
				else if (resource === 'segment') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/segment', undefined, qs);
					} else if (operation === 'listDynamic') {
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/segment/dynamic');
					} else if (operation === 'get') {
						const segmentUid = this.getNodeParameter('segmentUid', i) as string;
						const segmentParameter = this.getNodeParameter('segmentParameter', i, '') as string;
						const qs: IDataObject = {};
						if (segmentParameter) {
							qs.parameter = segmentParameter;
						}
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/segment/${encodeURIComponent(segmentUid)}`, undefined, qs);
					}
				}

				// ==================== CAMPAIGN ====================
				else if (resource === 'campaign') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const simpleFilters: IDataObject = {};
						if (filters.status) {
							simpleFilters.status_eq = filters.status;
						}
						const qs = buildQueryFilter(
							simpleFilters,
							queryFilterJson,
							0,
							limit,
							filters.sort as string | undefined,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/campaign', undefined, qs);
					} else if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/campaign/${encodeURIComponent(campaignId)}`);
					}
				}

				// ==================== AUTOMATION ====================
				else if (resource === 'automation') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const simpleFilters: IDataObject = {};
						if (filters.status) {
							simpleFilters.status_eq = filters.status;
						}
						const qs = buildQueryFilter(
							simpleFilters,
							queryFilterJson,
							0,
							limit,
							filters.sort as string | undefined,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/automation', undefined, qs);
					} else if (operation === 'get') {
						const automationId = this.getNodeParameter('automationId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/automation/${encodeURIComponent(automationId)}`);
					}
				}

				// ==================== SMS SENDER ====================
				else if (resource === 'smsSender') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', '/channel/sms/sender', undefined, qs);
					}
				}

				// ==================== SMS ====================
				else if (resource === 'sms') {
					if (operation === 'get') {
						const smsId = this.getNodeParameter('smsId', i) as string;
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/channel/sms/sms/${encodeURIComponent(smsId)}`);
					} else if (operation === 'listByAudience') {
						const audienceId = this.getNodeParameter('audienceId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/channel/sms/sms/audience/${encodeURIComponent(audienceId)}`, undefined, qs);
					} else if (operation === 'listBySend') {
						const sendId = this.getNodeParameter('sendId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/channel/sms/sms/send/${encodeURIComponent(sendId)}`, undefined, qs);
					} else if (operation === 'listByCampaign') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const optionIdx = this.getNodeParameter('optionIdx', i, 0) as number;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/channel/sms/sms/campaign/${encodeURIComponent(campaignId)}/${optionIdx}`, undefined, qs);
					} else if (operation === 'listByAutomation') {
						const automationId = this.getNodeParameter('automationId', i) as string;
						const messageIdx = this.getNodeParameter('messageIdx', i, 0) as number;
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						response = await instasentProductApiRequestForProject.call(this, 'GET', `/channel/sms/sms/automation/${encodeURIComponent(automationId)}/${messageIdx}`, undefined, qs);
					} else if (operation === 'listDirect') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = returnAll ? 100 : (this.getNodeParameter('limit', i, 50) as number);
						const queryFilterJson = this.getNodeParameter('queryFilterJson', i, '{}') as string;
						const utmTerm = this.getNodeParameter('listDirectUtmTerm', i, '') as string;
						const qs = buildQueryFilter(
							undefined,
							queryFilterJson,
							0,
							limit,
						);
						let endpoint = '/channel/sms/sms/direct';
						if (utmTerm && utmTerm.trim() !== '') {
							endpoint += `/${encodeURIComponent(utmTerm.trim())}`;
						}
						response = await instasentProductApiRequestForProject.call(this, 'GET', endpoint, undefined, qs);
					} else if (operation === 'createDirect') {
						const audienceId = this.getNodeParameter('audienceId', i) as string;
						const senderId = this.getNodeParameter('senderId', i, 'default') as string;
						const text = this.getNodeParameter('text', i) as string;
						const allowUnicode = this.getNodeParameter('allowUnicode', i, false) as boolean;
						const utmTerm = this.getNodeParameter('utmTerm', i, '') as string;

						const senderParam = senderId || 'default';
						const body: IDataObject = {
							text,
							allowUnicode,
						};

						let endpoint = `/channel/sms/sms/direct/${encodeURIComponent(senderParam)}/${encodeURIComponent(audienceId)}`;
						if (utmTerm && utmTerm.trim() !== '') {
							endpoint += `/${encodeURIComponent(utmTerm.trim())}`;
						}

						response = await instasentProductApiRequestForProject.call(
							this,
							'POST',
							endpoint,
							body,
						);
					}
				}

				returnData.push({
					json: response as IDataObject,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error occurred',
						},
					});
					continue;
				}

				// Extract meaningful error message
				let errorMessage = 'Unknown error occurred';
				if (error instanceof Error) {
					errorMessage = error.message;
					// If it's an HTTP error, include status code in the message
					if ((error as any).httpCode) {
						errorMessage = `${errorMessage} (HTTP ${(error as any).httpCode})`;
					}
				}

				throw new NodeOperationError(this.getNode(), errorMessage, {
					description: error instanceof Error ? error.message : undefined,
				});
			}
		}

		return [returnData];
	}
}
