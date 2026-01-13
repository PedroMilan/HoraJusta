import { useState, useEffect } from "react";
import { Timer } from "@/components/Timer";
import { SessionsList } from "@/components/SessionsList";
import { Summary } from "@/components/Summary";
import { CompanyManager } from "@/components/CompanyManager";
import { CompanySummary } from "@/components/CompanySummary";
import { Clock } from "lucide-react";

export interface Company {
  id: string;
  name: string;
  hourlyRate: number;
  color: string;
}

export interface WorkSession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  date: string;
  companyId: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<WorkSession[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("workSessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("companies");
    return saved ? JSON.parse(saved) : [];
  });

  const [timerState, setTimerState] = useState<{
    isRunning: boolean;
    startTime: number | null;
    companyId: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return { isRunning: false, startTime: null, companyId: null };
    }

    const saved = localStorage.getItem("timerState");
    return saved
      ? JSON.parse(saved)
      : { isRunning: false, startTime: null, companyId: null };
  });

  const { isRunning, startTime, companyId } = timerState;

  /* Persistência (effects válidos) */

  useEffect(() => {
    localStorage.setItem("workSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("timerState", JSON.stringify(timerState));
  }, [timerState]);

  /* Ações */

  const startTimer = (companyId: string) => {
    const now = Date.now();
    setTimerState({
      isRunning: true,
      startTime: now,
      companyId,
    });
  };

  const stopTimer = () => {
    if (startTime && companyId) {
      const now = Date.now();
      const duration = Math.floor((now - startTime) / 1000);
      const dateStr = new Date(startTime).toISOString().split("T")[0];

      const newSession: WorkSession = {
        id: `${startTime}-${now}`,
        startTime,
        endTime: now,
        duration,
        date: dateStr,
        companyId,
      };

      setSessions((prev) => [newSession, ...prev]);
    }

    setTimerState({
      isRunning: false,
      startTime: null,
      companyId: null,
    });
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gray-900 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Controle de Horas
              </h1>
              <p className="text-gray-600 text-sm">
                Registre seu tempo de trabalho
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Timer
              isRunning={isRunning}
              startTime={startTime}
              currentCompanyId={companyId}
              companies={companies}
              onStart={startTimer}
              onStop={stopTimer}
            />

            <Summary sessions={sessions} companies={companies} />

            <SessionsList
              sessions={sessions}
              companies={companies}
              onDelete={deleteSession}
            />
          </div>

          <div className="space-y-6">
            <CompanyManager companies={companies} onUpdate={setCompanies} />
            <CompanySummary sessions={sessions} companies={companies} />
          </div>
        </div>
      </div>
    </div>
  );
}
