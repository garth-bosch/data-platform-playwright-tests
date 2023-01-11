import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../base/base-test';
import retry from 'async-retry';
import StreamZip from 'node-stream-zip';
import fs from 'fs';

const retryOps = {
  retries: 5,
  minTimeout: 1000,
  maxTimeout: 3000,
};

export class MyExportsPage extends BaseCitPage {
  readonly elements = {
    myExportsTable: '#dvDisplayData table',
    headers: 'thead th',
    rows: 'tr',
    downloadButton: 'a.btn-primary',
    refreshButton: 'button:has-text("Refresh")',
  };

  async getReportExportRow(reportName: string) {
    return this.page
      .locator(this.elements.myExportsTable)
      .locator(this.elements.rows, {hasText: reportName})
      .first();
  }

  async validateReportInMyExports(reportName: string, status = '') {
    await retry(async () => {
      await this.page.click(this.elements.refreshButton);
      const reportRow = await this.getReportExportRow(reportName);
      await expect(reportRow).toBeVisible({timeout: 10000});
      await expect(reportRow.locator(this.elements.downloadButton)).toBeVisible(
        {
          timeout: 10000,
        },
      );
      await expect(reportRow).toContainText('Download');
      if (status) {
        await expect(reportRow).toContainText(status);
      }
      console.info(await reportRow.allInnerTexts());
    }, retryOps);
  }

  async downloadExportedFile(reportName: string) {
    const reportRow = await this.getReportExportRow(reportName);
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      await reportRow.locator(this.elements.downloadButton).click(),
    ]);
    // Wait for the download process to complete
    const fileName = download.suggestedFilename();
    const path = `./downloads/${fileName}`;
    await download.saveAs(path);
    return path;
  }

  async verifyExportedFileExtention(reportName: string, fileExtention: string) {
    const reportRow = await this.getReportExportRow(reportName);
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      await reportRow.locator(this.elements.downloadButton).click(),
    ]);
    const path = download.suggestedFilename();
    await download.saveAs(`./downloads/${path}`);
    expect(download.suggestedFilename()).toContain(fileExtention);
  }

  async verifyZipFileHasExpectedFilesList(
    reportName: string,
    filesCount: number,
    fileExtantion: string,
  ) {
    const filePath = await this.downloadExportedFile(reportName);
    const zip = new StreamZip.async({file: filePath});
    const entriesCount = await zip.entriesCount;

    const entries = await zip.entries();
    expect(entriesCount).toEqual(filesCount);
    for (const entry of Object.values(entries)) {
      expect(entry.name).toContain(fileExtantion);
    }
    await zip.close();
  }

  async readExportFile(filePath: string, entryType: 'multi' | 'single') {
    let downloadedFileName: string;
    let data: Buffer;
    const outDir = `./downloads/`;
    if (filePath.endsWith('.zip')) {
      const zip = new StreamZip.async({file: filePath});
      const entries = Object.values(await zip.entries());
      const fileName = entries.find((f) => {
        return entryType === 'multi'
          ? f.name.includes('Multi-Entry Section_multiEntry')
          : !f.name.includes('Multi-Entry Section_multiEntry');
      });
      data = await zip.entryData(fileName);
    } else {
      downloadedFileName = filePath;
      data = fs.readFileSync(outDir + downloadedFileName);
    }
    const CSV_DATA: any = data
      .toString()
      .split(/[\r\n]/)
      .filter((s) => s);
    const keys = CSV_DATA[0].replace(/"/g, '').split(',');
    // Convert to an array of objects.
    // Each key = column name, each value = the column value.
    const OBJECT_DATA = CSV_DATA.slice(1).map((line) => {
      // Temp replacing , => ; to split column values correctly
      const doubleQuotesSubstrings = line.match(/"([^"]*)"/g);
      if (doubleQuotesSubstrings)
        doubleQuotesSubstrings.forEach(
          (e) => (line = line.replace(e, e.replaceAll(',', ';'))),
        );
      //  Replace each String (Column values) to Array of objects
      line = line
        .replace(/"/g, '')
        .split(',')
        .map((v, i) => {
          // Convert each value to object { ColumnName: ColumnValue }
          return {[keys[i]]: v.replaceAll(';', ',')};
        });
      // Return as single object
      return Object.assign({}, ...line);
    });
    return {likeCsv: CSV_DATA, likeObject: OBJECT_DATA};
  }
}
