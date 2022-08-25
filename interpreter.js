// const code = `
// i = 5
// a = 2 + 6 + i
// echo a
// `
// const code = `
// a = "hello world, "
// i = "kevin"
// echo a + i
// fun hello i
//   echo "Hello"
// `
const code = `
a = "hello world, "
i = "kevin"
e = 5
echo "Whaddup, dawg " + i
echo "vegan cheese"
echo e + 2

`

let vars = {}
const ast = generateAST(code)
interpret(ast)

function interpret(ast) {
  for (let item of ast) {
    if (item.type === 'VariableDeclaration') {
      if (item.declarations[0].init.type === 'BinaryExpression') {
        let flattenedBinaryExpression = flattenBinaryExpression(
          item.declarations[0].init
        )
        let sum = calculateFlattenedExpression(flattenedBinaryExpression)
        vars[item.declarations[0].id.name] = sum
      } else {
        let value = item.declarations[0].init.value
        if (isNumeric(value)) {
          vars[item.declarations[0].id.name] = Number(value)
        } else {
          vars[item.declarations[0].id.name] = value.slice(1, -1)
        }
      }
    }
    if (
      item.type === 'ExpressionStatement' &&
      item.expression.type === 'CallExpression'
    ) {
      if (item.expression.callee.name === 'echo') {
        let arguments = item.expression.arguments[0]
        if (arguments.type === 'Literal') {
          console.log(arguments.value)
        } else if (arguments.type === 'BinaryExpression') {
          let flat = flattenBinaryExpression(arguments)
          let calc = calculateFlattenedExpression(flat)
          console.log(calc)
        }
      }
    }
  }
}

function calculateFlattenedExpression(item) {
  return item.left.value + item.right.value
}

function flattenBinaryExpression(item) {
  if (
    item.value?.left?.type === 'Literal' &&
    item.value?.right?.type === 'Literal'
  ) {
    item.type = 'Literal'
    let leftValue
    let rightValue
    if (isNumeric(item.value.left.value)) {
      leftValue = Number(item.value.left.value)
    } else {
      leftValue = item.value.left.value
    }

    if (isNumeric(item.value.right.value)) {
      rightValue = Number(item.value.right.value)
    } else {
      rightValue = item.value.rigth.value
    }
    item.value = leftValue + rightValue
    return item
  }
  if (item.left?.type === 'BinaryExpression') {
    left = flattenBinaryExpression(item.left)
  }
  if (item.right?.type === 'BinaryExpression') {
    right = flattenBinaryExpression(item.right)
  }
  if (item.left?.type === 'Identifier') {
    if (isNumeric(vars[item.left.value])) {
      item.left.value = Number(vars[item.left.value])
    } else {
      item.left.value = vars[item.left.value]
    }
    item.left.type = 'Literal'
  }

  if (item.right?.type === 'Identifier') {
    if (isNumeric(vars[item.right.value])) {
      item.right.value = Number(vars[item.right.value])
    } else {
      item.right.value = vars[item.right.value]
    }
    item.right.type = 'Literal'
  }
  return item
}

function generateAST(code) {
  let program = []
  let lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) {
      continue
    }
    let lineParsed = lines[i].split(' ')

    // Read first word of line. If it is not a command, it is a variable
    if (!isCommand(lineParsed[0])) {
      if (isAssignment(lineParsed)) {
        let init = getInit(lines[i])
        if (!isBinaryExpression(init)) {
          let item = createItem('Literal', init.trim())
          program.push(createVariableDeclaration(lineParsed[0], item))
        } else {
          let exp = parseExpression(init)
          let binExp = createBinaryExpression(exp.left, exp.operator, exp.right)
          program.push(createVariableDeclaration(lineParsed[0], binExp))
        }
      }
    } else {
      let arguments = parseExpression(lineParsed.splice(1).join(' '))
      let expStatement = {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: lineParsed[0] },
          // arguments: [{ type: 'Identifier', name: lineParsed[1] }],
          arguments: [arguments],
        },
      }
      program.push(expStatement)
    }
  }
  return program
}

function parseExpression(str) {
  let parsed = str.match(/(.*)\+(.*)/)

  if (parsed === null) {
    str = str.trim()
    if (isLiteral(str)) {
      if (/"/.test(str)) {
        str = str.slice(1, -1)
      }
      return createItem('Literal', str)
    } else {
      return createItem('Identifier', str)
    }
  }
  let left = parsed[1].trim()
  let right = parsed[2].trim()
  if (isBinaryExpression(left)) {
    left = parseExpression(left)
  }
  if (isLiteral(left)) {
    if (/"/.test(left)) {
      left = left.slice(1, -1)
    }
    if (isNumeric(left)) {
      left = Number(left)
    }
    left = createItem('Literal', left)
  } else {
    if (left.operator) {
      left = createItem('BinaryExpression', left)
    } else {
      left = createItem('Identifier', left)
    }
  }
  if (isLiteral(right)) {
    if (/"/.test(right)) {
      right = right.slice(1, -1)
    }
    if (isNumeric(right)) {
      right = Number(right)
    }
    right = createItem('Literal', right)
  } else {
    if (right.operator) {
      right = createItem('BinaryExpression', right)
    } else {
      right = createItem('Identifier', right)
    }
  }
  return { type: 'BinaryExpression', left, operator: '+', right }
}

// Does binary expression exist outside of strings
function isBinaryExpression(str) {
  let plusses = str.match(/\+/g)
  if (plusses === null) return false
  const amountofPlusses = plusses.length
  const arr = extractStrings(str)
  if (arr === null) return true
  const matches = arr.filter((element) => {
    if (element.includes('+')) {
      return true
    }
  })
  amountofPlusses > matches ? true : false
}

function extractStrings(str) {
  const found = str.match(/"(.*?)"/g)
  return found
}

function isLiteral(item) {
  if (item === null) return false
  if (typeof item === 'object') return false
  item = item.trim()
  if (item.charAt(0) === '"' && item.charAt(item.length - 1) === '"') {
    return true
  }
  if (!isNaN(item)) return true
  return false
}

function createBinaryExpression(left, operator, right) {
  return { type: 'BinaryExpression', left, operator, right }
}

function createItem(type, value) {
  return { type, value }
}

function createVariableDeclaration(identifier, init) {
  let variableDeclaration = {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: identifier,
        },
        init,
      },
    ],
  }
  return variableDeclaration
}

function getInit(line) {
  const regexp = /(.*)=(.*)/g
  const parsed = [...line.matchAll(regexp)]
  return parsed[0][2]
}

function isAssignment(line) {
  if (line[1] === '=') {
    return true
  } else {
    return false
  }
}

function isCommand(cmd) {
  switch (cmd) {
    case 'echo':
      return true
    default:
      return false
  }
}

function isNumeric(num) {
  return !isNaN(num)
}

function echo(str) {
  console.log(str.slice(1, -1))
}
