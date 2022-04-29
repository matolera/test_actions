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
    inputs: params
  })
}

const otherMethod = (param) => {
  // your method logic 
  console.log('other method')
  sleep(5000)
  console.log(param)
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