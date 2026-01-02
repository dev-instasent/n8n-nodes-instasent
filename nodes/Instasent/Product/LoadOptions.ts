import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

import {
	IAttributeSpec,
	IAutomation,
	ICampaign,
	IEventParameterSpec,
	IEventSpec,
	IProject,
	ISegment,
	ISmsSender,
	getDatasourceId,
	instasentProductApiRequest,
	instasentProductApiRequestForProject,
} from './GenericFunctions';

export async function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequest.call(this, 'GET', '/');

	const projects = (response.entity?.projects || []) as IProject[];

	return projects
		.map(project => ({
			name: project.name,
			value: project.uid,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProjectAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/specs/attributes',
	);

	const specs = (response.entities || []) as IAttributeSpec[];
	const options: INodePropertyOptions[] = [];

	const sortedSpecs = specs.sort((a, b) => {
		if (a.requiredInWebhook && !b.requiredInWebhook) return -1;
		if (!a.requiredInWebhook && b.requiredInWebhook) return 1;
		if (a.visible && !b.visible) return -1;
		if (!a.visible && b.visible) return 1;
		return 0;
	});

	for (const spec of sortedSpecs) {
		if (spec.readOnly || spec.uid === '_user_id') continue;

		let description = spec.description || '';
		if (spec.dataType === 'date') {
			description += ' (ISO 8601 format YYYY-MM-DD)';
		}
		description += ` [${spec.uid}]`;
		if (spec.requiredInWebhook) {
			description = `[Required] ${description}`;
		}

		options.push({
			name: spec.requiredInWebhook ? `${spec.displayLabel} *` : spec.displayLabel,
			value: spec.uid,
			description,
		});
	}

	return options;
}

export async function getEventTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/specs/events',
	);

	const specs = (response.entities || []) as IEventSpec[];

	return specs.map(spec => ({
		name: `${spec.emoji} ${spec.name}`,
		value: spec.uid,
	}));
}

export async function getEventParameters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const eventType = this.getNodeParameter('eventType') as string;

	try {
		const response = await instasentProductApiRequestForProject.call(
			this,
			'GET',
			`/specs/events/${eventType}`,
		);

		const specs = (response.entities || []) as IEventParameterSpec[];

		return specs.map(spec => ({
			name: spec.required ? `${spec.title} *` : spec.title,
			value: spec.parameter,
			description: `${spec.required ? '[Required] ' : ''}${spec.description}${spec.dataType === 'date' ? ' (ISO 8601 format YYYY-MM-DD)' : ''}`,
		}));
	} catch (error) {
		console.error('Error fetching event parameters:', error);
		throw error;
	}
}

export async function getSegments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/segment',
	);

	const segments = (response.entities || []) as ISegment[];

	return segments.map(segment => ({
		name: segment.name,
		value: segment.uid,
		description: `Type: ${segment.type}`,
	}));
}

export async function getDynamicSegments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/segment/dynamic',
	);

	const segments = (response.entities || []) as ISegment[];

	return segments.map(segment => ({
		name: segment.name,
		value: segment.uid,
	}));
}

export async function getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/campaign',
	);

	const campaigns = (response.entities || []) as ICampaign[];

	return campaigns.map(campaign => ({
		name: campaign.title,
		at: campaign.campaignAt,
		value: campaign.id,
		description: `At: ${campaign.campaignAt} - Status: ${campaign.status}`,
	}));
}

export async function getAutomations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/automation',
	);

	const automations = (response.entities || []) as IAutomation[];

	return automations.map(automation => ({
		name: automation.title,
		value: automation.id,
		description: `Status: ${automation.status}`,
	}));
}

export async function getSmsSenders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		'/channel/sms/sender',
	);

	const senders = (response.entities || []) as ISmsSender[];

	const options: INodePropertyOptions[] = [
		{
			name: 'Default',
			value: 'default',
			description: 'Use the project\'s default sender',
		},
	];

	senders.forEach(sender => {
		options.push({
			name: sender.from,
			value: sender.id,
			description: `Status: ${sender.status}`,
		});
	});

	return options;
}

export async function getStreamAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const datasourceId = this.getNodeParameter('datasourceId', '') as string;
	const dsId = getDatasourceId(datasourceId);

	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		`/datasource/${dsId}/stream/specs/attributes`,
	);

	const specs = (response.specs || []) as IAttributeSpec[];
	const options: INodePropertyOptions[] = [];

	const sortedSpecs = specs.sort((a, b) => {
		if (a.requiredInWebhook && !b.requiredInWebhook) return -1;
		if (!a.requiredInWebhook && b.requiredInWebhook) return 1;
		if (a.visible && !b.visible) return -1;
		if (!a.visible && b.visible) return 1;
		return 0;
	});

	for (const spec of sortedSpecs) {
		if (spec.readOnly || spec.uid === '_user_id') continue;

		let description = spec.description || '';
		if (spec.dataType === 'date') {
			description += ' (ISO 8601 format YYYY-MM-DD)';
		}
		description += ` [${spec.uid}]`;
		if (spec.requiredInWebhook) {
			description = `[Required] ${description}`;
		}

		options.push({
			name: spec.requiredInWebhook ? `${spec.displayLabel} *` : spec.displayLabel,
			value: spec.uid,
			description,
		});
	}

	return options;
}

export async function getStreamEventTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const datasourceId = this.getNodeParameter('datasourceId', '') as string;
	const dsId = getDatasourceId(datasourceId);

	const response = await instasentProductApiRequestForProject.call(
		this,
		'GET',
		`/datasource/${dsId}/stream/specs/events`,
	);

	const specs = (response.specs || []) as IEventSpec[];

	return specs.map(spec => ({
		name: `${spec.emoji} ${spec.name}`,
		value: spec.uid,
	}));
}

export async function getStreamEventParameters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const datasourceId = this.getNodeParameter('datasourceId', '') as string;
	const dsId = getDatasourceId(datasourceId);
	const eventType = this.getNodeParameter('eventType') as string;

	try {
		const response = await instasentProductApiRequestForProject.call(
			this,
			'GET',
			`/datasource/${dsId}/stream/specs/event-parameters/${eventType}`,
		);

		const specs = (response.specs || []) as IEventParameterSpec[];

		return specs.map(spec => ({
			name: spec.required ? `${spec.title} *` : spec.title,
			value: spec.parameter,
			description: `${spec.required ? '[Required] ' : ''}${spec.description}${spec.dataType === 'date' ? ' (ISO 8601 format YYYY-MM-DD)' : ''}`,
		}));
	} catch (error) {
		console.error('Error fetching stream event parameters:', error);
		throw error;
	}
}
