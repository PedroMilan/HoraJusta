import { useMemo } from "react";
import { Building2, Clock, TrendingUp } from "lucide-react";
import { Company, WorkSession } from "@/pages";

interface CompanySummaryProps {
  sessions: WorkSession[];
  companies: Company[];
}

export function CompanySummary({ sessions, companies }: CompanySummaryProps) {
  const companyStats = useMemo(() => {
    return companies
      .map((company) => {
        const companySessions = sessions.filter(
          (s) => s.companyId === company.id
        );
        const totalSeconds = companySessions.reduce(
          (sum, s) => sum + s.duration,
          0
        );
        const totalHours = totalSeconds / 3600;
        const totalEarnings = totalHours * company.hourlyRate;

        return {
          company,
          totalHours,
          totalEarnings,
          sessionCount: companySessions.length,
        };
      })
      .sort((a, b) => b.totalEarnings - a.totalEarnings);
  }, [sessions, companies]);

  const grandTotal = useMemo(() => {
    return companyStats.reduce((sum, stat) => sum + stat.totalEarnings, 0);
  }, [companyStats]);

  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Resumo por Empresa</h2>
        </div>
        {grandTotal > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-lg font-bold text-gray-900">
              R$ {grandTotal.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {companyStats.map(
          ({ company, totalHours, totalEarnings, sessionCount }) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: company.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {company.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {totalHours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {sessionCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right ml-3 flex-shrink-0">
                <p className="font-bold text-gray-900 text-sm">
                  R$ {totalEarnings.toFixed(2)}
                </p>
                {totalHours > 0 && grandTotal > 0 && (
                  <p className="text-xs text-gray-500">
                    {((totalEarnings / grandTotal) * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            </div>
          )
        )}

        {companyStats.every((stat) => stat.totalHours === 0) && (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Nenhuma sessão registrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
