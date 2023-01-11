import retry from 'async-retry';
import moment from 'moment';

import {makeMandrillRequest, servicePath} from './citApiHelper';
import {baseConfig} from '../base/base-config';

const mandrillApiKey = baseConfig.citApiConfig.mandrillApiKey;
const retryOps = {
  retries: 5,
  minTimeout: 10000,
  maxTimeout: 20000,
};

export async function searchMessages(forUser: string, subject: string) {
  let message = [];
  console.debug(`Searching emails for ${forUser}, subject: ${subject}`);
  await retry(async (bail) => {
    // We will retry only if status code = 200
    const request = await getSearchPayload(
      `email:${forUser} subject:${subject.replace(/\W+/g, ' ')}`,
    );
    const response = await makeMandrillRequest(
      request,
      servicePath.paths.MANDRILL_SEARCH_MESSAGES,
    );
    if (!response.ok) {
      bail(new Error('Failed to fetch mandrill data!'));
      return;
    }
    //json response will be validated
    const data: any = await response.json();
    if (!data || !data.length) {
      throw new Error(`Cannot find emails in Mandrill!`);
    } else {
      if (data[0].email.toLowerCase() !== forUser.toLowerCase())
        throw new Error(`Cannot find emails for user ${forUser} in Mandrill!`);
      if (!data[0].subject.match(subject))
        throw new Error('Search context did not match with email subject!');
      message = data;
    }
  }, retryOps);
  return message;
}

export async function searchMessage(forUser: string, subject: string) {
  const messages = await searchMessages(forUser, subject);
  return messages[0];
}

export async function searchMessagesForNoEmail(
  forUser: string,
  searchType: SearchType,
  additionalSearchCriteria: string,
) {
  if (!additionalSearchCriteria) {
    throw new Error(`Additional search criteria cannot be empty`);
  }
  const request = await getSearchPayload(
    `email:${forUser} subject:${searchType} ${additionalSearchCriteria}`,
  );
  console.debug(
    `Searching emails for ${forUser}, search type: ${searchType}, additional Criteria: ${additionalSearchCriteria}`,
  );
  await retry(async (bail, attempt) => {
    // We will retry only if status code = 200
    const response = await makeMandrillRequest(
      request,
      servicePath.paths.MANDRILL_SEARCH_MESSAGES,
    );
    if (!response.ok) {
      bail(new Error('Failed to fetch mandrill data!'));
      return;
    }
    const data: any = await response.json();
    // bail if email is found with criteria.
    if (data.find((key) => key.subject.includes(additionalSearchCriteria))) {
      bail(new Error(`Unexpected email found: ${additionalSearchCriteria}`));
      return;
    }
    if (attempt < retryOps.retries) {
      console.debug(`Attempt number ${attempt}`);
      throw new Error(`Failing until attempted ${retryOps.retries} times...`);
    }
  }, retryOps);
}

export async function getSearchPayload(forUser: string) {
  const now = new Date();
  return {
    key: mandrillApiKey,
    query: forUser,
    date_from: moment(now).subtract(1, 'hours').toISOString(),
    date_to: moment(now).add(1, 'hours').toISOString(), // Specific time window
    tags: ['notifications'],
    limit: 5,
  };
}

export async function getMessageContent(messageId: string) {
  console.debug(`Fetching email content for message: ${messageId}`);
  const requestData = {
    key: mandrillApiKey,
    id: `${messageId}`,
  };
  const response = await makeMandrillRequest(
    requestData,
    servicePath.paths.MANDRILL_GET_MESSAGE_CONTENT,
  );
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  return response.json();
}

export async function getContentForMessages(messages: any) {
  const messageContents = [];
  await Promise.all(
    messages.map(async (message) => {
      const content = await getMessageContent(message._id);
      messageContents.push(content);
    }),
  );
  return messageContents;
}

export async function getMessageWithContent(
  forUser: string,
  subject: string,
  text = '',
) {
  let messageContent: any;
  await retry(async (bail) => {
    let messages = [];
    // If no emails found, abort the function. Else throw an exception and try again.
    try {
      messages = await searchMessages(forUser, subject);
    } catch (e) {
      if (e.message === 'Cannot find emails in Mandrill!')
        return bail(
          new Error(
            `Failed to get messages by user: ${forUser} and subject: ${subject}`,
          ),
        );
      throw e;
    }
    const messageContents = await getContentForMessages(messages);
    for (const content of messageContents) {
      if (text) {
        if (await content.text.replace(/\s+/g, ' ').includes(text)) {
          console.debug(`Message with text was found: ${content.text}`);
          messageContent = await content;
          break;
        }
      } else {
        if (await content.html) {
          console.debug(`Message with text was found: ${content.text}`);
          messageContent = await content;
          break;
        }
      }
    }
    if (!(await messageContent)) throw new Error(`Cannot find message`);
  }, retryOps);
  return messageContent;
}

export async function getActivationLink(forUser: string) {
  const message = await searchMessage(forUser, SearchType.ACCOUNT_ACTIVATION);
  const messageContent: any = await getMessageContent(message._id);
  if (messageContent.html == null) {
    throw new Error(`Cannot find activation link ${messageContent}`);
  }
  return messageContent.html.match(/href="([^"]*)/)[1];
}

export async function getCommentsLink(forUser: string, forRecordNumber = '') {
  const message = await searchMessage(
    forUser,
    `${SearchType.COMMENTS}.*${forRecordNumber}`,
  );
  const messageContent: any = await getMessageContent(message._id);
  if (messageContent.html == null) {
    throw new Error(`Cannot find comments link ${messageContent}`);
  }
  return messageContent.html.match(/href="([^"]*)/)[1];
}

export async function verifyEmailNotSent(
  forUser: string,
  forRecordNumber: string,
) {
  if (!forUser) {
    throw new Error(`User name can not be empty or null`);
  }
  if (!forRecordNumber) {
    throw new Error(`Record number can not be empty or null`);
  }
  await searchMessagesForNoEmail(forUser, SearchType.COMMENTS, forRecordNumber);
}

export enum SearchType {
  ACCOUNT_ACTIVATION = 'Welcome to ViewPoint Cloud',
  PAYMENTS = 'Payment Required',
  INSPECTIONS = 'Inspection Scheduled',
  SUBMISSIONS = 'Record Submitted',
  RENEWALS = 'Renewal Pending',
  COMMENTS = 'commented on',
  INSPECTION_REQUESTED = 'Inspection Requested',
}
