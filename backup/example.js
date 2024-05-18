/**
 * trzsz: https://github.com/trzsz/trzsz.js
 * Copyright(c) 2022 Lonny Wong <lonnywong@qq.com>
 * @license MIT
 */

/**
 * Initialize electron example for trzsz
 * @function
 * @param {object} terminal - the div element for xterm
 */

// const { SerialPort, ReadlineParser } = require('serialport')

InitElectronExapmle = (terminal) => {
  const term = new Terminal();

  // const cmd = window.platform === "win32" ? "powershell.exe" : "bash";
  // const pty = window.spawnPTY(cmd, [], {
  //   name: "xterm-color",
  //   cols: term.cols,
  //   rows: term.rows,
  //   encoding: null,
  // });
  // console.log(pty)


  const logger = (text)=>{
    console.log(text)
    const paragraph = document.createElement('p');
      // Set the text content with multiple lines
    paragraph.textContent = text;
    paragraph.style.color = 'white';
    terminal.appendChild(paragraph)
  }

  const port = window.connectPort("/dev/ttyUSB0");

  port.on('error', function(err) {
    console.log('Error: ', err.message)
  })

  // Switches the port into "flowing mode"
  // port.on('data', function (data) {
  //   console.log('from example.js Data:', data)
  // })

  const trzsz = window.newTrzsz(
    // write the server output to the terminal
    (output) => {
      // console.log("output: ", output)
      logger(output)
    },
    // send the user input to the server
    (input) => {
      // console.log("input", input)
      // pty.write(input)
      // terminal.("hello")
      // console.log(terminal)
      port.write(input)
      // logger(input)
      // port write
    },
    // the terminal columns
    10,
    // there is a windows shell
    window.platform === "win32"
  );
  console.log(port)
  window.observePort(port, trzsz)

  // logic to send data
  // const parser = new ReadlineParser()
  // port.pipe(parser)
  // port.on('data', console.log)
  // parser.on('data', (data) => {
  //   console.log("pty.on ", data)
  //   trzsz.processServerOutput(data)
  // });
  // let trzsz process the server output
  // pty.on("data", (data) => {
  //   console.log("pty.on ", data)
  //   trzsz.processServerOutput(data)
  // });

  // enable drag files or directories to upload
  terminal.addEventListener("dragover", (event) => event.preventDefault());
  terminal.addEventListener("drop", (event) => {
    event.preventDefault();
    console.log(event.dataTransfer.items)
    trzsz
      .uploadFiles(event.dataTransfer.items)
      .then(() => console.log("upload success"))
      .catch((err) => console.log(err));
  });
};
