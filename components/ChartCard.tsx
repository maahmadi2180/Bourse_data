import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { DataPoint } from '../types';

interface ChartCardProps {
  data: DataPoint[];
  dataKey: string;
  title: string;
  color: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = typeof value === 'number' ? value.toLocaleString('fa-IR') : value;
      return (
        <div className="bg-gray-700/80 backdrop-blur-sm p-3 border border-gray-600 rounded-lg shadow-lg text-white">
          <p className="label font-semibold">{`تاریخ: ${label}`}</p>
          <p className="intro" style={{ color: payload[0].color }}>{`${payload[0].name}: ${formattedValue}`}</p>
        </div>
      );
    }
  
    return null;
  };

const formatYAxisTick = (tick: number): string => {
    if (tick === null || isNaN(tick)) return '';
    if (Math.abs(tick) >= 1_000_000_000) {
        return `${(tick / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (Math.abs(tick) >= 1_000_000) {
        return `${(tick / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (Math.abs(tick) >= 1_000) {
        return `${(tick / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return tick.toString();
};


const ChartCard: React.FC<ChartCardProps> = ({ data, dataKey, title, color }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
      <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={50} />
            <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} tickFormatter={formatYAxisTick} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ direction: 'ltr' }} />
            <Line type="monotone" dataKey={dataKey} name={title} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;