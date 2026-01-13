import { useState } from "react";
import { Building2, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Company } from "@/pages";

interface CompanyManagerProps {
  companies: Company[];
  onUpdate: (companies: Company[]) => void;
}

const DEFAULT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#14b8a6",
  "#f97316",
];

export function CompanyManager({ companies, onUpdate }: CompanyManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    hourlyRate: "",
    color: DEFAULT_COLORS[0],
  });
  const [editData, setEditData] = useState({
    name: "",
    hourlyRate: "",
    color: "",
  });

  const handleAdd = () => {
    if (newCompany.name.trim() && newCompany.hourlyRate) {
      const rate = parseFloat(newCompany.hourlyRate);
      if (!isNaN(rate) && rate > 0) {
        const company: Company = {
          id: Date.now().toString(),
          name: newCompany.name.trim(),
          hourlyRate: rate,
          color: newCompany.color,
        };
        onUpdate([...companies, company]);
        setNewCompany({
          name: "",
          hourlyRate: "",
          color: DEFAULT_COLORS[companies.length % DEFAULT_COLORS.length],
        });
        setIsAdding(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      onUpdate(companies.filter((c) => c.id !== id));
    }
  };

  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setEditData({
      name: company.name,
      hourlyRate: company.hourlyRate.toString(),
      color: company.color,
    });
  };

  const handleEdit = (id: string) => {
    if (editData.name.trim() && editData.hourlyRate) {
      const rate = parseFloat(editData.hourlyRate);
      if (!isNaN(rate) && rate > 0) {
        onUpdate(
          companies.map((c) =>
            c.id === id
              ? {
                  ...c,
                  name: editData.name.trim(),
                  hourlyRate: rate,
                  color: editData.color,
                }
              : c
          )
        );
        setEditingId(null);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", hourlyRate: "", color: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Empresas</h2>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 bg-gray-900 text-white hover:bg-gray-800 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        )}
      </div>

      {/* Companies List */}
      <div className="space-y-2 mb-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            {editingId === company.id ? (
              <>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editData.color}
                      onChange={(e) =>
                        setEditData({ ...editData, color: e.target.value })
                      }
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                      title="Escolher cor"
                    />
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm flex-1"
                      placeholder="Nome da empresa"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">R$</span>
                    <input
                      type="number"
                      value={editData.hourlyRate}
                      onChange={(e) =>
                        setEditData({ ...editData, hourlyRate: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-2 py-1.5 w-24 text-sm"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-sm text-gray-600">/h</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(company.id)}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Salvar"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: company.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {company.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      R$ {company.hourlyRate.toFixed(2)}/h
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(company)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Company Form */}
      {isAdding && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newCompany.color}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, color: e.target.value })
                }
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                title="Escolher cor"
              />
              <input
                type="text"
                value={newCompany.name}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, name: e.target.value })
                }
                placeholder="Nome da empresa"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">R$</span>
              <input
                type="number"
                value={newCompany.hourlyRate}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, hourlyRate: e.target.value })
                }
                placeholder="0.00"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                step="0.01"
                min="0"
              />
              <span className="text-sm text-gray-600">/h</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm transition-colors"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCompany({
                  name: "",
                  hourlyRate: "",
                  color:
                    DEFAULT_COLORS[companies.length % DEFAULT_COLORS.length],
                });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {companies.length === 0 && !isAdding && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Nenhuma empresa cadastrada</p>
        </div>
      )}
    </div>
  );
}
