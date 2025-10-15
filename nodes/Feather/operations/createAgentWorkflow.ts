import { IExecuteFunctions, INodeExecutionData, LoggerProxy as Logger } from 'n8n-workflow';

type WorkflowStep = {
	id: string;
	type: string;
	order: number;
	delayInSecs: number;
	needsTCPACompliance: boolean;
	finishOn: string[];
	agentId: string;
	leaveVoicemail: boolean;
	conditions: unknown[];
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

type StepConfig = {
	stepType?: string;
	order?: number;
	delayInSecs?: number;
	needsTCPACompliance?: boolean;
	finishOn?: string[];
	leaveVoicemail?: boolean;
	conditions?: unknown[];
};

function buildWorkflowDefinition(agentId: string, stepConfig: StepConfig = {}): WorkflowDefinition {
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
): Promise<INodeExecutionData> {
	try {
		Logger.info('Starting workflow creation...');

		// Get basic workflow information
		const name = this.getNodeParameter('name', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const active = this.getNodeParameter('active', i) as boolean;
		const timezone = this.getNodeParameter('timezone', i) as string;
		const agentId = this.getNodeParameter('agentId', i) as string;

		Logger.info('Basic parameters:', { name, description, active, timezone, agentId });

		// Get step configuration
		const stepConfig = this.getNodeParameter('stepConfiguration', i) as Record<string, unknown>;
		Logger.info('Step configuration:', stepConfig);

		// Get schedule configurations
		const workflowScheduleUi = this.getNodeParameter('workflowScheduleUi', i) as Record<
			string,
			unknown
		>;
		const tcpaScheduleUi = this.getNodeParameter('tcpaScheduleUi', i) as Record<string, unknown>;

		const workflowScheduleData = workflowScheduleUi?.scheduleConfiguration || {};
		const tcpaScheduleData = tcpaScheduleUi?.tcpaConfiguration || {};

		Logger.info('Schedule configurations:', { workflowScheduleData, tcpaScheduleData });

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
			Logger.info('Configuring workflow schedule...');
			const scheduleData = workflowScheduleData as Record<string, unknown>;
			const {
				workingDays = [],
				workingHoursStart = 9,
				workingHoursEnd = 17,
				workingMinutesStart = 0,
				workingMinutesEnd = 0,
			} = scheduleData;

			Logger.info('Working days configuration:', { workingDays });

			if (Array.isArray(workingDays) && workingDays.length > 0) {
				for (const day of workingDays) {
					workflowSchedule[day as keyof Schedule] = {
						enabled: true,
						timeRanges: [
							{
								startHour: Number(workingHoursStart),
								startMinute: Number(workingMinutesStart),
								endHour: Number(workingHoursEnd),
								endMinute: Number(workingMinutesEnd),
							},
						],
					};
				}
				Logger.info('Workflow schedule configured:', workflowSchedule);
			} else {
				Logger.info('No working days configured, using default empty schedule');
			}
		}

		// Configure TCPA schedule
		if (tcpaScheduleData) {
			Logger.info('Configuring TCPA schedule...');
			const tcpaData = tcpaScheduleData as Record<string, unknown>;
			const {
				tcpaDays = [],
				tcpaHoursStart = 8,
				tcpaHoursEnd = 21,
				tcpaMinutesStart = 0,
				tcpaMinutesEnd = 0,
			} = tcpaData;

			Logger.info('TCPA days configuration:', { tcpaDays });

			if (Array.isArray(tcpaDays) && tcpaDays.length > 0) {
				for (const day of tcpaDays) {
					tcpaSchedule[day as keyof Schedule] = {
						enabled: true,
						timeRanges: [
							{
								startHour: Number(tcpaHoursStart),
								startMinute: Number(tcpaMinutesStart),
								endHour: Number(tcpaHoursEnd),
								endMinute: Number(tcpaMinutesEnd),
							},
						],
					};
				}
				Logger.info('TCPA schedule configured:', tcpaSchedule);
			} else {
				Logger.info('No TCPA days configured, using default empty schedule');
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

		Logger.info('Preparing API request with workflow:', { workflow });

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

			Logger.info('Workflow created successfully:', { response });

			return {
				json: response,
				pairedItem: {
					item: i,
				},
			};
		} catch (apiError) {
			Logger.error('API request failed:', apiError);
			Logger.error('Request details:', {
				url: `${baseURL}/api/v1/workflow`,
				workflow,
			});
			throw apiError;
		}
	} catch (error) {
		Logger.error('Error in workflow creation:', error);
		throw error;
	}
}
