// const log = require('./log.js').log
export default {
  eval: (arg, callback) => {
    var self = this

    // wrap everything in an async function
  var jsString = `(async() => {
    ${arg}
})().catch(${(err) => {
  console.log('ERROR', err.message, "log-error")
  console.log('STACK', err.stack.split("\n"), arg)
  console.trace()
  var caller_line = err.stack.split("\n")[2];
var index = caller_line.indexOf("at ");
var clean = caller_line.slice(index+2, caller_line.length);
console.log('line', index, clean)
}})`
    var isError = false
    try {
      eval(jsString)
      // log(jsString)
      //log('')
    } catch (e) {
      isError = true
      //console.log("logging", e, e.lineNumber)
      // var err = e.constructor('Error in Evaled Script: ' + e.message);
      // console.log(err.lineNumber)
    //   log(e.message, "log-error")
      //console.log('ERROR', JSON.stringify(e))
    }
  //  console.log('callback is', callback)
    if(callback) callback(jsString, isError)
  }
}
