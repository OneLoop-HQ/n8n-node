import { INodeProperties } from 'n8n-workflow';

export const createWorkflowExecutionDescription: INodeProperties[] = [
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. workflow-ID-123',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'The ID of the workflow to execute',
	},
	{
		displayName: 'Customer Lead ID',
		name: 'customerLeadId',
		type: 'string',
		required: true,
		placeholder: 'e.g. lead-ID-123',
		default: '',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'Customer lead identifier',
	},
	{
		displayName: 'Primary Phone',
		name: 'primaryPhone',
		type: 'string',
		required: true,
		placeholder: 'e.g. +12025551234',
		default: '',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'Primary phone number for the execution',
	},
	{
		displayName: 'Zipcode',
		name: 'zipcode',
		type: 'string',
		default: '',
		placeholder: 'e.g. 90210',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'Zipcode for the execution in format 90210',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		placeholder: 'e.g. CA',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'State for the execution in format CA',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		options: [
			{
				displayName: 'Additional Metadata (JSON)',
				name: 'additionalMetadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata fields as JSON object',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name for metadata',
			},
			{
				displayName: 'Forwarding Phone Number',
				name: 'forwardingPhoneNumber',
				type: 'string',
				default: '',
				description: 'Phone number to forward calls to',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name for metadata',
			},
			{
				displayName: 'Variables (JSON)',
				name: 'variables',
				type: 'json',
				default: '{}',
				description: 'Variables for the execution as JSON object',
			},
		],
	},
];
