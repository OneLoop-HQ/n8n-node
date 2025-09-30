import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeCancelWorkflowExecution(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
	credentials: any,
): Promise<INodeExecutionData> {
	try {
		console.log('Starting workflow execution cancellation...');

		// Get the workflow and execution IDs
		const workflowId = this.getNodeParameter('workflowId', i) as string;
		const executionId = this.getNodeParameter('executionId', i) as string;

		console.log('Parameters:', { workflowId, executionId });

		try {
			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'featherApi', {
				method: 'POST',
				url: `${baseURL}/api/v1/workflow/${workflowId}/executions/${executionId}/cancel`,
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json, text/plain, */*',
				},
				json: true,
			});

			console.log('Workflow execution cancelled successfully:', JSON.stringify(response, null, 2));

			return {
				json: response,
				pairedItem: {
					item: i,
				},
			};
		} catch (apiError) {
			console.error('API request failed:', apiError);
			console.error('Request details:', {
				url: `${baseURL}/api/v1/workflow/${workflowId}/executions/${executionId}/cancel`,
				workflowId,
				executionId,
			});
			throw apiError;
		}
	} catch (error) {
		console.error('Error in workflow execution cancellation:', error);
		throw error;
	}
}
