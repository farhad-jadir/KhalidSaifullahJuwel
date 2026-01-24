"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Download,
  MoreVertical,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    growth: 0,
  });

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalRevenue: 89234,
        totalOrders: 567,
        growth: 12.5,
      });
    }, 500);
  }, []);

  const recentActivities = [
    { id: 1, user: "John Doe", action: "placed a new order", time: "2 min ago" },
    { id: 2, user: "Sarah Smith", action: "registered", time: "10 min ago" },
    { id: 3, user: "Mike Johnson", action: "updated profile", time: "1 hour ago" },
    { id: 4, user: "Emma Wilson", action: "cancelled subscription", time: "2 hours ago" },
    { id: 5, user: "Alex Brown", action: "made a payment", time: "5 hours ago" },
  ];

  const quickStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+23%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+8%",
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      title: "Growth",
      value: `${stats.growth}%`,
      change: "+4.5%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <Download size={18} />
            <span>Export Report</span>
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          
          {/* Simple Chart Simulation */}
          <div className="space-y-4">
            <div className="h-64 flex items-end space-x-2">
              {[40, 60, 75, 55, 80, 90, 70].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Current Period</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm">Previous Period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Activity size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#ORD-001", customer: "John Doe", date: "2024-01-15", amount: "$249.99", status: "Completed" },
                { id: "#ORD-002", customer: "Sarah Smith", date: "2024-01-14", amount: "$99.50", status: "Pending" },
                { id: "#ORD-003", customer: "Mike Johnson", date: "2024-01-14", amount: "$450.00", status: "Completed" },
                { id: "#ORD-004", customer: "Emma Wilson", date: "2024-01-13", amount: "$199.99", status: "Cancelled" },
                { id: "#ORD-005", customer: "Alex Brown", date: "2024-01-12", amount: "$599.99", status: "Processing" },
              ].map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">{order.id}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4 text-gray-500">{order.date}</td>
                  <td className="py-4 font-medium">{order.amount}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Completed" 
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}