import React, { useState } from "react";
import { addDiagnostic } from "../utils/api";

const maladieDB = [
  {
    nom: "Grippe",
    symptomes: ["fièvre", "fatigue", "toux"],
    traitement: ["repos", "paracétamol", "hydratation"]
  },
  {
    nom: "COVID-19",
    symptomes: ["douleur", "fatigue", "toux"],
    traitement: ["repos", "paracétamol", "hydratation"]
  },
  {
    nom: "Diabète de type 2",
    symptomes: ["fièvre", "nausée", "maux de tête"],
    traitement: ["metformine"]
  }
];

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

interface DiagnosticModalProps {
  patient: Patient;
  onClose: () => void;
}

interface Maladie {
  nom: string;
  symptomes: string[];
  traitement: string[];
}

export default function DiagnosticModal({ patient, onClose }: DiagnosticModalProps) {
  const [symptomes, setSymptomes] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<Maladie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSelect = (symptome: string) => {
    setSymptomes((prev) =>
      prev.includes(symptome) ? prev.filter((s) => s !== symptome) : [...prev, symptome]
    );
    setError(""); // Clear error when user interacts
  };

  const handleAnalyse = () => {
    if (symptomes.length === 0) {
      setError("Veuillez sélectionner au moins un symptôme");
      return;
    }

    // Improved matching logic: find disease with most matching symptoms
    const matches = maladieDB.map(maladie => ({
      ...maladie,
      matchCount: maladie.symptomes.filter(s => symptomes.includes(s)).length
    })).filter(match => match.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    const bestMatch = matches[0];
    setSuggestion(bestMatch || { nom: "Inconnu", symptomes: [], traitement: ["Consulter un médecin"] });
    setError("");
  };

  const handleSave = async () => {
    if (!suggestion) {
      setError("Veuillez d'abord analyser les symptômes");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      await addDiagnostic({
        patient_id: patient.id,
        symptomes,
        maladie: suggestion.nom,
        traitements: suggestion.traitement
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du diagnostic:', error);
      setError('Erreur lors de l\'enregistrement du diagnostic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-[90vw] space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Analyse des symptômes - {patient.nom}
        </h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Sélectionnez les symptômes observés :
          </label>
          <div className="flex flex-wrap gap-2">
            {["fièvre", "fatigue", "toux", "douleur", "maux de tête", "nausée"].map((s) => (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={`px-3 py-2 border rounded-md transition-colors ${
                  symptomes.includes(s) 
                    ? "bg-blue-500 text-white border-blue-500" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAnalyse} 
          disabled={symptomes.length === 0}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Analyser les symptômes
        </button>

        {suggestion && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-md space-y-2">
            <div>
              <span className="font-semibold text-gray-700">Diagnostic suggéré :</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                suggestion.nom === "Inconnu" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
              }`}>
                {suggestion.nom}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Traitement recommandé :</span>
              <span className="ml-2 text-gray-600">{suggestion.traitement.join(", ")}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            disabled={!suggestion || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}