import { INodeProperties } from 'n8n-workflow';

export const createAgentWorkflowDescription: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. salesOutreach',
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'Name of the workflow',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		placeholder: 'e.g. Automated sales outreach workflow',
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'Description of the workflow',
	},
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'Whether the workflow is active',
	},
	{
		displayName: 'Timezone',
		name: 'timezone',
		type: 'string',
		default: 'America/Los_Angeles',
		placeholder: 'e.g. America/New_York',
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'Timezone for the workflow',
	},
	{
		displayName: 'Start Hour (24h)',
		name: 'startHour',
		type: 'number',
		default: 9,
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'Start hour in 24-hour format',
		typeOptions: {
			minValue: 0,
			maxValue: 23,
		},
	},
	{
		displayName: 'End Hour (24h)',
		name: 'endHour',
		type: 'number',
		default: 17,
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'End hour in 24-hour format',
		typeOptions: {
			minValue: 0,
			maxValue: 23,
		},
	},
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. agent-123',
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		description: 'ID of the agent to be used in the workflow',
	},
	{
		displayName: 'Workflow Schedule',
		name: 'workflowScheduleUi',
		type: 'fixedCollection',
		placeholder: 'Add Schedule',
		default: {},
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		options: [
			{
				displayName: 'Schedule Configuration',
				name: 'scheduleConfiguration',
				values: [
					{
						displayName: 'Working Days',
						name: 'workingDays',
						type: 'multiOptions',
						options: [
							{
								name: 'Friday',
								value: 'friday',
							},
							{
								name: 'Monday',
								value: 'monday',
							},
							{
								name: 'Saturday',
								value: 'saturday',
							},
							{
								name: 'Sunday',
								value: 'sunday',
							},
							{
								name: 'Thursday',
								value: 'thursday',
							},
							{
								name: 'Tuesday',
								value: 'tuesday',
							},
							{
								name: 'Wednesday',
								value: 'wednesday',
							},
						],
						default: [],
						description: 'Days when the workflow is active',
					},
					{
						displayName: 'Working Hours End (24h)',
						name: 'workingHoursEnd',
						type: 'number',
						default: 17,
						description: 'End of working hours in 24-hour format',
					},
					{
						displayName: 'Working Hours Start (24h)',
						name: 'workingHoursStart',
						type: 'number',
						default: 9,
						description: 'Start of working hours in 24-hour format',
					},
					{
						displayName: 'Working Minutes End',
						name: 'workingMinutesEnd',
						type: 'number',
						default: 0,
						description: 'End minutes of working hours',
					},
					{
						displayName: 'Working Minutes Start',
						name: 'workingMinutesStart',
						type: 'number',
						default: 0,
						description: 'Start minutes of working hours',
					},
				],
			},
		],
	},
	{
		displayName: 'TCPA Schedule',
		name: 'tcpaScheduleUi',
		type: 'fixedCollection',
		placeholder: 'Add TCPA Schedule',
		default: {},
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		options: [
			{
				displayName: 'TCPA Configuration',
				name: 'tcpaConfiguration',
				values: [
					{
						displayName: 'TCPA Days',
						name: 'tcpaDays',
						type: 'multiOptions',
						options: [
							{
								name: 'Friday',
								value: 'friday',
							},
							{
								name: 'Monday',
								value: 'monday',
							},
							{
								name: 'Saturday',
								value: 'saturday',
							},
							{
								name: 'Sunday',
								value: 'sunday',
							},
							{
								name: 'Thursday',
								value: 'thursday',
							},
							{
								name: 'Tuesday',
								value: 'tuesday',
							},
							{
								name: 'Wednesday',
								value: 'wednesday',
							},
						],
						default: [],
						description: 'Days when TCPA rules apply',
					},
					{
						displayName: 'TCPA Hours End (24h)',
						name: 'tcpaHoursEnd',
						type: 'number',
						default: 21,
						description: 'End of TCPA hours in 24-hour format',
					},
					{
						displayName: 'TCPA Hours Start (24h)',
						name: 'tcpaHoursStart',
						type: 'number',
						default: 8,
						description: 'Start of TCPA hours in 24-hour format',
					},
					{
						displayName: 'TCPA Minutes End',
						name: 'tcpaMinutesEnd',
						type: 'number',
						default: 0,
						description: 'End minutes of TCPA hours',
					},
					{
						displayName: 'TCPA Minutes Start',
						name: 'tcpaMinutesStart',
						type: 'number',
						default: 0,
						description: 'Start minutes of TCPA hours',
					},
				],
			},
		],
	},
	{
		displayName: 'Step Configuration',
		name: 'stepConfiguration',
		type: 'fixedCollection',
		placeholder: 'Add Step Configuration',
		default: {},
		displayOptions: {
			show: {
				operation: ['createAgentWorkflow'],
			},
		},
		options: [
			{
				displayName: 'Step Settings',
				name: 'stepSettings',
				values: [
					{
						displayName: 'Delay (Seconds)',
						name: 'delayInSecs',
						type: 'number',
						default: 0,
						description: 'Delay before executing this step',
					},
					{
						displayName: 'Finish On',
						name: 'finishOn',
						type: 'multiOptions',
						options: [
							{
								name: 'Answered',
								value: 'ANSWERED',
							},
							{
								name: 'Busy',
								value: 'BUSY',
							},
							{
								name: 'No Answer',
								value: 'NO_ANSWER',
							},
							{
								name: 'Failed',
								value: 'FAILED',
							},
						],
						default: [],
						description: 'Conditions when to finish the workflow',
					},
					{
						displayName: 'Leave Voicemail',
						name: 'leaveVoicemail',
						type: 'boolean',
						default: false,
						description: 'Whether to leave a voicemail if call is not answered',
					},
					{
						displayName: 'Needs TCPA Compliance',
						name: 'needsTCPACompliance',
						type: 'boolean',
						default: true,
						description: 'Whether this step needs TCPA compliance',
					},
					{
						displayName: 'Order',
						name: 'order',
						type: 'number',
						default: 1,
						description: 'Order of the step in the workflow',
					},
					{
						displayName: 'Step Type',
						name: 'stepType',
						type: 'options',
						options: [
							{
								name: 'Call',
								value: 'CALL',
							},
							{
								name: 'SMS',
								value: 'SMS',
							},
							{
								name: 'Email',
								value: 'EMAIL',
							},
						],
						default: 'CALL',
						description: 'Type of step',
					},
				],
			},
		],
	},
];
