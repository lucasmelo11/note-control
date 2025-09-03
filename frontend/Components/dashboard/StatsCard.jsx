import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600",
};

const iconColorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  orange: "text-orange-600",
  red: "text-red-600",
};

const bgColorClasses = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  orange: "bg-orange-50",
  red: "bg-red-50",
};

export default function StatsCard({ title, value, icon: Icon, color, isLoading }) {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden bg-white shadow-sm border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow duration-200">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full transform translate-x-8 -translate-y-8`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${bgColorClasses[color]}`}>
            <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}