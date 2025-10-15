import { IExecuteFunctions, INodeExecutionData, LoggerProxy as Logger } from 'n8n-workflow';

export async function executeCancelWorkflowExecution(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
): Promise<INodeExecutionData> {
	try {
		Logger.info('Starting workflow execution cancellation...');

		// Get the workflow and execution IDs
		const workflowId = this.getNodeParameter('workflowId', i) as string;
		const executionId = this.getNodeParameter('executionId', i) as string;

		Logger.info('Parameters:', { workflowId, executionId });

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

			Logger.info('Workflow execution cancelled successfully:', { response });

			return {
				json: response,
				pairedItem: {
					item: i,
				},
			};
		} catch (apiError) {
			Logger.error('API request failed:', { error: apiError });
			Logger.error('Request details:', {
				url: `${baseURL}/api/v1/workflow/${workflowId}/executions/${executionId}/cancel`,
				workflowId,
				executionId,
			});
			throw apiError;
		}
	} catch (error) {
		Logger.error('Error in workflow execution cancellation:', { error });
		throw error;
	}
}
