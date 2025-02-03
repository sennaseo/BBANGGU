"use client"

import { useState } from "react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis } from "recharts"

const monthlyData = [
  { name: "Jan", value: 80 },
  { name: "Mar", value: 70 },
  { name: "May", value: 60 },
  { name: "Jul", value: 40 },
]

const pieData = [
  { name: "크로와상", value: 26, percentage: "26%" },
  { name: "단팥빵", value: 24, percentage: "24%" },
  { name: "바게트", value: 19, percentage: "19%" },
  { name: "도넛", value: 16, percentage: "16%" },
  { name: "기타", value: 15, percentage: "15%" },
]

const weeklyData = [
  { name: "M", 크로와상: 20, 단팥빵: 10, 기타: 15 },
  { name: "T", 크로와상: 30, 단팥빵: 20, 기타: 25 },
  { name: "W", 크로와상: 15, 단팥빵: 10, 기타: 10 },
  { name: "T", 크로와상: 35, 단팥빵: 25, 기타: 20 },
  { name: "F", 크로와상: 25, 단팥빵: 15, 기타: 15 },
  { name: "S", 크로와상: 20, 단팥빵: 20, 기타: 15 },
  { name: "S", 크로와상: 30, 단팥빵: 15, 기타: 10 },
]

const COLORS = ["#FC973B", "#FFB777", "#FFD7B5", "#FFE4CC", "#FFF1E6"]

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

  return (
    <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="12">
      <tspan x={x} dy="-0.7em" fontWeight="bold">
        {name}
      </tspan>
      <tspan x={x} dy="1.4em">{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  )
}

export function InventoryCharts() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily")

  return (
    <div className="mt-8">
      <h3 className="text-center font-bold text-xl mb-4">재고 현황 요약</h3>
      <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        <button
          className={`py-2 px-4 rounded-lg text-sm ${
            activeTab === "daily" ? "bg-white text-[#FF9F43]" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          일별 현황
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-sm ${
            activeTab === "weekly" ? "bg-white text-[#FF9F43]" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("weekly")}
        >
          주별 현황
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-sm ${
            activeTab === "monthly" ? "bg-white text-[#FF9F43]" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          월별 현황
        </button>
      </div>

      <div className="h-[300px] w-full bg-white rounded-xl p-4">
        {activeTab === "monthly" && (
          <ResponsiveContainer>
            <LineChart data={monthlyData}>
              <Line type="monotone" dataKey="value" stroke="#FF9F43" strokeWidth={2} dot={{ fill: "#FF9F43" }} />
              <XAxis dataKey="name" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === "daily" && (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeTab === "weekly" && (
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <Bar dataKey="크로와상" stackId="a" fill="#4F46E5" />
              <Bar dataKey="단팥빵" stackId="a" fill="#FF9F43" />
              <Bar dataKey="기타" stackId="a" fill="#FFD7B5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

