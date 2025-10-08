import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function executeDispatchPhoneCall(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
	credentials: Record<string, unknown>,
): Promise<INodeExecutionData> {
	const agentId = this.getNodeParameter('agentId', i) as string;
	const leadId = this.getNodeParameter('leadId', i) as string;
	const firstName = this.getNodeParameter('firstName', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<
		string,
		unknown
	>;
	const toPhoneNumber = this.getNodeParameter('toPhoneNumber', i) as string;

	// Validate phone number format
	const phoneRegex = /^\+1\d{10}$/;
	if (!phoneRegex.test(toPhoneNumber)) {
		throw new NodeOperationError(
			this.getNode(),
			'Phone number must be in format +1XXXXXXXXXX (e.g., +12025551234)',
			{ itemIndex: i },
		);
	}

	// Build request body
	const body: Record<string, unknown> = {
		leadId,
		firstName,
		toPhoneNumber,
	};

	// Add optional fields if provided
	const optionalFields = [
		'versionId',
		'outboundPhoneNumberId',
		'metadata',
		'mode',
		'zipcode',
		'forwardingNumber',
	];
	for (const field of optionalFields) {
		if (additionalFields[field]) {
			body[field] = additionalFields[field];
		}
	}

	// Customer object
	if (additionalFields.customerFirstName || additionalFields.customerLastName) {
		body.customer = {
			firstName: additionalFields.customerFirstName || '',
			lastName: additionalFields.customerLastName || '',
		};
	}

	// Variables (JSON)
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
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'featherApi', {
		method: 'POST',
		url: `${baseURL}/api/v1/agent/${agentId}/dispatch`,
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			dnt: '1',
			origin:
				credentials.environment === 'production'
					? 'https://dashboard.featherhq.com'
					: 'https://dashboard.sandbox.featherhq.com',
			referer:
				credentials.environment === 'production'
					? 'https://dashboard.featherhq.com/'
					: 'https://dashboard.sandbox.featherhq.com/',
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
}
