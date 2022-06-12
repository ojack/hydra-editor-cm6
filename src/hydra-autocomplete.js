import { syntaxTree } from "@codemirror/language"
import hydraLang from './hydra-lang.js'

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
  "VariableDefinition", "PropertyDefinition"]

const getObjectFromName = (name = '') => {
  const last = name.split('.')
  return last[last.length - 1].replace('(', '').replace(')', '')
}

const getFunctionText = (f = () => { }) => {
  const str = f.toString()
  return str.split("{")[0]
}

const createAutocomplete = ({ hydraConstants, srcOptions, setFunctionOptions, externalSourceOptions, combineNames, chainOptions, outputOptions, hydraGlobals }) => (context) => {
  let word = context.matchBefore(/\w*/)
  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)

  const parseArguments = (node) => {
    let object = node.parent?.getChild('Expression')
    let variableName = context.state.sliceDoc(object.from, object.to)
    let lastValue = getObjectFromName(variableName)
    // console.log('last value', lastValue, combineNames)
    if (lastValue === 'out') {
      return outputOptions
    }
    if (combineNames.includes(lastValue)) {
      return [...srcOptions, ...outputOptions, ...externalSourceOptions]
    }
  if (lastValue === 'src') {
    return [...externalSourceOptions, ...outputOptions]
  }

  if (lastValue === 'setFunction') {
    return setFunctionOptions
  }

  // return [{ label: '< custom arrow function >', apply: `() => {
  //   /* replace with your own */
  //   return 1
  // }`}]
 /// return [{ label: '() => Math.sin(time*0.1)', detail: 'oscillate in time'}]
  return []
}

console.log('before', nodeBefore.name, nodeBefore.parent?.name, nodeBefore.parent?.parent?.name,)

if (nodeBefore.name === 'ArrowFunction' || nodeBefore.parent?.name === 'ArrowFunction') {
  // console.log('arrow function!')
  return { from: word.from, options: [...hydraConstants] }
}

// filling in parameters inside parenthesis
if (nodeBefore.parent?.name === 'ArgList') {
  const options = parseArguments(nodeBefore.parent)
  return { from: word.from, options }
}

if (nodeBefore.name === 'ArgList') {
  const options = parseArguments(nodeBefore)
  return { from: word.from, options }
}

// following a '.'
if (completePropertyAfter.includes(nodeBefore.name) &&
  nodeBefore.parent?.name == "MemberExpression") {
  let object = nodeBefore.parent.getChild("Expression")
  // console.log('expression name', object?.name)
  // object such as s0, s1, or a
  if (object?.name === "VariableName") {
    // s0, s1, a,
    let variableName = context.state.sliceDoc(object.from, object.to)
    // console.log('completing properties on object', variableName)
    const obj = window[variableName]
    if (nodeBefore.parent?.parent?.name === 'ArrowFunction') {
      const options = Object.keys(obj).map((o) => ({ label: o }))
      // console.log('calculating options', options)
      return { from: word.from, options }
    } else {
      const options = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).map((o) => ({ label: o, info: getFunctionText(obj[o]) }))
      return { from: word.from, options }
    }
    // console.log('completeing props for', typeof obj, obj.constructor.name)
    // after a hydra function such as osc()
  } else if (object?.name === "CallExpression") {
    let variableName = context.state.sliceDoc(object.from, object.to)
    return {
      from: word.from,
      options: chainOptions,
      // filter: false
    }
    // console.log('completing expression on object', variableName)
  }
}
if (nodeBefore.name === 'Script' || nodeBefore.parent?.name === 'Script' || nodeBefore.parent?.parent?.name === 'Script') {
  return {
    from: word.from,
    options: [...srcOptions, ...hydraGlobals]
  }
}
return null

// return {
//   from: word.from,
//   options: [...srcOptions, ...hydraGlobals]
// }
}

export default (hydra) => {
  const autocompleteOptions = hydraLang(hydra)
  return createAutocomplete(autocompleteOptions)
}

