import { INodeProperties } from 'n8n-workflow';

export const createWorkflowExecutionDescription: INodeProperties[] = [
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
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
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'Zipcode for the execution',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'State for the execution',
	},
	{
		displayName: 'Forwarding Phone Number',
		name: 'forwardingPhoneNumber',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['createWorkflowExecution'],
			},
		},
		description: 'Phone number to forward calls to',
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
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name for metadata',
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
			{
				displayName: 'Additional Metadata (JSON)',
				name: 'additionalMetadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata fields as JSON object',
			},
		],
	},
];
