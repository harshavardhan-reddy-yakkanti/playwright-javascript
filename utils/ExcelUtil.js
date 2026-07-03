import ExcelJs from "exceljs";
import path from "path";

const filePath = path.join(process.cwd(), "tests", "testData", "TestDataE2E_v0.1_Web.xlsx");
const valueLocation = {
    row: 1,
    column: 1
}
export async function readExcelFile(filePath,actual) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet("Sheet1");
    worksheet.eachRow((row, rownumber) => {
        row.eachCell((cell, cellnumber) => {
            console.log(cell.value);
            if (cell.value === actual) {
                valueLocation.row = rownumber;
                valueLocation.column = cellnumber
            }
        })
    })
    return workbook;

}
export async function writeExcelFile(filePath,actual,expected) {


    const workbook = await readExcelFile(filePath,actual);

    const worksheet = workbook.getWorksheet("Sheet1");

    worksheet.getCell(valueLocation.row, valueLocation.column).value = expected;

    await workbook.xlsx.writeFile(filePath);
}

async function getValueFromExcel(sheetName, columnName, columnValue, requiredColumnName) {
    const workbook = new ExcelJs.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
        throw new Error(`Sheet not found: ${sheetName}`);
    }

    let searchColumnNumber = 0;
    let requiredColumnNumber = 0;
    let matchingRowNumber = 0;

    // Find column numbers from header row
    for (let col = 1; col <= worksheet.columnCount; col++) {
        const headerValue = worksheet.getCell(1, col).value;

        if (headerValue === columnName) {
            searchColumnNumber = col;
        }

        if (headerValue === requiredColumnName) {
            requiredColumnNumber = col;
        }
    }

    if (searchColumnNumber === 0) {
        throw new Error(`Column not found: ${columnName}`);
    }

    if (requiredColumnNumber === 0) {
        throw new Error(`Required column not found: ${requiredColumnName}`);
    }

    // Find matching row
    for (let row = 2; row <= worksheet.actualRowCount; row++) {
        const cellValue = worksheet.getCell(row, searchColumnNumber).value;

        if (cellValue === columnValue) {
            matchingRowNumber = row;
            break;
        }
    }

    if (matchingRowNumber === 0) {
        throw new Error(`Value not found: ${columnValue} in column ${columnName}`);
    }

    let requiredValue = worksheet.getCell(matchingRowNumber, requiredColumnNumber).value;

    // Handle object values like hyperlink/rich text
    if (requiredValue && typeof requiredValue === "object") {
        if (requiredValue.text) {
            requiredValue = requiredValue.text;
        } else if (requiredValue.result) {
            requiredValue = requiredValue.result;
        } else if (requiredValue.richText) {
            requiredValue = requiredValue.richText.map(item => item.text).join("");
        }
    }

    console.log("Required Value is:", requiredValue);

    return requiredValue;
}



//await getValueFromExcel("LoginDetails", "Test Scenario Name", "E2E_Login_FR", "Password");

//await writeExcelFile(filePath,"Amend_FR","CHANGED VALUE");
