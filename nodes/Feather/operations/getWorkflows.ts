import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeGetWorkflows(
	this: IExecuteFunctions,
	i: number,
	baseURL: string,
	credentials: any,
): Promise<INodeExecutionData> {
	const limit = this.getNodeParameter('limit', i) as number;
	const additionalParameters = this.getNodeParameter('additionalParameters', i) as any;

	const queryParams: string[] = [`limit=${limit}`];

	if (additionalParameters.offset) {
		queryParams.push(`offset=${additionalParameters.offset}`);
	}

	if (additionalParameters.status) {
		queryParams.push(`status=${additionalParameters.status}`);
	}

	const queryString = queryParams.join('&');

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'featherApi', {
		method: 'GET',
		url: `${baseURL}/api/v1/workflow?${queryString}`,
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			dnt: '1',
			origin:
				credentials.environment === 'production'
					? 'https://dashboard.featherhq.com'
					: 'https://dashboard.sandbox.featherhq.com',
			priority: 'u=1, i',
			referer:
				credentials.environment === 'production'
					? 'https://dashboard.featherhq.com/'
					: 'https://dashboard.sandbox.featherhq.com/',
			'sec-ch-ua': '"Not=A?Brand";v="24", "Chromium";v="140"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
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
