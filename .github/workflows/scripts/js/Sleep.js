const method = () => {
  // your method logic
  console.log('method')
}

const otherMethod = () => {
  // your method logic 
  console.log('other method')
}

function sleep(seconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < (seconds * 1000));
}

module.exports = (milliseconds) => {
  method, 
  otherMethod
}