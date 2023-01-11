import fs from 'fs';
import fetchModule from 'node-fetch';
import zlib from 'zlib';
import path from 'path';
import dotnov from 'dotenv';
dotnov.config({path: path.join(process.cwd(), '../.env')});

const lambdaDomain = 'https://fnzki46e10.execute-api.us-west-2.amazonaws.com';
const lambdaUploadPath = '/staging/xraylambda/junit?testExecKey=';
const lambdaGetStatusPath = '/staging/xraylambda/status?uuid=';
let testExecutionKey;
let lambdaApiKey;

if (
  process.env.XRAY_TEST_EXECUTION_KEY &&
  process.env.XRAY_TEST_EXECUTION_KEY.trim() !== 'null'
) {
  testExecutionKey = process.env.XRAY_TEST_EXECUTION_KEY;
} else {
  throw new Error('XRAY_TEST_EXECUTION_KEY is not filled');
}

if (
  process.env.TEST_RESULTS_LAMBDA_API_KEY &&
  process.env.TEST_RESULTS_LAMBDA_API_KEY.trim() !== 'null'
) {
  lambdaApiKey = process.env.TEST_RESULTS_LAMBDA_API_KEY;
} else {
  throw new Error('TEST_RESULTS_LAMBDA_API_KEY is not filled');
}

const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

const getUUID = (parsedResponseBody) => {
  let uuid;
  try {
    uuid = parsedResponseBody.UUID;
  } catch (e) {
    throw new Error(
      `Error while parsing response body - \n ${parsedResponseBody}`,
    );
  }
  if (!uuid) {
    throw new Error(
      `UUID wasn't found in response body: \n ${parsedResponseBody}`,
    );
  } else {
    return uuid;
  }
};

async function uploadToLambda() {
  const uncompressed = fs.readFileSync(
    path.join(process.cwd(), `../test-results/junit/xray-junit-result.xml`),
  );
  const compressed = zlib.deflateSync(uncompressed).toString('base64');
  const uploadResponse = await fetchModule(
    `${lambdaDomain}${lambdaUploadPath}${testExecutionKey}`,
    {
      method: 'POST',
      headers: {
        'x-api-key': lambdaApiKey,
        Connection: 'keep-alive',
        Accept: '*/*',
        'Content-Type': 'application/zip',
        'Cache-Control': 'max-age=0',
      },
      body: compressed,
    },
  );

  if (!uploadResponse.ok)
    throw new Error(`unexpected response ${uploadResponse.statusText}`);
  const responseBody = await uploadResponse.json();
  console.log(responseBody);
  return getUUID(responseBody);
}

/**
 * Function waits for a 5 seconds 30 times until upload to xray is succeed
 * @param uploadUUID
 */
async function waitUntilUploadIsDone(uploadUUID) {
  let statusCode = 0;
  let iterator = 0;
  while (statusCode !== 200 && statusCode !== 404 && ++iterator < 30) {
    await fetchModule(`${lambdaDomain}${lambdaGetStatusPath}${uploadUUID}`, {
      method: 'GET',
      headers: {
        'x-api-key': lambdaApiKey,
      },
    }).then(async (res) => {
      statusCode = res.status;
      console.log(`Iteration #${iterator}`);
      console.log(`Response status code: ${res.status}`);
      console.log(await res.json());
    });
    await delay(5000);
  }
}

(async () => {
  console.log('Test results upload to Xray is Started.\n');
  const uuid = await uploadToLambda();
  console.log('Querying status of upload.\n');
  await waitUntilUploadIsDone(uuid);
  console.log('Uploading process is finished.');
})();
