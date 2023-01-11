import {notStrictEqual} from 'assert';
import {makeCitApiRequest, servicePath} from '../citApiHelper';

import {
  fetchResponse,
  RequestMethod,
} from '@opengov/playwright-base/build/api-support/apiHelper';
import {baseConfig} from '../../base/base-config';
import {CitEntityType} from '../../constants/cit-constants';
import fs from 'fs';
import path from 'path';
import retry from 'async-retry';

const retryOps = {
  retries: 5,
  minTimeout: 10000,
  maxTimeout: 20000,
};

const containerName = () => baseConfig.citApiConfig.storageContainer;
const accountName = () => baseConfig.citApiConfig.storageAccount;

export class RecordAttachmentsApi {
  async getAttachmentBucketsFromRecord(recordId: string) {
    const attachments: any = await makeCitApiRequest(
      null,
      servicePath.paths.RECORD_ATTACHMENT_BY_RECORD.with(recordId),
      RequestMethod.GET,
    );
    notStrictEqual(attachments.data, null);
    return attachments;
  }

  async createAdhocAttachment(recordId: string, attachmentName: string) {
    const payload = {
      data: {
        attributes: {
          name: attachmentName,
          description: '',
          recordID: recordId,
          required: false,
          isEnabled: false,
        },
      },
    };
    const attachment: any = await makeCitApiRequest(
      payload,
      servicePath.paths.RECORD_ATTACHMENT,
      RequestMethod.POST,
    );
    notStrictEqual(attachment.data, null);
    return attachment.data.id;
  }

  async getAttachmentBucketsId(recordId: string, attachmentName: string) {
    let bucket;
    await retry(async () => {
      const attachments: any = await this.getAttachmentBucketsFromRecord(
        recordId,
      );
      bucket = attachments.data.find((d: any) =>
        d.attributes.name.includes(attachmentName),
      );
      notStrictEqual(bucket, null);
      notStrictEqual(bucket.id, null);
      console.debug(
        `Attachment Bucket ID for record: ${recordId} is: ${bucket.id}`,
      );
    }, retryOps);
    return bucket.id;
  }

  async uploadToStorage(filePath: string) {
    const dateTimeNow = new Date()
      .toUTCString()
      .replace(new RegExp(/,|\s|:/, 'g'), '_');
    const fileName = `${path.parse(filePath).name}_${dateTimeNow}`;
    const fileContent = fs.readFileSync(filePath);
    const sasToken = await this.getFilesSasToken();
    const blobPath = `${baseConfig.citApiConfig.subdomain}/${fileName}`;
    const uploadUrl = `${baseConfig.citApiConfig.storageUrl}/${blobPath}?${sasToken}`;
    console.debug(`Filename: ${fileName}, Blob: ${blobPath}`);
    await fetchResponse(`${uploadUrl}`, {
      method: RequestMethod.PUT,
      headers: {
        Accept: '*/*',
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'image/png',
      },
      body: fileContent,
    });
    return blobPath;
  }

  async getFilesSasToken() {
    const filePath: string = servicePath.paths.FILE_SAS_TOKEN.with(
      containerName(),
      accountName(),
    );
    const sasToken: any = await fetchResponse(
      `${baseConfig.citApiConfig.railsUrl}/${filePath}`,
      {method: RequestMethod.GET},
    );
    notStrictEqual(sasToken, '');
    return sasToken.text();
  }

  async linkBlobToAttachment(
    attachmentEntityId: string,
    filename: string,
    blobName: string,
  ) {
    const payload = {
      data: {
        attributes: {
          entityTypeID: CitEntityType.RECORD_ATTACHMENT,
          entityPrimaryKey: attachmentEntityId,
          fileName: filename,
          blobName: blobName,
          containerName: containerName,
        },
      },
    };
    const file: any = await makeCitApiRequest(
      payload,
      servicePath.paths.UPLOADED_FILES,
      RequestMethod.POST,
    );
    notStrictEqual(file.data, null);
    notStrictEqual(file.data.id, null);
    console.debug(
      `File: ${file.data.id} linked to attachment: ${attachmentEntityId}`,
    );
  }

  async uploadFileToAttachment(
    attachmentName: string,
    fileToUpload: string,
    recordId: string = baseConfig.citTempData.recordId,
    adhocAttachment = false,
  ) {
    const attachmentsId = adhocAttachment
      ? await this.createAdhocAttachment(recordId, attachmentName)
      : await this.getAttachmentBucketsId(recordId, attachmentName);
    const blobName = await this.uploadToStorage(fileToUpload);
    await this.linkBlobToAttachment(
      attachmentsId,
      path.basename(fileToUpload),
      blobName,
    );
  }
}
