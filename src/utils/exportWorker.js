import exceljs from "exceljs";

onmessage = async (e) => {
  const { data, header, filename } = e.data;

  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add header row
    worksheet.columns = header.map((key) => ({ header: key, key: key, width: 15 }));

    // Add data rows
    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();

    postMessage({
      status: "success",
      filename: filename,
      buffer: buffer,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (error) {
    postMessage({
      status: "error",
      message: error.message,
    });
  }
};
