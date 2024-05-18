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

function extratc_sz_data(data){
  const regex = /Bytes Sent: (\d+)\/ (\d+) BPS:(\d+) ETA (\d{2}:\d{2})/;
  const match = data.match(regex);

  if (match) {
      const bytesSent = match[1];
      const totalBytes = match[2];
      const bps = match[3];
      const eta = match[4];

      console.log("Bytes Sent:", bytesSent);
      console.log("Total Bytes:", totalBytes);
      console.log("BPS:", bps);
      console.log("ETA:", eta);
      logger(`Bytes Sent: ${bytesSent}, Total Bytes: ${totalBytes}, BPS: ${bps}, ETA: ${eta}, Percentage: ${((bytesSent / totalBytes) * 100).toFixed(2)}%`)
  } else {
      console.log("No match found.");
  }
}

  pty.on("data", (data) => {
      console.log("pty.on ", data)
      // zsentry.consume(data);Bytes Sent
      if(containsPattern(data, "containsPattern"))
        extratc_sz_data(data)
      if(containsPattern(data, "Transfer incomplete"))
        logger("transfer failed")
      else if(containsPattern(data, "Timeout"))
        logger("timeout")
      else if(containsPattern(data, "Transfer complete"))
        logger("complete")
      else
        extratc_sz_data(data)
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
