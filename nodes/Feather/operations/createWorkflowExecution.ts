import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function executeCreateWorkflowExecution(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
): Promise<INodeExecutionData> {
	try {
		// Get required parameters
		const workflowId = this.getNodeParameter('workflowId', i) as string;
		const customerLeadId = this.getNodeParameter('customerLeadId', i) as string;
		const primaryPhone = this.getNodeParameter('primaryPhone', i) as string;

		// Get optional parameters
		let zipcode = this.getNodeParameter('zipcode', i, null) as string | null | undefined;
		let state = this.getNodeParameter('state', i, null) as string | null | undefined;
		const forwardingPhoneNumber = this.getNodeParameter('forwardingPhoneNumber', i, null) as
			| string
			| null;


		// Do not pass in request body if zipcode is null
		if (zipcode === null) {
			zipcode = undefined;
		}

		if (zipcode !== undefined && zipcode.length === 0) {
			zipcode = undefined;
		}

		if (state === null) {
			state = undefined;
		}

		if (state !== undefined && state.length === 0) {
			state = undefined;
		}

		// Get additional fields
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<
			string,
			unknown
		>;

		// Validate that at least one of zipcode or state is provided
		if (!zipcode && !state) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one of Zipcode or State must be provided',
				{ itemIndex: i },
			);
		}

		// For state validate that it is 2 characters
		if (state) {
			if (state.length !== 2) {
				throw new NodeOperationError(
					this.getNode(),
					'State must be 2 characters',
					{ itemIndex: i },
				);
			}
		}

		// For zipcode validate regex ^[0-9]{5}$
		if (zipcode) {
			if (!/^[0-9]{5}$/.test(zipcode)) {
				throw new NodeOperationError(
					this.getNode(),
					'Zipcode must be 5 digits',
					{ itemIndex: i },
				);
			}
		}

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

			return {
				json: response,
				pairedItem: {
					item: i,
				},
			};
		} catch (apiError) {
			throw apiError;
		}
	} catch (error) {
		throw error;
	}
}
