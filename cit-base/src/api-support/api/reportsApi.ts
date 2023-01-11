import {makeCitNodeApiRequest, servicePath} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {baseConfig} from '../../base/base-config';
import {AuthPage} from '../../common-pages/auth-page';
import {ReportColumn, ReportHeaders} from '../../constants/cit-constants';
import {expect, Page} from '@playwright/test';
import {
  headers,
  reportPayload,
  baseTemplatesReportsPayload,
  ReportsResult,
  ReportTypesScopeId,
} from './interfaces-and-data/default-payloads-interfaces';
import {DepartmentsApi} from './departmentsApi';

/*_____________________________________________________________ Sample Data*/

/* Todo type definition */

/*_____________________________________________________________*/

/* Todo after branch 33892 is merged, these move to a file names as interfaces and constants defaults + Getter methods ______________ End*/
/* above is done, now bring it to a pattern End*/

export class ReportsApi {
  prepareColumnsString(names: Array<ReportColumn>) {
    names.forEach((n, i) => (n.o = i + 1));
    return JSON.stringify(names);
  }

  prepareHeaders(subdomain: string, userId: string) {
    headers['subdomain'] = subdomain;
    headers['user_id'] = userId;
    return headers;
  }

  async deleteReport(reportId: string = baseConfig.citTempData.reportId) {
    console.debug(`Deleting report: ${reportId}`);
    await makeCitNodeApiRequest(
      null,
      servicePath.paths.REPORTS.with(reportId),
      RequestMethod.DELETE,
    );
  }

  /*TODO .. we merge the above method and this one*/
  async createNewReport(
    name: string,
    reportType: ReportTypesScopeId,
    columns?: string,
    filters?: string,
  ) {
    const finalPayload = JSON.parse(
      JSON.stringify(baseTemplatesReportsPayload.payloadCreateReportPaymentDue),
    );
    finalPayload.report.name = name;
    finalPayload.report.reportScopeID = reportType;
    if (filters) {
      finalPayload.report.filters = filters;
    }
    if (columns) {
      finalPayload.report.columns = columns;
    }
    console.debug(`Creating report: ${name} `);
    const payload: ReportsResult = await makeCitNodeApiRequest(
      finalPayload,
      servicePath.paths.REPORTS.with(''),
      RequestMethod.POST,
    );
    expect(payload?.reports).toBeDefined();
    expect(payload.reports).not.toBeNull();
    expect(payload.reports.length).toBeGreaterThan(0);
    expect(payload.reports[0].reportID).toBeDefined();
    expect(payload.reports[0].reportID).not.toBeNull();

    baseConfig.citTempData.reportId = payload.reports[0].reportID.toString();
    return baseConfig.citTempData.reportId;
  }

  /*TODO .. we merge the above method and this one*/
  async createReport(
    page: Page,
    columnNames: Array<ReportColumn>,
    reportName: string,
    reportType?: ReportTypesScopeId,
    departmentName?: string,
  ) {
    console.debug('Create a report scaffold');
    const columnString = this.prepareColumnsString(columnNames);
    const reqPayload = reportPayload;
    reqPayload.report.columns = columnString;
    const subdomain = await new AuthPage(page).getSubdomainFromLocalStorage();
    const userId = await new AuthPage(page).getUserIdFromLocalStorage();
    const reqHeaders = this.prepareHeaders(subdomain, userId);
    reqPayload.report.name = reportName;
    console.debug('Do a POST request to reports endpoint...');
    const merging = {
      report: {
        createdByUserID: userId,
        lastUpdatedByUserID: userId,
        createdByUser: userId,
      },
    };
    if (departmentName) {
      const departmentId = await new DepartmentsApi().getDepartmentIdByName(
        departmentName,
      );
      reportPayload.report.category = departmentId;
      reportPayload.report.categoryID = Number(departmentId);
    }
    if (reportType) reportPayload.report.reportScopeID = reportType;
    const putRequest = {report: {...reportPayload.report, ...merging.report}};
    const initResponse = await makeCitNodeApiRequest(
      putRequest,
      servicePath.paths.REPORTS.with(''),
      RequestMethod.POST,
      reqHeaders,
    );
    baseConfig.citTempData.reportId = initResponse['reports'][0]['id'];
    return initResponse['reports'][0]['id'];
  }

  async getReport(id: string, headers: ReportHeaders) {
    console.debug('Getting report by API');
    await makeCitNodeApiRequest(
      null,
      servicePath.paths.REPORTS.with(id),
      RequestMethod.GET,
      headers,
    );
  }

  async getReportColumns(reportType: ReportTypesScopeId, columns?: string[]) {
    const reportColumns: ReportColumn[] = [];
    const response = await makeCitNodeApiRequest(
      null,
      servicePath.paths.REPORTABLES.with(reportType),
      RequestMethod.GET,
    );
    response.reportables.filter((reportableColumn) => {
      if (columns && !columns.includes(reportableColumn.name)) return;
      reportColumns.push({
        t: reportableColumn.tableName,
        c: reportableColumn.col,
        n: reportableColumn.name,
        d: reportableColumn.dataType,
      });
    });
    return reportColumns;
  }
}
