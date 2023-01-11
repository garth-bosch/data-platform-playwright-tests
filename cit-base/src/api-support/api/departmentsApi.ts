import {ok} from 'assert';
import {makeCitApiRequest, servicePath} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';

export class DepartmentsApi {
  async getAllDepartments(): Promise<
    Array<{attributes: {category_name: string}}>
  > {
    console.debug(`Getting all Departments`);
    const response = await makeCitApiRequest(
      null,
      servicePath.paths.CATEGORIES,
      RequestMethod.GET,
    );
    ok(response.data);
    ok(response.data[0].attributes);
    return response.data;
  }

  async getDepartmentIdByName(departmentName: string): Promise<string> {
    let foundDepartments: any = Object.values(ApiDepartments).filter(
      (o) => o.name === departmentName,
    );
    // If the department was found in the test data
    if (foundDepartments.length) return foundDepartments[0].id;

    const allDepartments = await this.getAllDepartments();
    foundDepartments = allDepartments.filter(
      (d) => d.attributes['category_name'] === departmentName,
    );
    ok(foundDepartments.length);
    return foundDepartments[0].id.toString();
  }
}

export const ApiDepartments = {
  automatedTesting: {name: 'Automated testing - DO NOT MODIFY', id: '2603'},
  testDataDoNotModify: {name: 'Test Data - DO NOT MODIFY', id: '1581'},
};
