import { DataPoint } from '../types';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1DIGrcCCankqnKvRqPuEOKO4liv8HiF39rv-8IC7tbFU/export?format=csv&gid=1121823434';

export const fetchAndParseSheetData = async (): Promise<{ data: DataPoint[]; columnKeys: string[] }> => {
  try {
    // Add a cache-busting parameter to the URL to prevent browsers from serving stale data
    const url = `${GOOGLE_SHEET_CSV_URL}&_=${new Date().getTime()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const csvText = await response.text();
    // Use a regex to handle both \n and \r\n line endings for better compatibility
    const lines = csvText.trim().split(/\r?\n/).map(line => line.trim());
    
    if (lines.length < 2) {
      return { data: [], columnKeys: [] };
    }

    const headers = lines[0].split(',');
    const columnKeys = headers.slice(1);

    const data: DataPoint[] = lines.slice(1).map(line => {
      const values = line.split(',');
      const dataPoint: DataPoint = { date: values[0] };

      columnKeys.forEach((key, index) => {
        const value = values[index + 1];
        const parsedValue = parseFloat(value);
        dataPoint[key] = isNaN(parsedValue) ? null : parsedValue;
      });
      
      return dataPoint;
    });

    return { data, columnKeys };

  } catch (error) {
    console.error("Error fetching or parsing Google Sheet data:", error);
    throw new Error("امکان دریافت اطلاعات از گوگل شیت وجود ندارد. لطفا از عمومی بودن شیت و درستی لینک اطمینان حاصل کنید.");
  }
};