import writeXlsxFile from 'write-excel-file';
import { saveAs } from 'file-saver';
import { formatTime } from './formatHelper';

export const downloadExcel = async (data, fileName) => {
    try {
        const fieldNames = Object.keys(data[0]);
        const wsData = [
            fieldNames.map((fieldName) => ({ value: fieldName }))
        ];

        data.forEach((item) => {
            const row = fieldNames.map((fieldName) => {
                if ([fieldName.toLowerCase() === 'timespent']) {
                    return { value: item[fieldName] };
                } else if (['time', 'date', 'created', 'received', 'updated'].some(keyword => fieldName.toLowerCase().includes(keyword))) {
                    return { value: formatTime(item[fieldName]) };
                }
                return { value: item[fieldName] };
            });
            wsData.push(row);
        });

        const buffer = await writeXlsxFile(wsData, {
            headerStyle: {
                fontWeight: 'bold'
            },
            buffer: true
        });

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
    } catch (error) {
        console.error("Error during export:", error);
        window.alert("Error during export");
    }
};