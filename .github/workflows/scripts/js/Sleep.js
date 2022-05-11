const createWorkflowDispatch = async (github, ref, context, params) => {
  await github.rest.actions.createWorkflowDispatch({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: 'export-unpack-commit-solution.yml',
    ref: ref,
    inputs: params
  })
}

const checkStatus = async (github, context, core) => {
  let currentStatus = null;
  let conclusion = null;

  do {
    await sleep(10000)

    let workflowLog = await github.rest.actions.listWorkflowRuns({
      owner: context.repo.owner,
      repo: context.repo.repo,
      workflow_id: 'export-unpack-commit-solution.yml',
      per_page: 1
    })

    if (workflowLog.data.total_count > 0) {
      currentStatus = workflowLog.data.workflow_runs[0].status
      conclusion = workflowLog.data.workflow_runs[0].conclusion
    }
    else {
      break
    }

    console.log('export-unpack-commit-solution status: ' + currentStatus)
  } while (currentStatus != 'completed');

  if (conclusion != 'success') {
    core.setFailed('The export-unpack-commit-solution workflow failed.')
  }
}

const checkEnvironment = async (github, context, environment) => {
  let res = await github.rest.repos.getAllEnvironments({
    owner: context.repo.owner,
    repo: context.repo.repo
  })

  console.log(res.data.environments)

  if (res.data.environments.length > 0) {
    if (!res.data.environments.find(env => env.name === environment)) {
      core.setFailed('The Environment does not exists!')
    }
  }
}

const checkStatusNew = async (github, context) => {
    let workflowLog = await github.rest.actions.listWorkflowRuns({
      owner: context.repo.owner,
      repo: context.repo.repo,
      workflow_id: 'export-unpack-commit-solution.yml',
      per_page: 1
    })

    console.log('export-unpack-commit-solution status: ' + workflowLog.data.workflow_runs[0].status)
    return workflowLog.data.workflow_runs[0];
}

const statusChecker = async (github, context) => {
  let result = await checkStatusNew(github, context)
  return new Promise((resolve, reject) => {
    if (result.status != 'completed') {
      reject("workflow not completed")
    }
    else {
      resolve("workflow completed!!!")
    }  
  })
}

const retryCheck = (github, context, delay, retry = 1) => {
  statusChecker(github, context)
  .then(status => console.log(status))
  .catch(function (status) {
    console.log(status + ' executing with delay ' + delay)
    setTimeout(() => retryCheck(github, context, delay * (retry + 1), retry + 1), delay)
  })   
}

const sleep2 = async (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const sleep = async (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = {
  createWorkflowDispatch,
  checkStatus,
  checkEnvironment,
  sleep,
  retryCheck
}