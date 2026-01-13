import { useMemo } from "react";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import { Company, WorkSession } from "@/pages";

interface SummaryProps {
  sessions: WorkSession[];
  companies: Company[];
}

export function Summary({ sessions, companies }: SummaryProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Get start of current week (Monday)
    const currentDay = now.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // adjust when day is Sunday
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    // Get start of current month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const calculateEarnings = (filteredSessions: WorkSession[]) => {
      return filteredSessions.reduce((sum, s) => {
        const company = companies.find((c) => c.id === s.companyId);
        const hourlyRate = company?.hourlyRate || 0;
        const hours = s.duration / 3600;
        return sum + hours * hourlyRate;
      }, 0);
    };

    const todaySessions = sessions.filter((s) => s.date === today);
    const weekSessions = sessions.filter((s) => new Date(s.date) >= weekStart);
    const monthSessions = sessions.filter(
      (s) => new Date(s.date) >= monthStart
    );

    const todaySeconds = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const weekSeconds = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const monthSeconds = monthSessions.reduce((sum, s) => sum + s.duration, 0);

    const formatHours = (seconds: number) => {
      const hours = seconds / 3600;
      return hours.toFixed(1);
    };

    return {
      today: {
        hours: formatHours(todaySeconds),
        earnings: calculateEarnings(todaySessions),
      },
      week: {
        hours: formatHours(weekSeconds),
        earnings: calculateEarnings(weekSessions),
      },
      month: {
        hours: formatHours(monthSeconds),
        earnings: calculateEarnings(monthSessions),
      },
    };
  }, [sessions, companies]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Today */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-700 text-sm">Hoje</h3>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">
            {stats.today.hours}h
          </p>
          <p className="text-sm text-green-600 font-medium">
            R$ {stats.today.earnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Week */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-700 text-sm">Esta Semana</h3>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">
            {stats.week.hours}h
          </p>
          <p className="text-sm text-green-600 font-medium">
            R$ {stats.week.earnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Month */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-700 text-sm">Este Mês</h3>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">
            {stats.month.hours}h
          </p>
          <p className="text-sm text-green-600 font-medium">
            R$ {stats.month.earnings.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
