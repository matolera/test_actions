const dispatchWorkflow = async (github, context, id, reference, parameters) => {
  await github.rest.actions.createWorkflowDispatch({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: id,
    ref: reference,
    inputs: parameters
  })
}

const listWorkflowRuns = async (github, context, workflow) => {
  let workflowLog = await github.rest.actions.listWorkflowRuns({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: workflow,
    per_page: 1
  })

  if (workflowLog.data.total_count > 0) {
    return workflowLog.data.workflow_runs[0]
  }
  else {
    return null
  }
}

const checkStatus = async (github, context, workflow) => {
  let result = await listWorkflowRuns(github, context, workflow)
  return new Promise((resolve, reject) => {
    if (result.status != 'completed') {
      reject(result.status)
    }
    else {
      if (result.conclusion != 'success') {
        resolve('Workflow execution failed. For more information go to ' + result.html_url)
      }
      else {
        resolve(result.conclusion)
      }
    }
  })
}

const checkWorkflowStatus = (github, context, core, workflow, delay, retry = 1) => {
  checkStatus(github, context, workflow)
  .then(status => {
    if (status != 'success') {
      core.setFailed(status)
    }
    else {
      console.log(workflow + ' was executed successfully')
    }
  })
  .catch(function (status) {
    if (status != 'completed') {
      console.log(new Date().toISOString() + ' - status: ' + status)
      setTimeout(() => checkWorkflowStatus(github, context, core, workflow, delay, retry + 1), delay)
    }
  })
}

module.exports = {
  dispatchWorkflow,
  checkWorkflowStatus
}