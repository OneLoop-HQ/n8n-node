import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

type WorkflowStep = {
	id: string;
	type: string;
	order: number;
	delayInSecs: number;
	needsTCPACompliance: boolean;
	finishOn: string[];
	agentId: string;
	leaveVoicemail: boolean;
	conditions: any[];
};

type WorkflowDefinition = {
	steps: WorkflowStep[];
};

type TimeRange = {
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
};

type DaySchedule = {
	enabled: boolean;
	timeRanges: TimeRange[];
};

type Schedule = {
	monday: DaySchedule;
	tuesday: DaySchedule;
	wednesday: DaySchedule;
	thursday: DaySchedule;
	friday: DaySchedule;
	saturday: DaySchedule;
	sunday: DaySchedule;
};

function buildWorkflowDefinition(agentId: string, stepConfig: any): WorkflowDefinition {
	return {
		steps: [
			{
				id: agentId,
				type: stepConfig?.stepType || 'CALL',
				order: stepConfig?.order || 1,
				delayInSecs: stepConfig?.delayInSecs || 0,
				needsTCPACompliance: stepConfig?.needsTCPACompliance !== false,
				finishOn: stepConfig?.finishOn || [],
				agentId,
				leaveVoicemail: stepConfig?.leaveVoicemail || false,
				conditions: stepConfig?.conditions || [],
			},
		],
	};
}

export async function executeCreateAgentWorkflow(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
	credentials: any,
): Promise<INodeExecutionData> {
	try {
		console.log('Starting workflow creation...');

		// Get basic workflow information
		const name = this.getNodeParameter('name', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const active = this.getNodeParameter('active', i) as boolean;
		const timezone = this.getNodeParameter('timezone', i) as string;
		const agentId = this.getNodeParameter('agentId', i) as string;

		console.log('Basic parameters:', { name, description, active, timezone, agentId });

		// Get step configuration
		const stepConfig = this.getNodeParameter('stepConfiguration', i) as any;
		console.log('Step configuration:', stepConfig);

		// Get schedule configurations
		const workflowScheduleUi = this.getNodeParameter('workflowScheduleUi', i) as any;
		const tcpaScheduleUi = this.getNodeParameter('tcpaScheduleUi', i) as any;

		const workflowScheduleData = workflowScheduleUi?.scheduleConfiguration || {};
		const tcpaScheduleData = tcpaScheduleUi?.tcpaConfiguration || {};

		console.log('Schedule configurations:', { workflowScheduleData, tcpaScheduleData });

		// Build workflow schedule
		const workflowSchedule: Schedule = {
			monday: { enabled: false, timeRanges: [] },
			tuesday: { enabled: false, timeRanges: [] },
			wednesday: { enabled: false, timeRanges: [] },
			thursday: { enabled: false, timeRanges: [] },
			friday: { enabled: false, timeRanges: [] },
			saturday: { enabled: false, timeRanges: [] },
			sunday: { enabled: false, timeRanges: [] },
		};

		// Build TCPA schedule
		const tcpaSchedule: Schedule = {
			monday: { enabled: false, timeRanges: [] },
			tuesday: { enabled: false, timeRanges: [] },
			wednesday: { enabled: false, timeRanges: [] },
			thursday: { enabled: false, timeRanges: [] },
			friday: { enabled: false, timeRanges: [] },
			saturday: { enabled: false, timeRanges: [] },
			sunday: { enabled: false, timeRanges: [] },
		};

		// Configure workflow schedule
		if (workflowScheduleData) {
			console.log('Configuring workflow schedule...');
			const {
				workingDays = [],
				workingHoursStart = 9,
				workingHoursEnd = 17,
				workingMinutesStart = 0,
				workingMinutesEnd = 0,
			} = workflowScheduleData;

			console.log('Working days configuration:', { workingDays });

			if (Array.isArray(workingDays) && workingDays.length > 0) {
				for (const day of workingDays) {
					workflowSchedule[day as keyof Schedule] = {
						enabled: true,
						timeRanges: [
							{
								startHour: workingHoursStart,
								startMinute: workingMinutesStart,
								endHour: workingHoursEnd,
								endMinute: workingMinutesEnd,
							},
						],
					};
				}
				console.log('Workflow schedule configured:', workflowSchedule);
			} else {
				console.log('No working days configured, using default empty schedule');
			}
		}

		// Configure TCPA schedule
		if (tcpaScheduleData) {
			console.log('Configuring TCPA schedule...');
			const {
				tcpaDays = [],
				tcpaHoursStart = 8,
				tcpaHoursEnd = 21,
				tcpaMinutesStart = 0,
				tcpaMinutesEnd = 0,
			} = tcpaScheduleData;

			console.log('TCPA days configuration:', { tcpaDays });

			if (Array.isArray(tcpaDays) && tcpaDays.length > 0) {
				for (const day of tcpaDays) {
					tcpaSchedule[day as keyof Schedule] = {
						enabled: true,
						timeRanges: [
							{
								startHour: tcpaHoursStart,
								startMinute: tcpaMinutesStart,
								endHour: tcpaHoursEnd,
								endMinute: tcpaMinutesEnd,
							},
						],
					};
				}
				console.log('TCPA schedule configured:', tcpaSchedule);
			} else {
				console.log('No TCPA days configured, using default empty schedule');
			}
		}

		const stepDefinition = buildWorkflowDefinition(agentId, stepConfig?.stepSettings || {});

		const workflow = {
			name,
			description,
			active,
			timezone,
			workflowSchedule,
			tcpaSchedule,
			definition: stepDefinition,
		};

		console.log('Preparing API request with workflow:', JSON.stringify(workflow, null, 2));

		try {
			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'featherApi', {
				method: 'POST',
				url: `${baseURL}/api/v1/workflow`,
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json, text/plain, */*',
				},
				body: workflow,
				json: true,
			});

			console.log('Workflow created successfully:', JSON.stringify(response, null, 2));

			return {
				json: response,
				pairedItem: {
					item: i,
				},
			};
		} catch (apiError) {
			console.error('API request failed:', apiError);
			console.error('Request details:', {
				url: `${baseURL}/api/v1/workflow`,
				workflow,
			});
			throw apiError;
		}
	} catch (error) {
		console.error('Error in workflow creation:', error);
		throw error;
	}
}
