import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function StatsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{
          top: 15,
          right: 25,
          bottom: 10,
          left: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
        <XAxis 
          dataKey="time" 
          stroke="#71717a" 
          tick={{ fill: '#a1a1aa', fontSize: 12 }} 
          tickLine={{ stroke: '#27272a' }}
        />
        <YAxis 
          stroke="#71717a" 
          tick={{ fill: '#a1a1aa', fontSize: 12 }} 
          tickLine={{ stroke: '#27272a' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#18181b', 
            borderColor: '#27272a', 
            borderRadius: '10px', 
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            padding: '10px 14px'
          }} 
          itemStyle={{ fontSize: 13, fontWeight: 500 }}
        />
        <Legend wrapperStyle={{ paddingTop: 10, fontSize: 13 }} />
        <Line 
          type="monotone" 
          dataKey="views" 
          stroke="#ae7aff" 
          strokeWidth={2.5} 
          dot={{ fill: '#ae7aff', r: 4 }} 
          activeDot={{ r: 6, stroke: '#ae7aff', strokeWidth: 2 }}
          name="Views" 
        />
        <Line 
          type="monotone" 
          dataKey="likes" 
          stroke="#f43f5e" 
          strokeWidth={2.5} 
          dot={{ fill: '#f43f5e', r: 4 }} 
          activeDot={{ r: 6, stroke: '#f43f5e', strokeWidth: 2 }}
          name="Likes" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default StatsChart;