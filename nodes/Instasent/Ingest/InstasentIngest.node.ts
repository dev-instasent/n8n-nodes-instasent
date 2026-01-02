import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	instasentApiRequest,
} from './GenericFunctions';

import { contactOperations, contactFields } from './ContactDescription';
import { eventOperations, eventFields } from './EventDescription';
import { getContactProperties, getEventTypes, getEventParameters } from './LoadOptions';

export class InstasentIngest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instasent Data Source',
		name: 'instasentIngest',
		icon: {
			light: 'file:../instasent.svg',
			dark: 'file:../instasent.dark.svg',
		},
		group: ['input', 'output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Ingest contacts and events into an Instasent Data Source for high-volume data collection',
		defaults: {
			name: 'Instasent Data Source',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'instasentIngestApi',
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
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Event',
						value: 'event',
					},
				],
				default: 'contact',
				required: true,
			},
			...contactOperations,
			...contactFields,
			...eventOperations,
			...eventFields,
		],
	};

	methods = {
		loadOptions: {
			getContactProperties,
			getEventTypes,
			getEventParameters,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let response: IDataObject = {};

				if (resource === 'contact') {
					const userId = this.getNodeParameter('userId', i) as string;

					if (operation === 'upsert') {
						const contactProperties = this.getNodeParameter('contactProperties', i) as IDataObject;
						const instant = this.getNodeParameter('instant', i) as boolean;
						const properties = (contactProperties.property as IDataObject[]) || [];

						const contact: { [key: string]: string } = {
							_user_id: userId,
						};

						for (const prop of properties) {
							contact[prop.field as string] = prop.value as string;
						}

						response = await instasentApiRequest.call(
							this,
							'POST',
							instant ? '/stream/contacts?_sync' : '/stream/contacts',
							[contact],
						);

					} else if (operation === 'delete') {
						response = await instasentApiRequest.call(
							this,
							'DELETE',
							`/stream/contacts/${userId}`,
						);
					}

				} else if (resource === 'event') {
					if (operation === 'create') {
						const userId = this.getNodeParameter('userId', i) as string;
						const eventId = this.getNodeParameter('eventId', i) as string;
						const eventType = this.getNodeParameter('eventType', i) as string;
						const eventDate = this.getNodeParameter('eventDate', i) as string;
						const eventParameters = this.getNodeParameter('eventParameters', i) as { parameters: Array<{ name: string; value: string }> };

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

						response = await instasentApiRequest.call(
							this,
							'POST',
							'/stream/events',
							[eventData],
						);
					}
				}

				returnData.push({
					json: response,
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
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [returnData];
	}
}
