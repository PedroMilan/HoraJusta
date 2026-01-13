import { useState, useEffect, useMemo } from "react";
import { Play, Square } from "lucide-react";
import { Company } from "@/pages";

interface TimerProps {
  isRunning: boolean;
  startTime: number | null;
  currentCompanyId: string | null;
  companies: Company[];
  onStart: (companyId: string) => void;
  onStop: () => void;
}

export function Timer({
  isRunning,
  startTime,
  currentCompanyId,
  companies,
  onStart,
  onStop,
}: TimerProps) {
  /**
   * Empresa selecionada
   * Inicializa com a primeira empresa, se existir
   */
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    () => companies[0]?.id ?? null
  );

  /**
   * Tempo decorrido
   * NÃO é resetado via setState dentro de effect
   */
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  /**
   * Atualiza o timer somente quando estiver rodando
   */
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const updateElapsed = () => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - startTime) / 1000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  /**
   * Reseta o tempo QUANDO o timer parar
   * (derivado de props, não efeito colateral)
   */
  const displayedSeconds = useMemo(() => {
    if (!isRunning || !startTime) return 0;
    return elapsedSeconds;
  }, [isRunning, startTime, elapsedSeconds]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentCompany = companies.find(
    (company) => company.id === currentCompanyId
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200">
      <div className="text-center">
        {/* Timer Display */}
        <div className="mb-6">
          <div
            className={`text-6xl sm:text-7xl font-mono font-bold transition-colors ${
              isRunning ? "text-green-600" : "text-gray-300"
            }`}
          >
            {formatTime(displayedSeconds)}
          </div>

          {isRunning && currentCompany && (
            <div className="flex items-center justify-center gap-2 mt-4 bg-gray-50 rounded-lg p-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentCompany.color }}
              />
              <p className="text-sm text-gray-700">
                Trabalhando para{" "}
                <span className="font-medium">{currentCompany.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col gap-4 items-center">
          {!isRunning ? (
            <>
              {companies.length > 0 ? (
                <>
                  <div className="w-full max-w-md">
                    <label className="block font-medium text-gray-700 mb-3 text-sm">
                      Selecione a empresa:
                    </label>

                    <div className="space-y-2">
                      {companies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => setSelectedCompanyId(company.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            selectedCompanyId === company.id
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: company.color }}
                            />
                            <span className="font-medium text-gray-900 text-sm">
                              {company.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            R$ {company.hourlyRate.toFixed(2)}/h
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      selectedCompanyId && onStart(selectedCompanyId)
                    }
                    disabled={!selectedCompanyId}
                    className="flex items-center gap-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-lg font-medium transition-colors"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Iniciar Trabalho
                  </button>
                </>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg px-6">
                  <p className="text-gray-600 text-sm">
                    Adicione uma empresa primeiro
                  </p>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={onStop}
              className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-lg font-medium transition-colors"
            >
              <Square className="w-5 h-5" fill="currentColor" />
              Parar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
