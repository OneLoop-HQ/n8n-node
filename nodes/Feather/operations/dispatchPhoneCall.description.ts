import { INodeProperties } from 'n8n-workflow';

export const dispatchPhoneCallDescription: INodeProperties[] = [
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		placeholder: 'e.g. agent-id-123',
		default: '',
		displayOptions: {
			show: {
				operation: ['dispatchPhoneCall'],
			},
		},
	},
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		required: true,
		placeholder: 'e.g. lead-id-123',
		default: '',
		displayOptions: {
			show: {
				operation: ['dispatchPhoneCall'],
			},
		},
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		placeholder: 'e.g. John',
		default: '',
		displayOptions: {
			show: {
				operation: ['dispatchPhoneCall'],
			},
		},
		description: 'First name of the lead',
	},
	{
		displayName: 'To Phone Number',
		name: 'toPhoneNumber',
		type: 'string',
		placeholder: 'e.g. +12025551234',
		required: true,
		default: '',
		displayOptions: {
			show: {
				operation: ['dispatchPhoneCall'],
			},
		},
		description: 'Phone number in format +1XXXXXXXXXX (e.g., +12025551234)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['dispatchPhoneCall'],
			},
		},
		options: [
			{
				displayName: 'Customer First Name',
				name: 'customerFirstName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Customer Last Name',
				name: 'customerLastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Forwarding Number',
				name: 'forwardingNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Audio', value: 'audio' },
				],
				default: 'audio',
			},
			{
				displayName: 'Outbound Phone Number ID',
				name: 'outboundPhoneNumberId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Variables (JSON)',
				name: 'variables',
				type: 'json',
				default: '',
			},
			{
				displayName: 'Version ID',
				name: 'versionId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Zipcode',
				name: 'zipcode',
				type: 'string',
				default: '',
			},
		],
	},
];
