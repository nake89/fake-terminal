console.log('start')
const LEFT_MARGIN = 32

updateTerminalInput('')
let terminalContent = []
document.getElementById('input').addEventListener('keyup', (e) => {
  debug(e)
  console.log(terminalContent)
  updateTerminalInput(e.target.value)
  if (e.key === 'Enter' || e.keyCode === 13) {
    terminalContent.push(e.target.value)
    let terminalContentHTML = terminalContent.map((x) => '$ ' + x).join('<br>')
    document.getElementById('terminalContent').innerHTML = terminalContentHTML
    e.target.value = ''
    updateTerminalInput('')
    debug(e)
  }
})

function updateTerminalInput(msg) {
  document.getElementById('terminal').innerText = '$ ' + msg
}

function debug(e) {
  let inputLength = e.target.value.length
  let cursorPosition = e.target.selectionStart
  let cursor = document.getElementById('cursor')
  cursor.style.left = `${cursorPosition * 12 + LEFT_MARGIN}px`
  // let debugMessage = `<br>DEBUG.<br> Caret at: ${e.target.selectionStart}<br>input length: ${e.target.value.length}`
  // document.getElementById('debug').innerHTML = debugMessage
}

document.getElementById('input').focus()
