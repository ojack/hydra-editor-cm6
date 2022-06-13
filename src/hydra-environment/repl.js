export default {
  eval: (arg) => {
  // test getting error line number by generating script tag
  // to do: remove scripts that throw an error
  // this method ends up with lotsss of script tags added to the head
  const jsString =  `(async() => {
${arg}
})().catch(${(err) => { 
      const stack = err.stack.split("\n")
      const lines = stack[1].split(':')
      const lineNumber = parseFloat(lines[1]) - 1
      const index = lines[2]
      console.log('ERROR INSIDE', stack, stack[1]) 
      console.log('LINE NUMBER', lineNumber, index)
      console.log(err.message, err.lineNumber)
    }})`

  var element = document.createElement("script");

  try {
    element.language = "javascript";
    element.type = "text/javascript";       
    element.defer = true;
    element.innerHTML = jsString
  
    //element.text = "try{callingAnonymousMethod();} catch(ex) {alert('error caught');}";
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(element);
} catch(err) {
  console.log("error caught", err);
} finally {
  console.log('run at the end')
  document.head.removeChild(element)
}
    // try {
    //  document.head.appendChild(script);
    // } catch (err) {
    //   console.log(err, 'ERROR ADDING SCRIPT')
    // }
  }
//   eval: (arg, callback) => {
//     var self = this

//     // wrap everything in an async function
//   var jsString = `(async() => {
//     ${arg}
// })().catch(${(err) => {
//   console.log('ERROR', err.message, "log-error")
//   console.log('STACK', err.stack.split("\n"), arg)
//   console.trace()
//   var caller_line = err.stack.split("\n")[2];
// var index = caller_line.indexOf("at ");
// var clean = caller_line.slice(index+2, caller_line.length);
// console.log('line', index, clean)
// }})`
//     var isError = false
//     try {
//       eval(jsString)
//       // log(jsString)
//       //log('')
//     } catch (e) {
//       isError = true
//       //console.log("logging", e, e.lineNumber)
//       // var err = e.constructor('Error in Evaled Script: ' + e.message);
//       // console.log(err.lineNumber)
//     //   log(e.message, "log-error")
//       //console.log('ERROR', JSON.stringify(e))
//     }
//   //  console.log('callback is', callback)
//     if(callback) callback(jsString, isError)
//   }
}
