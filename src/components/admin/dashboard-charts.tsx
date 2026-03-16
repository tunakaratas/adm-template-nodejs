"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const demoMonthlyData = [
    { month: "Oca", value: 4200 },
    { month: "Sub", value: 5800 },
    { month: "Mar", value: 4100 },
    { month: "Nis", value: 7200 },
    { month: "May", value: 6100 },
    { month: "Haz", value: 8400 },
    { month: "Tem", value: 7600 },
    { month: "Agu", value: 9100 },
    { month: "Eyl", value: 8200 },
    { month: "Eki", value: 10500 },
    { month: "Kas", value: 9800 },
    { month: "Ara", value: 11200 },
];

const demoActivityData = [
    { month: "Oca", count: 12 },
    { month: "Sub", count: 18 },
    { month: "Mar", count: 15 },
    { month: "Nis", count: 22 },
    { month: "May", count: 19 },
    { month: "Haz", count: 28 },
    { month: "Tem", count: 24 },
    { month: "Agu", count: 31 },
    { month: "Eyl", count: 27 },
    { month: "Eki", count: 35 },
    { month: "Kas", count: 30 },
    { month: "Ara", count: 38 },
];

export function DashboardCharts() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 gap-6">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Area Chart */}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={demoMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#37505d" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#37505d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#718096' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#718096' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--background)",
                                borderColor: "var(--border)",
                                borderRadius: "11px",
                                fontSize: "12px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#37505d"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="pt-6 border-t border-border/40">
                <h4 className="text-sm font-semibold text-foreground/80 mb-4 px-2">Aylik Aktivite</h4>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demoActivityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#718096' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                contentStyle={{
                                    backgroundColor: "var(--background)",
                                    borderColor: "var(--border)",
                                    borderRadius: "11px",
                                    fontSize: "12px"
                                }}
                            />
                            <Bar dataKey="count" fill="#37505d" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
