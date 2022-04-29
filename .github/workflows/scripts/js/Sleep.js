const createWorkflowDispatch = (github, ref, context, params) => {
  console.log(ref)
  console.log(params)
  console.log('github:' + github.rest.actions)
  console.log('context:' + context)
  
  github.rest.actions.createWorkflowDispatch({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: 'export-unpack-commit-solution.yml',
    ref: ref,
    inputs: {
      solution_name: 'PVAsolution',
      environment_url: 'https://orgcbe07d64.crm.dynamics.com/',
      source_branch: 'main',
      branch_to_create: 'test_branch_2',
      commit_message: 'test'
    }
  })
}

const otherMethod = async (github, context) => {
  let data = await github.rest.repos.getAllEnvironments({
    owner: context.repo.owner,
    repo: context.repo.repo
  })

  console.log(data)
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = {
  createWorkflowDispatch, 
  otherMethod
}