// START FS

// Installs globals onto window:
// * Buffer
// * require (monkey-patches if already defined)
// * process
// You can pass in an arbitrary object if you do not wish to pollute
// the global namespace.
BrowserFS.install(window);
// Configures BrowserFS to use the LocalStorage file system.
BrowserFS.configure(
  {
    fs: "LocalStorage",
  },
  function (e) {
    if (e) {
      // An error happened!
      throw e;
    }
    // Otherwise, BrowserFS is ready-to-use!
  }
);

var fs = require("fs");
const username = "nake89";
const homeDir = `/home/${username}`;
init();
touch("welcome.txt");
const files = ls();
console.log(files);

function init() {
  if (fs.existsSync("/home")) {
    process.chdir(homeDir);
  } else {
    initializeFileSystem();
    process.chdir(homeDir);
  }
}

function touch(filename) {
  fs.writeFileSync(`${homeDir}/${filename}`, "");
}

function ls() {
  const arr = [];
  fs.readdirSync(homeDir).forEach((file) => {
    arr.push(file);
  });
  return arr;
}

function rm(filename) {
  fs.unlinkSync(`${homeDir}/${filename}`);
}

function initializeFileSystem() {
  fs.mkdirSync("/home");
  fs.mkdirSync("/home/" + username);
  fs.readdirSync(".").forEach((file) => {
    console.log(file);
  });
}

// END FS

let shellVariables = {
  SHELL: "kesh",
};

const LEFT_MARGIN = 32;

updateTerminalInput("");
let terminalContent = [];
document.getElementById("input").addEventListener("keyup", (e) => {
  debug(e);
  console.log(terminalContent);
  updateTerminalInput(e.target.value);
  if (e.key === "Enter" || e.keyCode === 13) {
    console.log("Value: " + e.target.value)
    terminalContent.push("$ " + e.target.value);
    parseUserInput(e.target.value);
    // let terminalContentHTML = terminalContent.map((x) => '$ ' + x).join('<br>')
    let terminalContentHTML = terminalContent.join("<br>");
    document.getElementById("terminalContent").innerHTML = terminalContentHTML;
    e.target.value = "";
    updateTerminalInput("");
    debug(e);
    window.scrollTo(0, document.body.scrollHeight);
  }
});

function parseUserInput(input) {
  if (/^\S*$/.test(input)) {
    command(input);
  } else {
    const splitted = input.split(" ")
    splitted.shift()
    command(input.split(" ")[0], splitted.join(" "));
  }
}
function whoami(arg = null) {
  if (arg) {
    terminalContent.push("usage: whoami");
  } else {
    terminalContent.push(username);
  }
}

function echo(arg = null) {
  if (arg && arg.charAt(0) === "$") {
    const theVar = arg.substring(1);
    const variableResult = shellVariables[theVar];
    terminalContent.push(variableResult);
  } else {
    let strWithoutQuotes = arg.replace(/^"(.*)"$/, '$1');
    terminalContent.push(strWithoutQuotes);
  }
}

function command(cmd, arg = null) {
  if (cmd === "whoami") {
    whoami(arg);
  } else if (cmd === "echo") {
    echo(arg);
  } else if (cmd === "clear") {
    terminalContent = [];
  } else if (cmd === "ls") {
    terminalContent.push(ls().join(" "));
  } else if (cmd === "touch") {
    touch(arg);
  } else if (cmd === "rm") {
    rm(arg);
  } else if (cmd === "pwd") {
    terminalContent.push(process.cwd());
  } else if (cmd === "ls -la") {
    terminalContent.push("total 124");
    terminalContent.push("drwxr-xr-x 31 nake89 nake89 4096 23. 8. 21:56 .");
    terminalContent.push("drwx------ 38 nake89 nake89 4096 23. 8. 22:17 ..");
    terminalContent.push(
      "-rw-r--r--   1 nake89 nake89       431 11. 8. 11:44  about.txt"
    );
    terminalContent.push(
      "-rw-r--r--   1 nake89 nake89       763 14. 8. 13:37  intro.txt"
    );
    terminalContent.push(
      "drwxr-xr-x 10 nake89 nake89 4096  23. 8. 15:10 posts"
    );
  } else {
    terminalContent.push("command not found: " + cmd);
  }
}

function updateTerminalInput(msg) {
  document.getElementById("terminal").innerText = "$ " + msg;
}

function debug(e) {
  let inputLength = e.target.value.length;
  let cursorPosition = e.target.selectionStart;
  let cursor = document.getElementById("cursor");
  cursor.style.left = `${cursorPosition * 12 + LEFT_MARGIN}px`;
  // let debugMessage = `<br>DEBUG.<br> Caret at: ${e.target.selectionStart}<br>input length: ${e.target.value.length}`
  // document.getElementById('debug').innerHTML = debugMessage
}

document.getElementById("input").focus();
