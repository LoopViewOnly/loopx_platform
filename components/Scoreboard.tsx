
import React, { useMemo } from 'react';
import { UserScore } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Text } from 'recharts';

interface ScoreboardProps {
    data: UserScore[];
}

const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={4} textAnchor="end" fill="#e5e7eb" fontSize={14}>
                {payload.value}
            </text>
        </g>
    );
};


const Scoreboard: React.FC<ScoreboardProps> = ({ data }) => {
    const topTenData = useMemo(() => {
        return [...data]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }, [data]);

    const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#eab308', '#84cc16'];

    return (
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-300 tracking-wide">
                Top 10 Leaderboard
            </h2>
            <div style={{ width: '100%', height: 500 }}>
                 <ResponsiveContainer>
                    <BarChart
                        data={topTenData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tick={<CustomYAxisTick />}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            contentStyle={{
                                background: 'rgba(30, 41, 59, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '0.5rem',
                            }}
                            labelStyle={{ color: '#93c5fd' }}
                        />
                        <Bar dataKey="score" barSize={30} radius={[0, 10, 10, 0]} label={{ position: 'right', fill: '#fff', fontSize: 14 }}>
                             {topTenData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Scoreboard;
