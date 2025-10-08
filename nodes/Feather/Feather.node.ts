import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { executeCancelWorkflowExecution } from './operations/cancelWorkflowExecution';
import { cancelWorkflowExecutionDescription } from './operations/cancelWorkflowExecution.description';
import { createAgentWorkflowDescription } from './operations/createAgentWorkflow.description';
import { executeCreateWorkflowExecution } from './operations/createWorkflowExecution';
import { createWorkflowExecutionDescription } from './operations/createWorkflowExecution.description';
import { executeDispatchPhoneCall } from './operations/dispatchPhoneCall';
import { dispatchPhoneCallDescription } from './operations/dispatchPhoneCall.description';
import { executeGetWorkflows } from './operations/getWorkflows';
import { getWorkflowsDescription } from './operations/getWorkflows.description';

export class Feather implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Feather',
		name: 'feather',
		icon: 'file:feather.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with Feather API to manage workflows',
		defaults: {
			name: 'Feather',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'featherApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Cancel Workflow Execution',
						value: 'cancelWorkflowExecution',
						description: 'Cancel a workflow execution',
						action: 'Cancel a workflow execution',
					},
					{
						name: 'Create Workflow Execution',
						value: 'createWorkflowExecution',
						description: 'Create a new workflow execution',
						action: 'Create a workflow execution',
					},
					{
						name: 'Dispatch Phone Call',
						value: 'dispatchPhoneCall',
						description: 'Dispatch a phone call with custom parameters',
						action: 'Dispatch a phone call',
					},
					{
						name: 'Get Workflows',
						value: 'getWorkflows',
						description: 'Get a list of workflows',
						action: 'Get workflows',
					},
				],
				default: 'getWorkflows',
			},
			...getWorkflowsDescription,
			...dispatchPhoneCallDescription,
			...createAgentWorkflowDescription,
			...createWorkflowExecutionDescription,
			...cancelWorkflowExecutionDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('featherApi');

		const baseURL =
			credentials.environment === 'production'
				? 'https://featherhq.com'
				: 'https://sandbox.featherhq.com';

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'getWorkflows') {
					returnData.push(await executeGetWorkflows.call(this, i, baseURL, credentials));
				} else if (operation === 'dispatchPhoneCall') {
					returnData.push(await executeDispatchPhoneCall.call(this, i, baseURL, credentials));
				}  else if (operation === 'createWorkflowExecution') {
					returnData.push(await executeCreateWorkflowExecution.call(this, i, baseURL));
				} else if (operation === 'cancelWorkflowExecution') {
					returnData.push(await executeCancelWorkflowExecution.call(this, i, baseURL));
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
