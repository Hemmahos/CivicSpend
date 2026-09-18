const fs = require('fs');

const langs = ['en', 'fr', 'pt', 'ar', 'sw', 'ha'];

const additions = {
  en: {
    "DiscrepancyBar": {
      "claimed_budget": "Claimed Budget",
      "verified_value": "Verified Value",
      "discrepancy": "Discrepancy",
      "awaiting_audit": "Awaiting expert audit to verify physical value."
    },
    "EvidenceUpload": {
      "title": "On-Site Evidence Capture",
      "camera_error": "Could not access camera. Please ensure permissions are granted.",
      "capture_first": "Please capture a photo first.",
      "success_toast": "Evidence securely attached! (Uploaded from {distance}km away)",
      "geo_unsupported": "Geolocation is not supported by your browser",
      "gps_error": "Failed to acquire GPS coordinates. Please allow location access.",
      "retake_photo": "Retake Photo",
      "notes_label": "Notes (Optional)",
      "notes_placeholder": "Any additional details about what you captured?",
      "submit_anon": "Submit Anonymously",
      "your_name": "Your Name",
      "enter_name": "Enter your name",
      "cancel": "Cancel",
      "verifying": "Verifying...",
      "verify_submit": "Verify Location & Submit",
      "anonymous": "Anonymous",
      "no_notes": "No additional notes provided."
    }
  },
  fr: {
    "DiscrepancyBar": {
      "claimed_budget": "Budget Réclamé",
      "verified_value": "Valeur Vérifiée",
      "discrepancy": "Discordance",
      "awaiting_audit": "En attente d'audit par un expert."
    },
    "EvidenceUpload": {
      "title": "Capture de Preuves sur Site",
      "camera_error": "Impossible d'accéder à la caméra.",
      "capture_first": "Veuillez d'abord capturer une photo.",
      "success_toast": "Preuves attachées (à {distance}km de distance)",
      "geo_unsupported": "La géolocalisation n'est pas supportée",
      "gps_error": "Échec de l'obtention des coordonnées GPS.",
      "retake_photo": "Reprendre la Photo",
      "notes_label": "Notes (Optionnel)",
      "notes_placeholder": "Des détails supplémentaires ?",
      "submit_anon": "Soumettre Anonymement",
      "your_name": "Votre Nom",
      "enter_name": "Entrez votre nom",
      "cancel": "Annuler",
      "verifying": "Vérification...",
      "verify_submit": "Vérifier la position et soumettre",
      "anonymous": "Anonyme",
      "no_notes": "Aucune note fournie."
    }
  },
  pt: {
    "DiscrepancyBar": {
      "claimed_budget": "Orçamento Declarado",
      "verified_value": "Valor Verificado",
      "discrepancy": "Discrepância",
      "awaiting_audit": "Aguardando auditoria de especialista."
    },
    "EvidenceUpload": {
      "title": "Captura de Evidência no Local",
      "camera_error": "Não foi possível acessar a câmera.",
      "capture_first": "Tire uma foto primeiro.",
      "success_toast": "Evidência anexada! (a {distance}km de distância)",
      "geo_unsupported": "Geolocalização não suportada",
      "gps_error": "Falha ao obter coordenadas GPS.",
      "retake_photo": "Tirar Foto Novamente",
      "notes_label": "Notas (Opcional)",
      "notes_placeholder": "Detalhes adicionais?",
      "submit_anon": "Enviar Anonimamente",
      "your_name": "Seu Nome",
      "enter_name": "Digite seu nome",
      "cancel": "Cancelar",
      "verifying": "Verificando...",
      "verify_submit": "Verificar Localização e Enviar",
      "anonymous": "Anônimo",
      "no_notes": "Nenhuma nota fornecida."
    }
  },
  ar: {
    "DiscrepancyBar": {
      "claimed_budget": "الميزانية المطالب بها",
      "verified_value": "القيمة المتحقق منها",
      "discrepancy": "التباين",
      "awaiting_audit": "في انتظار تدقيق الخبراء."
    },
    "EvidenceUpload": {
      "title": "التقاط الأدلة في الموقع",
      "camera_error": "تعذر الوصول إلى الكاميرا.",
      "capture_first": "الرجاء التقاط صورة أولاً.",
      "success_toast": "تم إرفاق الأدلة! (مُحمّل من بُعد {distance} كم)",
      "geo_unsupported": "تحديد الموقع غير مدعوم في متصفحك",
      "gps_error": "فشل في الحصول على إحداثيات GPS.",
      "retake_photo": "إعادة التقاط الصورة",
      "notes_label": "ملاحظات (اختياري)",
      "notes_placeholder": "أي تفاصيل إضافية؟",
      "submit_anon": "إرسال كمجهول",
      "your_name": "اسمك",
      "enter_name": "أدخل اسمك",
      "cancel": "إلغاء",
      "verifying": "جاري التحقق...",
      "verify_submit": "التحقق من الموقع والإرسال",
      "anonymous": "مجهول",
      "no_notes": "لا توجد ملاحظات."
    }
  },
  sw: {
    "DiscrepancyBar": {
      "claimed_budget": "Bajeti Iliyodaiwa",
      "verified_value": "Thamani Iliyothibitishwa",
      "discrepancy": "Tofauti",
      "awaiting_audit": "Inasubiri ukaguzi wa mtaalam."
    },
    "EvidenceUpload": {
      "title": "Upigaji Picha Kwenye Eneo",
      "camera_error": "Haikuweza kufikia kamera.",
      "capture_first": "Tafadhali piga picha kwanza.",
      "success_toast": "Ushahidi umewekwa! (Kutoka umbali wa {distance}km)",
      "geo_unsupported": "Kutambua eneo hakushikiliwi",
      "gps_error": "Imeshindwa kupata eneo.",
      "retake_photo": "Piga Picha Tena",
      "notes_label": "Vidokezo (Si lazima)",
      "notes_placeholder": "Maelezo yoyote ya ziada?",
      "submit_anon": "Tuma bila Jina",
      "your_name": "Jina Lako",
      "enter_name": "Ingiza jina lako",
      "cancel": "Ghairi",
      "verifying": "Inathibitisha...",
      "verify_submit": "Thibitisha Eneo & Tuma",
      "anonymous": "Asiyejulikana",
      "no_notes": "Hakuna maelezo ya ziada."
    }
  },
  ha: {
    "DiscrepancyBar": {
      "claimed_budget": "Kasafin Kudi",
      "verified_value": "Daraja Tabbatacce",
      "discrepancy": "Bambanci",
      "awaiting_audit": "Ana jiran binciken masani."
    },
    "EvidenceUpload": {
      "title": "Daukar Shaida a Wurin Aiki",
      "camera_error": "Ba a sami damar bude kyamara ba.",
      "capture_first": "Don Allah dauki hoto tukunna.",
      "success_toast": "An adana shaida! (Daga nisan {distance}km)",
      "geo_unsupported": "Wannan browser bata goyon bayan gano wuri",
      "gps_error": "An kasa gano GPS.",
      "retake_photo": "Sake Daukar Hoto",
      "notes_label": "Bayani (Zabi)",
      "notes_placeholder": "Karin bayani?",
      "submit_anon": "Aika ba tare da Suna ba",
      "your_name": "Sunan ku",
      "enter_name": "Shigar da sunan ku",
      "cancel": "Soke",
      "verifying": "Ana Tabbatarwa...",
      "verify_submit": "Tabbatar da Wuri & Aika",
      "anonymous": "Ba Suna",
      "no_notes": "Babu bayani da aka bayar."
    }
  }
};

langs.forEach(lang => {
  const filePath = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.DiscrepancyBar = additions[lang].DiscrepancyBar;
  data.EvidenceUpload = additions[lang].EvidenceUpload;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log("Updated more strings!");
