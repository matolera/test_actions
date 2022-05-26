const dispatchWorkflow = async (github, context, workflow_id, reference, parameters) => {
  await github.rest.actions.createWorkflowDispatch({
    owner: context.repo.owner,
    repo: context.repo.repo,
    workflow_id: workflow_id,
    ref: reference,
    inputs: parameters
  })

  setTimeout(() => checkWorkflowStatus(github, context, null, workflow_id, 5000, 'success', 'queued'), 5000)
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
    console.log(result)
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

const checkWorkflowStatus = (github, context, core, workflow_id, delay, successStatus = 'success', exitStatus = 'completed') => {
  checkStatus(github, context, workflow_id)
  .then(status => {
    console.log('then status: ' + status)
    console.log('successStatus: ' + successStatus)
    if (status != successStatus) {
      core.setFailed(status)
    }
    else {
      console.log(workflow_id + ' was executed successfully')
    }
  })
  .catch(status => {
    console.log('catch status: ' + status)
    console.log('exitStatus: ' + exitStatus)
    if (status != exitStatus) {
      console.log(new Date().toISOString() + ' - status: ' + status)
      setTimeout(() => checkWorkflowStatus(github, context, core, workflow_id, delay, successStatus, exitStatus), delay)
    }
  })
}

module.exports = {
  dispatchWorkflow,
  checkWorkflowStatus
}