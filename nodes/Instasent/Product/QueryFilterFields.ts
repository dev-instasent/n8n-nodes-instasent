import { INodeProperties } from 'n8n-workflow';

/**
 * Shared QueryFilter field for resources that support it
 * Note: displayOptions should be set when using this field
 */
export const queryFilterField: INodeProperties = {
	displayName: 'QueryFilter (JSON)',
	name: 'queryFilterJson',
	type: 'json',
	default: '{}',
	description: 'Advanced QueryFilter as JSON. See <a href="https://docs.instasent.com">Instasent documentation</a> for QueryFilter syntax. Supports filters, paging, sort, and group. Example: {"filter":[{"field":"status","operator":"eq","value":"active"}],"paging":{"start":0,"limit":20},"sort":[["name","asc"]]}',
};

/**
 * Array version for easy spreading
 */
export const queryFilterFields: INodeProperties[] = [queryFilterField];
