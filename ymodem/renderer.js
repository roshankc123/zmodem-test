document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const portInput = document.getElementById('portInput');
    const baudRateInput = document.getElementById('baudRateInput');
    const uploadButton = document.getElementById('uploadButton');
    const progressOutput = document.getElementById('progressOutput');
    const logOutput = document.getElementById('logOutput');

    uploadButton.addEventListener('click', async () => {
        const filePath = fileInput.files[0].path;
        const portPath = portInput.value;
        const baudRate = parseInt(baudRateInput.value, 10);

        const result = await window.electron.transferFile(filePath, portPath, baudRate);
        if (result.status === 'success') {
            console.log('File transfer initiated successfully');
        } else {
            console.error('File transfer failed:', result.message);
        }
    });

    window.electron.onTransferProgress((progress) => {
        progressOutput.textContent = `Progress: ${progress}%`;
    });

    window.electron.onTransferLog((log) => {
        const logEntry = document.createElement('div');
        logEntry.textContent = log;
        logOutput.appendChild(logEntry);
    });
});
