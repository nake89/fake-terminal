const code = `
i = 5
a = 2 + 6 + i
echo a
`

generateAST(code)

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
          let item = createItem('Literal', lineParsed[2])
          program.push(createVariableDeclaration(lineParsed[0], item))
        } else {
          let exp = parseExpression(init)
          let binExp = createBinaryExpression(exp.left, exp.operator, exp.right)
          program.push(createVariableDeclaration(lineParsed[0], binExp))
        }
      }
    } else {
      let expStatement = { type: 'ExpressionStatement', expression: {} }
    }
  }
  console.log(JSON.stringify(program, null, 2))
}

function parseExpression(str) {
  let parsed = str.match(/(.*)\+(.*)/)
  let left = parsed[1].trim()
  let right = parsed[2].trim()
  if (isBinaryExpression(left)) {
    left = parseExpression(left)
  }
  if (isLiteral(left)) {
    left = createItem('Literal', left)
  } else {
    left = createItem('Identifier', left)
  }
  if (isLiteral(right)) {
    right = createItem('Literal', right)
  } else {
    right = createItem('Identifier', right)
  }
  return { left, operator: '+', right }
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
  if (item.charAt(0) === '"' && item.charAt(-1) === '"') {
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
