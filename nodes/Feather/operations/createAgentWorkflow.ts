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
	// Get basic workflow information
	const name = this.getNodeParameter('name', i) as string;
	const description = this.getNodeParameter('description', i) as string;
	const active = this.getNodeParameter('active', i) as boolean;
	const timezone = this.getNodeParameter('timezone', i) as string;
	const agentId = this.getNodeParameter('agentId', i) as string;

	// Get step configuration
	const stepConfig = this.getNodeParameter('stepConfiguration', i) as Record<string, unknown>;

	// Get schedule configurations
	const workflowScheduleUi = this.getNodeParameter('workflowScheduleUi', i) as Record<
		string,
		unknown
	>;
	const tcpaScheduleUi = this.getNodeParameter('tcpaScheduleUi', i) as Record<string, unknown>;

	const workflowScheduleData = workflowScheduleUi?.scheduleConfiguration || {};
	const tcpaScheduleData = tcpaScheduleUi?.tcpaConfiguration || {};

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
		const scheduleData = workflowScheduleData as Record<string, unknown>;
		const {
			workingDays = [],
			workingHoursStart = 9,
			workingHoursEnd = 17,
			workingMinutesStart = 0,
			workingMinutesEnd = 0,
		} = scheduleData;

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
		}
	}

	// Configure TCPA schedule
	if (tcpaScheduleData) {
		const tcpaData = tcpaScheduleData as Record<string, unknown>;
		const {
			tcpaDays = [],
			tcpaHoursStart = 8,
			tcpaHoursEnd = 21,
			tcpaMinutesStart = 0,
			tcpaMinutesEnd = 0,
		} = tcpaData;

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

	return {
		json: response,
		pairedItem: {
			item: i,
		},
	};
}
