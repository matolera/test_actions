const method = (param) => {
  // your method logic
  console.log('method')
  console.log(param)
}

const otherMethod = (param) => {
  // your method logic 
  console.log('other method')
  sleep(2)
  console.log(param)
}

function sleep(seconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < (seconds * 1000));
}

module.exports = {
  method, 
  otherMethod
}