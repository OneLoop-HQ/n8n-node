import { INodeProperties } from 'n8n-workflow';

export const cancelWorkflowExecutionDescription: INodeProperties[] = [
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
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
		displayOptions: {
			show: {
				operation: ['cancelWorkflowExecution'],
			},
		},
		description: 'The ID of the execution to cancel',
	},
];
