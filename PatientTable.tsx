import React, { useEffect, useState } from "react";
import { getPatients } from "../utils/api";
import NewPatientModal from "./NewPatientModal";
import EditPatientModal from "./EditPatientModal";
import DiagnosticModal from "./DiagnosticModal";
import VitalRecordModal from "./VitalRecordModal";

export default function PatientTable() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modal, setModal] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={() => setModal("add")} 
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Ajouter un patient
      </button>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Âge</th>
              <th className="border px-4 py-2">Sexe</th>
              <th className="border px-4 py-2">Téléphone</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p: any) => (
              <tr key={p.id} className="text-center border-t">
                <td className="border px-4 py-2">{p.nom}</td>
                <td className="border px-4 py-2">{p.age}</td>
                <td className="border px-4 py-2">{p.sexe}</td>
                <td className="border px-4 py-2">{p.telephone}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button 
                    onClick={() => { setSelectedPatient(p); setModal("edit"); }} 
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => { setSelectedPatient(p); setModal("diagnostic"); }} 
                    className="px-2 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                  >
                    Diagnostic
                  </button>
                  <button 
                    onClick={() => { setSelectedPatient(p); setModal("record"); }} 
                    className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Constantes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "add" && <NewPatientModal onClose={() => { setModal(""); fetchPatients(); }} />}
      {modal === "edit" && selectedPatient && (
        <EditPatientModal patient={selectedPatient} onClose={() => { setModal(""); fetchPatients(); }} />
      )}
      {modal === "diagnostic" && selectedPatient && (
        <DiagnosticModal patient={selectedPatient} onClose={() => { setModal(""); }} />
      )}
      {modal === "record" && selectedPatient && (
        <VitalRecordModal patient={selectedPatient} onClose={() => { setModal(""); }} />
      )}
    </div>
  );
}