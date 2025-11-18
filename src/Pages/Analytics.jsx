import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartLine, FaTasks, FaMoneyBillWave } from "react-icons/fa";

const Analytics = () => {
  const items = [
    { title: "Projects In Progress", value: 12, icon: <FaTasks className="h-5 w-5 text-construction" /> },
    { title: "Budget Utilization (%)", value: 68, icon: <FaMoneyBillWave className="h-5 w-5 text-construction" /> },
    { title: "Milestones Completed", value: 47, icon: <FaChartLine className="h-5 w-5 text-construction" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-construction text-white p-6 rounded-lg shadow-construction">
        <h2 className="text-2xl font-bold mb-1">Analytics Overview</h2>
        <p className="text-white/90">Key metrics for your projects at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <Card key={it.title} className="shadow-card hover:shadow-construction transition-shadow hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{it.title}</CardTitle>
              {it.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{it.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analytics;


