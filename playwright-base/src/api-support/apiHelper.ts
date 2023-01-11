import fetch from 'node-fetch';
import https from 'https';

const httpsAgent = new https.Agent({rejectUnauthorized: false});

export async function makeRequest(
  apiService: string,
  requestBody: any,
  apiPath: string,
  method: RequestMethod,
  domain: string,
  accessToken: string,
  headers?: any,
  skipJson?: boolean,
) {
  const url = `${apiService}/${apiPath}`;
  console.debug(`Request ${method.toUpperCase()}: ${url}`);

  const body = {
    method: `${method}`,
    body: requestBody === null ? null : JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      subdomain: `${domain}`,
      referer: `${apiService}`,
      Authorization: `Bearer ${accessToken}`,
    },
    agent: httpsAgent,
  };
  // If custom headers present
  if (headers) {
    body.headers = Object.assign(body.headers, headers);
  }
  const response = await fetchResponse(`${url}`, body);
  if (method !== RequestMethod.DELETE && !skipJson) {
    return response.json();
  } else {
    return response;
  }
}

export async function fetchResponse(url: string, specs: any) {
  const response = await fetch(`${url}`, specs);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  return response;
}

export const enum RequestMethod {
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  GET = 'get',
  DELETE = 'delete',
}
