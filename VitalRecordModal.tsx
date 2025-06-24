import React, { useState } from "react";
import { addVitals } from "../utils/api";

interface Patient {
  id: number;
  nom: string;
}

interface VitalForm {
  temperature: string;
  tension: string;
  frequence_cardiaque: string;
  saturation: string;
  respiration: string;
  poids: string;
  taille: string;
}

interface VitalRecordModalProps {
  patient: Patient;
  onClose: () => void;
}

export default function VitalRecordModal({ patient, onClose }: VitalRecordModalProps) {
  const [form, setForm] = useState<VitalForm>({
    temperature: "",
    tension: "",
    frequence_cardiaque: "",
    saturation: "",
    respiration: "",
    poids: "",
    taille: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    const numericFields = ['temperature', 'frequence_cardiaque', 'saturation', 'respiration', 'poids', 'taille'];
    
    for (const field of numericFields) {
      const value = form[field as keyof VitalForm];
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        setError(`${field.replace('_', ' ')} doit être un nombre valide`);
        return false;
      }
    }

    // Validate specific ranges
    if (form.temperature && (Number(form.temperature) < 30 || Number(form.temperature) > 45)) {
      setError("La température doit être entre 30°C et 45°C");
      return false;
    }
    
    if (form.saturation && (Number(form.saturation) < 0 || Number(form.saturation) > 100)) {
      setError("La saturation doit être entre 0% et 100%");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    
    try {
      await addVitals({ ...form, patient_id: patient.id });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError('Erreur lors de l\'enregistrement des constantes');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "temperature", label: "Température (°C)", type: "number", step: "0.1", min: "30", max: "45" },
    { name: "tension", label: "Tension artérielle", type: "text", placeholder: "120/80" },
    { name: "frequence_cardiaque", label: "Fréquence cardiaque (bpm)", type: "number", min: "0" },
    { name: "saturation", label: "Saturation O₂ (%)", type: "number", min: "0", max: "100" },
    { name: "respiration", label: "Fréquence respiratoire (/min)", type: "number", min: "0" },
    { name: "poids", label: "Poids (kg)", type: "number", step: "0.1", min: "0" },
    { name: "taille", label: "Taille (cm)", type: "number", min: "0" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-[90vw] space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Nouveau relevé de constantes - {patient.nom}
        </h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof VitalForm]}
                onChange={handleChange}
                placeholder={field.placeholder}
                step={field.step}
                min={field.min}
                max={field.max}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}