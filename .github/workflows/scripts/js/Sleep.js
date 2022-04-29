const method = (param) => {
  // your method logic
  console.log('method')
  console.log(param)
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
  method, 
  otherMethod
}