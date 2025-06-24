import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface LanguageContextType {
  lang: string;
  changeLang: (language: string) => void;
  t: (key: string) => string;
  availableLanguages: Array<{ code: string; name: string }>;
}

const translations: Record<string, Record<string, string>> = {
  fr: {
    // Navigation & General
    dashboard: "Tableau de bord",
    admin: "Administrateur",
    medecin: "Médecin",
    please_login: "Veuillez vous connecter",
    logout: "Déconnexion",
    settings: "Paramètres",
    language: "Langue",
    profile_settings: "Paramètres du profil",
    name: "Nom",
    email: "Email",
    role: "Rôle",
    
    // Patient Management
    patients: "Patients",
    add_patient: "Ajouter un patient",
    edit_patient: "Modifier le patient",
    patient_name: "Nom du patient",
    age: "Âge",
    gender: "Sexe",
    phone: "Téléphone",
    address: "Adresse",
    blood_group: "Groupe sanguin",
    
    // Actions
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    add: "Ajouter",
    close: "Fermer",
    analyze: "Analyser",
    
    // Medical
    diagnosis: "Diagnostic",
    symptoms: "Symptômes",
    treatment: "Traitement",
    vitals: "Constantes vitales",
    temperature: "Température",
    blood_pressure: "Tension artérielle",
    heart_rate: "Fréquence cardiaque",
    oxygen_saturation: "Saturation O₂",
    respiratory_rate: "Fréquence respiratoire",
    weight: "Poids",
    height: "Taille",
    
    // Messages
    required_field: "Champ obligatoire",
    invalid_email: "Email invalide",
    invalid_age: "Âge invalide",
    save_success: "Enregistré avec succès",
    save_error: "Erreur lors de l'enregistrement",
    login_error: "Erreur de connexion",
    select_symptoms: "Veuillez sélectionner au moins un symptôme",
    
    // Symptoms
    fever: "fièvre",
    fatigue: "fatigue",
    cough: "toux",
    pain: "douleur",
    headache: "maux de tête",
    nausea: "nausée"
  },
  en: {
    // Navigation & General
    dashboard: "Dashboard",
    admin: "Admin",
    medecin: "Doctor",
    please_login: "Please log in",
    logout: "Logout",
    settings: "Settings",
    language: "Language",
    profile_settings: "Profile Settings",
    name: "Name",
    email: "Email",
    role: "Role",
    
    // Patient Management
    patients: "Patients",
    add_patient: "Add Patient",
    edit_patient: "Edit Patient",
    patient_name: "Patient Name",
    age: "Age",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    blood_group: "Blood Group",
    
    // Actions
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    close: "Close",
    analyze: "Analyze",
    
    // Medical
    diagnosis: "Diagnosis",
    symptoms: "Symptoms",
    treatment: "Treatment",
    vitals: "Vital Signs",
    temperature: "Temperature",
    blood_pressure: "Blood Pressure",
    heart_rate: "Heart Rate",
    oxygen_saturation: "Oxygen Saturation",
    respiratory_rate: "Respiratory Rate",
    weight: "Weight",
    height: "Height",
    
    // Messages
    required_field: "Required field",
    invalid_email: "Invalid email",
    invalid_age: "Invalid age",
    save_success: "Saved successfully",
    save_error: "Error saving",
    login_error: "Login error",
    select_symptoms: "Please select at least one symptom",
    
    // Symptoms
    fever: "fever",
    fatigue: "fatigue",
    cough: "cough",
    pain: "pain",
    headache: "headache",
    nausea: "nausea"
  },
  ar: {
    // Navigation & General
    dashboard: "لوحة التحكم",
    admin: "مسؤول",
    medecin: "طبيب",
    please_login: "يرجى تسجيل الدخول",
    logout: "تسجيل الخروج",
    settings: "الإعدادات",
    language: "اللغة",
    profile_settings: "إعدادات الملف الشخصي",
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    
    // Patient Management
    patients: "المرضى",
    add_patient: "إضافة مريض",
    edit_patient: "تعديل المريض",
    patient_name: "اسم المريض",
    age: "العمر",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
    blood_group: "فصيلة الدم",
    
    // Actions
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    add: "إضافة",
    close: "إغلاق",
    analyze: "تحليل",
    
    // Medical
    diagnosis: "التشخيص",
    symptoms: "الأعراض",
    treatment: "العلاج",
    vitals: "العلامات الحيوية",
    temperature: "درجة الحرارة",
    blood_pressure: "ضغط الدم",
    heart_rate: "معدل ضربات القلب",
    oxygen_saturation: "تشبع الأكسجين",
    respiratory_rate: "معدل التنفس",
    weight: "الوزن",
    height: "الطول",
    
    // Messages
    required_field: "حقل مطلوب",
    invalid_email: "بريد إلكتروني غير صالح",
    invalid_age: "عمر غير صالح",
    save_success: "تم الحفظ بنجاح",
    save_error: "خطأ في الحفظ",
    login_error: "خطأ في تسجيل الدخول",
    select_symptoms: "يرجى اختيار عرض واحد على الأقل",
    
    // Symptoms
    fever: "حمى",
    fatigue: "إرهاق",
    cough: "سعال",
    pain: "ألم",
    headache: "صداع",
    nausea: "غثيان"
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLang] = useState<string>("fr");

  const availableLanguages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" }
  ];

  useEffect(() => {
    const initializeLanguage = () => {
      try {
        const saved = localStorage.getItem("lang");
        if (saved && availableLanguages.some(l => l.code === saved)) {
          setLang(saved);
        } else {
          // Try to detect browser language
          const browserLang = navigator.language.split('-')[0];
          if (availableLanguages.some(l => l.code === browserLang)) {
            setLang(browserLang);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la langue:', error);
      }
    };

    initializeLanguage();
  }, []);

  const changeLang = (language: string) => {
    if (availableLanguages.some(l => l.code === language)) {
      setLang(language);
      try {
        localStorage.setItem("lang", language);
        // Update document direction for RTL languages
        document.dir = language === 'ar' ? 'rtl' : 'ltr';
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la langue:', error);
      }
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.fr[key] || key;
  };

  // Set document direction on lang change
  useEffect(() => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const contextValue: LanguageContextType = {
    lang,
    changeLang,
    t,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};