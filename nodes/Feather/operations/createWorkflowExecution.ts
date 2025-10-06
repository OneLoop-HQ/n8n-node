import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function executeCreateWorkflowExecution(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
): Promise<INodeExecutionData> {
	try {
		console.log('Starting workflow execution creation...');

		// Get required parameters
		const workflowId = this.getNodeParameter('workflowId', i) as string;
		const customerLeadId = this.getNodeParameter('customerLeadId', i) as string;
		const primaryPhone = this.getNodeParameter('primaryPhone', i) as string;

		// Get optional parameters
		const zipcode = this.getNodeParameter('zipcode', i, null) as string | null;
		const state = this.getNodeParameter('state', i, null) as string | null;
		const forwardingPhoneNumber = this.getNodeParameter('forwardingPhoneNumber', i, '') as string;

		// Get additional fields
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<
			string,
			unknown
		>;

		console.log('Basic parameters:', { workflowId, customerLeadId, primaryPhone, zipcode, state });

		// Build request body
		const body: Record<string, unknown> = {
			customerLeadId,
			primaryPhone,
			zipcode,
			state,
		};

		// Only include forwardingPhoneNumber if it's provided
		if (forwardingPhoneNumber) {
			body.forwardingPhoneNumber = forwardingPhoneNumber;
		}

		// Handle variables (JSON)
		if (additionalFields.variables) {
			try {
				body.variables =
					typeof additionalFields.variables === 'string'
						? JSON.parse(additionalFields.variables as string)
						: additionalFields.variables;
			} catch {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON in Variables field', {
					itemIndex: i,
				});
			}
		} else {
			body.variables = {};
		}

		// Handle metadata
		const metadata: Record<string, unknown> = {};
		if (additionalFields.firstName) {
			metadata.firstName = additionalFields.firstName;
		}
		if (additionalFields.lastName) {
			metadata.lastName = additionalFields.lastName;
		}

		// Add any additional metadata fields
		if (additionalFields.additionalMetadata) {
			try {
				const additionalMetadata =
					typeof additionalFields.additionalMetadata === 'string'
						? JSON.parse(additionalFields.additionalMetadata as string)
						: additionalFields.additionalMetadata;
				Object.assign(metadata, additionalMetadata);
			} catch {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON in Additional Metadata field', {
					itemIndex: i,
				});
			}
		}

		body.metadata = metadata;

		console.log('Preparing API request with execution data:', JSON.stringify(body, null, 2));

		try {
			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'featherApi', {
				method: 'POST',
				url: `${baseURL}/api/v1/workflow/${workflowId}/execution`,
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json, text/plain, */*',
				},
				body,
				json: true,
			});

			console.log('Workflow execution created successfully:', JSON.stringify(response, null, 2));

			return {
				json: response,
				pairedItem: {
					item: i,
				},
			};
		} catch (apiError) {
			console.error('API request failed:', apiError);
			console.error('Request details:', {
				url: `${baseURL}/api/v1/workflow/${workflowId}/execution`,
				workflowId,
				body,
			});
			throw apiError;
		}
	} catch (error) {
		console.error('Error in workflow execution creation:', error);
		throw error;
	}
}
