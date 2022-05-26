const dispatchWorkflow = async (github, context, workflow_id, reference, parameters) => {
  await github.rest.actions.createWorkflowDispatch({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: workflow_id,
    ref: reference,
    inputs: parameters
  })

  await checkWorkflowStatus(github, context, null, workflow_id, 'success', 'queued');
}

const listWorkflowRuns = async (github, context, workflow_id) => {
  let workflowLog = await github.rest.actions.listWorkflowRuns({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: workflow_id,
    per_page: 1
  })

  if (workflowLog.data.total_count > 0) {
    return workflowLog.data.workflow_runs[0]
  }
  else {
    return null
  }
}

const checkStatus = async (github, context, workflow_id) => {
  let result = await listWorkflowRuns(github, context, workflow_id)
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

const checkWorkflowStatus = (github, context, core, workflow_id, successStatus = 'success', exitStatus = 'completed', delay) => {
  checkStatus(github, context, workflow_id)
  .then(status => {
    if (status != successStatus) {
      core.setFailed(status)
    }
    else {
      console.log(workflow_id + ' was executed successfully')
    }
  })
  .catch(status => {
    if (status != exitStatus) {
      console.log(new Date().toISOString() + ' - status: ' + status)
      setTimeout(() => checkWorkflowStatus(github, context, core, workflow_id, delay), delay)
    }
  })
}

module.exports = {
  dispatchWorkflow,
  checkWorkflowStatus
}