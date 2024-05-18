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
// const {Zmodem} = require('zmodem.js');

InitElectronExapmle = (terminal) => {
  const port = '/dev/ttyUSB0';
  // const port = '/dev/ttys006';


  const cmd = window.platform === "win32" ? "powershell.exe" : "bash";
  const pty = window.spawnPTY(cmd, [], {
    name: "xterm-color",
    // cols: term.cols,
    // rows: term.rows,
    // encoding: null,
  });
  // console.log(pty)
  
  function containsPattern(str, pattern) {
    // Create a regular expression object from the pattern
    const regex = new RegExp(pattern);

    // Test the string against the regular expression
    return regex.test(str);
}


  pty.on("data", (data) => {
      console.log("pty.on ", data)
      // zsentry.consume(data);
      if(containsPattern(data, "Transfer incomplete"))
        logger("trasnfer failed")
      else if(containsPattern(data, "Timeout"))
        logger("timeout")
      else
        logger(data)
    });

    // pty.write("hello")
  


  const logger = (text)=>{
    console.log(text)
    const paragraph = document.createElement('p');
      // Set the text content with multiple lines
    paragraph.textContent = text;
    paragraph.style.color = 'white';
    terminal.appendChild(paragraph)
  }


  const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');

    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
          console.log(file)
          // send file using sz command pty.write("hello")
          pty.write(`sz ${file.path} > ${port} < ${port}\n`)
        } else {
            console.log('No file selected');
        }
    });

};
