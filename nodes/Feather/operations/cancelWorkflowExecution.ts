import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeCancelWorkflowExecution(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
): Promise<INodeExecutionData> {
	// Get the workflow and execution IDs
	const workflowId = this.getNodeParameter('workflowId', i) as string;
	const executionId = this.getNodeParameter('executionId', i) as string;

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'featherApi', {
		method: 'POST',
		url: `${baseURL}/api/v1/workflow/${workflowId}/executions/${executionId}/cancel`,
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json, text/plain, */*',
		},
		json: true,
	});

	return {
		json: response,
		pairedItem: {
			item: i,
		},
	};
}
