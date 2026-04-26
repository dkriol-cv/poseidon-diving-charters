import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "text-[#03c4c9]", bgColor = "bg-[#03c4c9]/10" }) => {
  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
          </div>
          <div className={cn("p-3 rounded-full", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            {trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />}
            {trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />}
            {trend === 'neutral' && <Minus className="h-4 w-4 text-gray-500 mr-1" />}
            
            <span className={cn(
              "font-medium",
              trend === 'up' ? "text-green-600" : 
              trend === 'down' ? "text-red-600" : "text-gray-600"
            )}>
              {trendValue}
            </span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;