import React, { useState } from "react";
import { updatePatient } from "../utils/api";

interface Patient {
  id: number;
  nom: string;
  age: string;
  sexe: string;
  telephone: string;
  adresse: string;
  groupe_sanguin: string;
  image_url: string;
}

interface EditPatientModalProps {
  patient: Patient;
  onClose: () => void;
}

export default function EditPatientModal({ patient, onClose }: EditPatientModalProps) {
  const [formData, setFormData] = useState<Patient>(patient);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setError("Le nom est obligatoire");
      return false;
    }
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      setError("L'âge doit être un nombre valide");
      return false;
    }
    if (!formData.telephone.trim()) {
      setError("Le téléphone est obligatoire");
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
      await updatePatient(patient.id, formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Erreur lors de la modification du patient');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "nom", label: "Nom", type: "text", required: true },
    { name: "age", label: "Âge", type: "number", required: true },
    { name: "sexe", label: "Sexe", type: "select", options: ["", "M", "F"], required: true },
    { name: "telephone", label: "Téléphone", type: "tel", required: true },
    { name: "adresse", label: "Adresse", type: "text", required: false },
    { name: "groupe_sanguin", label: "Groupe sanguin", type: "select", options: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: false },
    { name: "image_url", label: "URL de l'image", type: "url", required: false }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-[90vw] space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Modifier le patient</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name as keyof Patient]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                >
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof Patient]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                />
              )}
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