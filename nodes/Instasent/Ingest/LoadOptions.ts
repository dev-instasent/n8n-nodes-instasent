import {
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

import {
	IAttributeSpec,
	IEventParameterSpec,
	IEventSpec,
	instasentApiRequest,
} from './GenericFunctions';

export async function getContactProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await instasentApiRequest.call(
		this,
		'GET',
		'/stream/specs/attributes',
	);

	const specs = response.specs as IAttributeSpec[];
	const options: INodePropertyOptions[] = [];

	// Sort specs by priority
	const sortedSpecs = specs.sort((a, b) => {
		if (a.requiredInWebhook && !b.requiredInWebhook) return -1;
		if (!a.requiredInWebhook && b.requiredInWebhook) return 1;
		if (a.visible && !b.visible) return -1;
		if (!a.visible && b.visible) return 1;
		return 0;
	});

	for (const spec of sortedSpecs) {
		// Skip readonly properties and _user_id
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
	const response = await instasentApiRequest.call(
		this,
		'GET',
		'/stream/specs/events',
	);

	const specs = response.specs as IEventSpec[];

	return specs.map(spec => ({
		name: `${spec.emoji} ${spec.name}`,
		value: spec.uid,
	}));
}

export async function getEventParameters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const eventType = this.getNodeParameter('eventType') as string;

	try {
		const response = await instasentApiRequest.call(
			this,
			'GET',
			`/stream/specs/event-parameters/${eventType}`,
		);

		const specs = response.specs as IEventParameterSpec[];

		return (specs || []).map(spec => ({
			name: spec.required ? `${spec.title} *` : spec.title,
			value: spec.parameter,
			description: `${spec.required ? '[Required] ' : ''}${spec.description}${spec.dataType === 'date' ? ' (ISO 8601 format YYYY-MM-DD)' : ''}`,
		}));
	} catch (error) {
		console.error('Error fetching event parameters:', error);
		throw error;
	}
}
