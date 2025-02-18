"use client"

import { useState, useEffect } from "react"
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis } from "recharts"
import { StockChartApi } from "../../../api/owner/report/StockChartApi";


const COLORS = ["#FC973B", "#FFB777", "#FFD7B5", "#FFE4CC", "#FFF1E6"]

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="12">
      <tspan x={x} dy="-0.7em" fontWeight="bold">
        {name}
      </tspan>
      <tspan x={x} dy="1.4em">{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  );
};

interface MonthlyData {
  name: string;
  value: number;
}

interface WeeklyData {
  name: string;
  subname: string;
  value: number;
}

export function InventoryCharts() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("weekly")
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [key, setKey] = useState(0);
  
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!userInfo?.userId) return;
      
      setLoading(true);
      try {
        const response = await StockChartApi.getYearlyStock(userInfo.userId);
        
        // 현재 월을 기준으로 최근 3개월 순서로 정렬
        const monthlyTotals = Object.entries(response.data)
          .map(([month, stocks]) => {
            const total = stocks.reduce((sum, item) => sum + item.quantity, 0);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return {
              month: parseInt(month),
              name: monthNames[parseInt(month) - 1],
              value: total
            };
          })
          .sort((a, b) => {
            // 12월, 1월, 2월 순서로 정렬
            const currentMonth = 2; // 현재 2월
            const getMonthOrder = (month: number) => {
              if (month > currentMonth) return month - 12; // 작년 달은 음수로 변환
              return month;
            };
            return getMonthOrder(b.month) - getMonthOrder(a.month);
          })
          .map(({ name, value }) => ({ name, value }));

        setMonthlyData(monthlyTotals);
      } catch (err: any) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
        console.error('API 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "monthly") {
      fetchMonthlyData();
    }
  }, [activeTab, userInfo?.userId]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!userInfo?.userId) return;
      
      setLoading(true);
      try {
        const response = await StockChartApi.getWeeklyStock(userInfo.userId);
        
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        const weeklyTotals = response.data.map(item => {
          const date = new Date(item.date);
          return {
            name: `${date.getMonth() + 1}/${date.getDate()}`,
            subname: `(${weekDays[date.getDay()]})`,
            value: item.totalQuantity
          };
        });

        setWeeklyData(weeklyTotals);
      } catch (err: any) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
        console.error('API 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "weekly") {
      fetchWeeklyData();
    }
  }, [activeTab, userInfo?.userId]);

  useEffect(() => {
    const fetchDailyData = async () => {
      if (!userInfo?.bakeryId) return;
      
      try {
        const response = await StockChartApi.getDailyStocks(userInfo.bakeryId);
        const total = response.data.reduce((sum, item) => sum + item.quantity, 0);
        
        const chartData = response.data.map(item => ({
          name: item.breadName,
          value: item.quantity,
          percentage: `${((item.quantity / total) * 100).toFixed(0)}%`
        }));
        
        setDailyData(chartData);
        setKey(prev => prev + 1);
      } catch (error) {
        console.error('일별 재고 데이터 조회 실패:', error);
        setDailyData([]);
      }
    };

    if (activeTab === 'daily') {
      setDailyData([]);
      fetchDailyData();
    }
  }, [activeTab, userInfo?.bakeryId]);

  return (
    <div className="mt-8">
      {/* <h3 className="text-center font-bold text-xl mb-4">재고 현황 요약</h3> */}
      <div className="bg-gray-100 p-1 rounded-xl mb-6">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("daily")}
            style={{ borderRadius: '0.5rem' }}
            className={`flex-1 py-2 text-sm ${
              activeTab === "daily" 
                ? "bg-white text-[#FF9F43]" 
                : "bg-transparent text-gray-600"
            }`}
          >
            일별 현황
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            style={{ borderRadius: '0.5rem' }}
            className={`flex-1 py-2 text-sm ${
              activeTab === "weekly" 
                ? "bg-white text-[#FF9F43]" 
                : "bg-transparent text-gray-600"
            }`}
          >
            주별 현황
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            style={{ borderRadius: '0.5rem' }}
            className={`flex-1 py-2 text-sm ${
              activeTab === "monthly" 
                ? "bg-white text-[#FF9F43]" 
                : "bg-transparent text-gray-600"
            }`}
          >
            월별 현황
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full bg-white rounded-xl p-4">
        {activeTab === "monthly" && (
          <ResponsiveContainer>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>로딩 중...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <LineChart 
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF9F43" 
                  strokeWidth={2} 
                  dot={{ fill: "#FF9F43" }}
                  label={{
                    position: 'top',
                    fill: '#666666',
                    fontSize: 12,
                    offset: 10
                  }}
                />
                <XAxis 
                  dataKey="name" 
                  reversed={true}
                  interval={0}
                  padding={{ left: 30, right: 30 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}

        {activeTab === "daily" && (
          <div className="bg-white rounded-2xl p-6">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} key={key}>
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={dailyData}
                    cx="50%"
                    cy="40%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1400}
                    animationEasing="ease-out"
                  >
                    {dailyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">사장님, 오늘의 재고를 등록해주세요!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "weekly" && (
          <ResponsiveContainer>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>로딩 중...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <BarChart 
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
                height={350}
              >
                <XAxis 
                  dataKey="name" 
                  interval={0}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const date = weeklyData[payload.index].name;
                    const day = weeklyData[payload.index].subname;
                    
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={10}
                          dy={0}
                          textAnchor="middle"
                          fontSize={12}
                        >
                          {date}
                        </text>
                        <text
                          x={0}
                          y={25}
                          textAnchor="middle"
                          fontSize={12}
                        >
                          {day}
                        </text>
                      </g>
                    );
                  }}
                  height={50}
                />
                <Bar 
                  dataKey="value" 
                  fill="#FF9F43"
                  label={{ 
                    position: 'top',
                    fill: '#666666',
                    fontSize: 12,
                    offset: 10  // 라벨 위치를 위로 조금 더 올림
                  }}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

