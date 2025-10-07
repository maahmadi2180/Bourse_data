import React, { useState, useEffect, useCallback } from 'react';
import { DataPoint } from './types';
import { fetchAndParseSheetData } from './services/googleSheetService';
import ChartCard from './components/ChartCard';

const chartColors = [
  '#38bdf8', // sky-400
  '#34d399', // emerald-400
  '#facc15', // yellow-400
  '#fb923c', // orange-400
  '#f87171', // red-400
  '#a78bfa', // violet-400
  '#ec4899', // pink-400
  '#22d3ee', // cyan-400
];

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-xl text-gray-300">در حال بارگذاری داده‌ها...</p>
    </div>
);


const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [columnKeys, setColumnKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      const { data: sheetData, columnKeys: keys } = await fetchAndParseSheetData();
      setData(sheetData);
      setColumnKeys(keys);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("یک خطای ناشناخته رخ داده است.");
        }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData(true); // Initial data load with loading indicator
    const refreshInterval = setInterval(() => {
        loadData(); // Subsequent refreshes without loading indicator
    }, 60000); // Refresh every 60 seconds

    return () => {
      clearInterval(refreshInterval); // Clean up interval on component unmount
    };
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">داشبورد تحلیل داده</h1>
          <p className="mt-2 text-lg text-gray-400">نمایش پویا و تعاملی داده‌ها از گوگل شیت</p>
        </header>
        
        <main>
          {loading && (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">خطا!</strong>
              <span className="block sm:inline mr-2">{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {columnKeys
                .filter(key => key && key.trim() !== '' && key.trim().toLocaleLowerCase() !== 'تاریخ')
                .map((key, index) => (
                <ChartCard 
                  key={key} 
                  data={data} 
                  dataKey={key} 
                  title={key}
                  color={chartColors[index % chartColors.length]}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;