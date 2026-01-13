import { useMemo } from "react";
import { Trash2, Clock } from "lucide-react";
import { Company, WorkSession } from "@/pages";

interface SessionsListProps {
  sessions: WorkSession[];
  companies: Company[];
  onDelete: (id: string) => void;
}

export function SessionsList({
  sessions,
  companies,
  onDelete,
}: SessionsListProps) {
  const sessionsByDate = useMemo(() => {
    const grouped = new Map<string, WorkSession[]>();

    sessions.forEach((session) => {
      const existing = grouped.get(session.date) || [];
      grouped.set(session.date, [...existing, session]);
    });

    // Sort dates descending
    return Array.from(grouped.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
  }, [sessions]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (dateStr === today) return "Hoje";
    if (dateStr === yesterdayStr) return "Ontem";

    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  const calculateDayTotal = (daySessions: WorkSession[]) => {
    const totalSeconds = daySessions.reduce((sum, s) => sum + s.duration, 0);
    const earnings = daySessions.reduce((sum, s) => {
      const company = companies.find((c) => c.id === s.companyId);
      const hourlyRate = company?.hourlyRate || 0;
      const hours = s.duration / 3600;
      return sum + hours * hourlyRate;
    }, 0);
    const hours = totalSeconds / 3600;
    return { hours: hours.toFixed(1), earnings };
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Nenhuma sessão registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-gray-700" />
        <h2 className="font-semibold text-gray-900">Histórico</h2>
      </div>

      <div className="space-y-5">
        {sessionsByDate.map(([date, daySessions]) => {
          const dayTotal = calculateDayTotal(daySessions);

          return (
            <div
              key={date}
              className="border-b border-gray-200 last:border-0 pb-5 last:pb-0"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3 pb-2">
                <h3 className="font-medium text-gray-700 text-sm">
                  {formatDate(date)}
                </h3>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">
                    {dayTotal.hours}h
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    R$ {dayTotal.earnings.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Sessions */}
              <div className="space-y-2">
                {daySessions.map((session) => {
                  const company = companies.find(
                    (c) => c.id === session.companyId
                  );
                  const hourlyRate = company?.hourlyRate || 0;
                  const sessionEarnings =
                    (session.duration / 3600) * hourlyRate;

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {company && (
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: company.color }}
                            title={company.name}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-medium text-gray-900">
                              {formatTime(session.startTime)} -{" "}
                              {formatTime(session.endTime)}
                            </p>
                            {company && (
                              <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded truncate max-w-[120px]">
                                {company.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {formatDuration(session.duration)}
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                              R$ {sessionEarnings.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDelete(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50 p-1.5 rounded-lg flex-shrink-0 ml-2"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
