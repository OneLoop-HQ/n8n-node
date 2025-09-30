import { INodeProperties } from 'n8n-workflow';

export const dispatchPhoneCallDescription: INodeProperties[] = [
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
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
		default: '',
		displayOptions: {
			show: {
				operation: ['dispatchPhoneCall'],
			},
		},
		description: 'First name of the lead',
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
				displayName: 'Version ID',
				name: 'versionId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Outbound Phone Number ID',
				name: 'outboundPhoneNumberId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'To Phone Number',
				name: 'toPhoneNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Room Name',
				name: 'roomName',
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
					{ name: 'Video', value: 'video' },
				],
				default: 'audio',
			},
			{
				displayName: 'Zipcode',
				name: 'zipcode',
				type: 'string',
				default: '',
			},
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
				displayName: 'Variables (JSON)',
				name: 'variables',
				type: 'json',
				default: '',
			},
			{
				displayName: 'Forwarding Number',
				name: 'forwardingNumber',
				type: 'string',
				default: '',
			},
		],
	},
];
