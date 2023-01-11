import {test} from '../../src/base/base-test';

test('Project test skeleton @projects', async ({projectsApi}) => {
  await projectsApi.createProject('Dig-Project');
});
