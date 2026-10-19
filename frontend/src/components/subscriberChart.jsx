import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SubscriberChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart
        data={data}
        margin={{ top: 15, right: 25, bottom: 10, left: 0 }}
      >
        <defs>
          <linearGradient id="subGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
        <XAxis 
          dataKey="date" 
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
          itemStyle={{ fontSize: 13, fontWeight: 500, color: '#10b981' }}
        />

        <Area
          type="monotone"
          dataKey="subscribers"
          name="Subscribers"
          stroke="#10b981"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#subGradient)"
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
