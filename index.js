console.log('start')
const LEFT_MARGIN = 32

updateTerminalInput('')
let terminalContent = []
document.getElementById('input').addEventListener('keyup', (e) => {
  debug(e)
  console.log(terminalContent)
  updateTerminalInput(e.target.value)
  if (e.key === 'Enter' || e.keyCode === 13) {
    terminalContent.push('$ ' + e.target.value)
    command(e.target.value)
    // let terminalContentHTML = terminalContent.map((x) => '$ ' + x).join('<br>')
    let terminalContentHTML = terminalContent.join('<br>')
    document.getElementById('terminalContent').innerHTML = terminalContentHTML
    e.target.value = ''
    updateTerminalInput('')
    debug(e)
  }
})

function command(cmd) {
  if (cmd === 'whoami') {
    terminalContent.push('nake89')
  } else if (cmd === 'clear') {
    terminalContent = []
  } else if (cmd === 'ls') {
    terminalContent.push('about.txt intro.txt posts/ ')
  } else if (cmd === 'pwd') {
    terminalContent.push('/home/nake89')
  } else if (cmd === 'ls -la') {
    terminalContent.push('total 124')
    terminalContent.push('drwxr-xr-x 31 nake89 nake89 4096 23. 8. 21:56 .')
    terminalContent.push('drwx------ 38 nake89 nake89 4096 23. 8. 22:17 ..')
    terminalContent.push(
      '-rw-r--r--  1 nake89 nake89       431 11. 8. 11:44  about.txt'
    )
    terminalContent.push(
      '-rw-r--r--  1 nake89 nake89       763 14. 8. 13:37  intro.txt'
    )
    terminalContent.push('drwxr-xr-x 10 nake89 nake89 4096  23. 8. 15:10 posts')
  }
}

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
