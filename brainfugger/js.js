const input = document.getElementById("input");
const textEditor = document.getElementById("textEditor");
const log = document.getElementById("log");
log.innerHTML = "Command line thingy\n\nEnter 'commands' to see list of commands\n\n\n   >> ";

const commands = ["commands", "info", "files", "run", "read", "edit", "create", "rename", "delete", "lock", "eval", "clear"];
const keywords = [];
const fileTypes = ["txt", "bf"];
const hex = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  a: "1010",
  b: "1011",
  c: "1100",
  d: "1101",
  e: "1110",
  f: "1111",
}
var lockedFiles = ["Info.txt", "Commands.txt"]
var programNames = ["Hello.txt", "Info.txt", "Commands.txt", "Hello.bf", "Echo.bf"];
var programs = [
"Hello, world!",

"This thingy kind of imitates a command line. Check 'commands' for a list of commands.",

"Commands are:\n\n\n\
commands  Reads file 'Commands.txt'. Lists all commands.\n\n\
info      Reads file 'Info.txt'. Gives some information about this.\n\n\
files     Lists all files.\n\n\
run       Runs a script. Not available yet. 1 operand: the file's name.\n\n\
read      Displays a file. 1 operand: the file's name.\n\n\
edit      Allows you to edit a file. 1 operand: the file's name.\n\n\
create    Creates an empty file. 1 operand: the new file's name.\n\n\
rename    Renames a file. 2 operands: the file's old name, and its new name.\n\n\
delete    Deletes a file. 1 operand: the file's name.\n\n\
lock      PERMANENTLY locks a file, preventing it from ever being changed or deleted.\n\
          1 operand: the file's name.\n\n\
eval      Evaluates an expression. It cannot contain any letters other than inside strings.\n\
          Strings can only be enclosed by double quotes, not single quotes or backticks.\n\
          1 operand (kind of): the expression you to evaluate.\n\n\
clear     Clears this console.",

"alloc 5\n\
++++++++++[>+++++++>++++++++++>+++>+<<<<-] >++.>+.+++++++..+++.>++.\n\
<<+++++++++++++++.>.+++.------.--------.>+.>.",

"alloc 1 ,[.,]"
];

var editMode = "";

input.addEventListener("keydown", function(e) {if (e.key == "Enter") {cycle();}});

function cycle() {
  var out = "";
  var command = input.textContent.split(" ");
  switch (command[0]) {
    case commands[0]:
      out = programs[programNames.indexOf("Commands.txt")];
      break;
    case commands[1]:
      out = programs[programNames.indexOf("Info.txt")];
      break;
    case commands[2]:
      out = programNames;
      break;
    case commands[3]:
      out = "File does not exist";
      if (programNames.includes(command[1])) {
        let type = command[1].split(".")[1];
        switch (type) {
          case "txt":
            out = "Cannot run a txt file";
            break;
          case "bf":
            out = runBrainfugger(programs[programNames.indexOf(command[1])]);
            break;
        }
      }
      break;
    case commands[4]:
      out = "File does not exist";
      if (programNames.includes(command[1])) {
        out = programs[programNames.indexOf(command[1])];
      }
      break;
    case commands[5]:
      out = "File does not exist";
      if (programNames.includes(command[1])) {
        if (lockedFiles.includes(command[1])) {out = "Cannot edit this file, it is locked"; break;}
        edit(command[1], programs[programNames.indexOf(command[1])]);
        out = "Editing " + command[1];
      }
      break;
    case commands[6]:
      out = "Invalid file name";
      var name = command[1].split(".");
      if (name.length == 2) {
        if (commands.includes(name[0])) {break;}
        if (programNames.includes(command[1])) {out = "Name already taken"; break;}
        if (fileTypes.includes(name[1])) {
          programNames.push(command[1]);
          programs.push("");
          out = "File "+command[1]+" created";
        }
      }
      break;
    case commands[7]:
      out = "File does not exist";
      if (programNames.includes(command[1])) {
        if (lockedFiles.includes(command[1])) {out = "Cannot rename this file, it is locked"; break;}
        out = "Invalid file name";
        var name = command[2].split(".");
        if (name.length == 2) {
          if (programNames.includes(command[2])) {out = "Name already taken"; break;}
          if (commands.includes(name[0])) {break;}
          if (fileTypes.includes(name[1])) {
            programNames.splice(programNames.indexOf(command[1]), 1, command[2]);
            out = "File "+command[1]+" renamed "+command[2];
          }
        }
      }
      break;
    case commands[8]:
      out = "File does not exist";
      if (programNames.includes(command[1])) {
        if (lockedFiles.includes(command[1])) {out = "Cannot delete this file, it is locked"; break;}
        programs.splice(programNames.indexOf(command[1]), 1);
        programNames.splice(programNames.indexOf(command[1]), 1);
        out = command[1] + " deleted";
      }
      break;
    case commands[9]:
      out="Cannot evaluate";
      var i = command.slice(1, command.length).flatMap(i => i.split(""));
      if (evalCheck(i)) {
        try {out = String(eval(i.join("")))} catch(err) {};
      }
      break;
    case commands[10]:
      log.value = log.value.substring(0, 70);
      out = "Console cleared";
      break;

    default:
      out = "Command not recognized";
      break;
  }
  log.value += input.textContent + "\n\n" + out + "\n\n" + "   >> ";
  log.scrollTop = log.scrollHeight;
  input.innerHTML = "";
}

function edit(name, file) {
  editMode = name;
  input.contentEditable = "false";
  input.style.backgroundColor = "grey";
  [...document.getElementsByClassName("textEditor")].forEach((e) => {e.style.display = "block";});
  textEditor.value = file;
}
//  v function exitEditMode() {} v
document.getElementById("submitText").addEventListener("mouseup", function() {
  if (editMode != "") {
    input.contentEditable = "true";
    input.style.backgroundColor = "white";
    programs[programNames.indexOf(editMode)] = textEditor.value;
    log.value=log.value.substring(0,log.value.length-12-editMode.length)+"ed"+log.value.substring(log.value.length-9-editMode.length);
    editMode = "";
    [...document.getElementsByClassName("textEditor")].forEach((e) => {e.style.display = "none";});
  }
});

function runBrainfugger(file) {
  if (!/^alloc\s*\d+\s*[+-><\[\].,\s\(\)]+$/.test(file)) {return "Invalid brainfugger code";}
  const memSpace = Number(file.match(/alloc\s*(\d+)/)[1]);
  if (memSpace === 0) {return "Program cannot have no memory";}
  if (memSpace > 65535) {return "Program memory limit is 65535";}
  let mem = new Array(memSpace).fill(0);
  let ptr = 0;
  let line = 1;
  let loopLayer = 0;
  let commentLayer = 0;
  let out = "";
  for (let i = file.match(/alloc\s*\d+/)[0].length; i < file.length; i++) {
    if (commentLayer  &&  file[i] !== ")") {continue;}
    switch (file[i]) {
      case "+":
        mem[ptr]++;
        if (mem[ptr] === 65536) {mem[ptr] -= 65536;}
        break;
      case "-":
        mem[ptr]--;
        if (mem[ptr] === -1) {mem[ptr] += 65536;}
        break;
      case ">":
        ptr++;
        if (ptr === memSpace) {return "Memory pointer past allocated space, line " + line;}
        break;
      case "<":
        ptr--;
        if (ptr === -1) {return "Negative memory pointer, line " + line;}
        break;
      case "[":
        if (mem[ptr] === 0) {
          while (file[i] !== "]") {i++;}
        } else {loopLayer++;}
        break;
      case "]":
        if (loopLayer === 0) {return "Unmatched ] loop end, line " + line;}
        if (mem[ptr] === 0) {
          loopLayer--;
        } else {
          while (file[i] !== "[") {i--;}
        }
        break;
      case ".":
        out += String.fromCharCode(mem[ptr]);
        break;
      case ",":
        let testinput = prompt("Input number or character");
        if (testinput === null) {
          mem[ptr] = 0;
        } else if (/^\d+$/.test(testinput)) {
          mem[ptr] = Number(testinput);
        } else {
          mem[ptr] = testinput.charCodeAt(0);
        }
        break;
      case "(":
        commentLayer++;
        break;
      case ")":
        if (commentLayer === 0) {return "Unmatched ) comment end, line " + line;}
        commentLayer--;
        break;
      case "\n":
        line++;
        break;
      case " ":
        break;
      default:
        return "Invalid character, line " + line;
    }
  }
  if (loopLayer > 0) {return "Unmatched [ loop start";}
  if (commentLayer > 0) {return "Unmatched ( comment start";}
  return out;
}

function evalCheck(a) {
  var string = false; var returne = true;
  a.forEach((e, i) => {
    if (e == '"') {string = !string;}
    if (string  ||  e == '"') {
      if (i == a.length - 1  &&  !(e == '"' && !string)) {returne = false;}
    } else {
      if ('0123456789+-*/().'.indexOf(e) == -1) {returne = false;}
    }
  });
  return returne;
}
function onlyContains(a,b) {
  for (let e of a) {if (b.indexOf(e) == -1) {return false;}}
  return true;
}
function _16BitHexNum(n) {
  return (n.length == 4  &&  onlyContains(n, "0123456789abcdef"));
}
function _2BitBinNum(n) {
  return (n.length == 16  &&  onlyContains(n, "01"));
}