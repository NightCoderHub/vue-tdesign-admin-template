const worker = new Worker(new URL('./exportWorker.js', import.meta.url), { type: 'module' });
export function exportExcel(data, header, filename = 'export.xlsx') {
  return new Promise((resolve, reject) => {
    worker.postMessage({ data, header, filename });

    worker.onmessage = (e) => {
      const { status, buffer, filename, type, message } = e.data;
      if (status === 'success') {
        const blob = new Blob([buffer], { type: type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        resolve();
      } else {
        reject(new Error(message));
      }
    };

    worker.onerror = (error) => {
      reject(new Error('Web Worker error: ' + error.message));
    };
  });
}