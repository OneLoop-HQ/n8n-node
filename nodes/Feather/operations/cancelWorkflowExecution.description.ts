import { INodeProperties } from 'n8n-workflow';

export const cancelWorkflowExecutionDescription: INodeProperties[] = [
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. workflow-123',
		displayOptions: {
			show: {
				operation: ['cancelWorkflowExecution'],
			},
		},
		description: 'The ID of the workflow to cancel',
	},
	{
		displayName: 'Execution ID',
		name: 'executionId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. execution-456',
		displayOptions: {
			show: {
				operation: ['cancelWorkflowExecution'],
			},
		},
		description: 'The ID of the execution to cancel',
	},
];
