import {makeCitNodeApiRequest, servicePath} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {notStrictEqual} from 'assert';
import {baseConfig} from '../../base/base-config';

const projectPayloadTemplate = (projectName: string) => {
  return {
    project: {
      label: projectName,
      isEnabled: false,
    },
  };
};

export class ProjectsApi {
  async createProject(projectName: string) {
    const response: any = await makeCitNodeApiRequest(
      projectPayloadTemplate(projectName),
      servicePath.paths.PROJECTS,
      RequestMethod.POST,
    );
    const projectId = await response.project.id;
    notStrictEqual(projectId, null);
    baseConfig.citTempData.projectId = projectId;
  }
  async deleteProject(projectId: string) {
    await makeCitNodeApiRequest(
      null,
      servicePath.paths.PROJECTS_WITH_ID.with(projectId),
      RequestMethod.DELETE,
    );
  }
}
