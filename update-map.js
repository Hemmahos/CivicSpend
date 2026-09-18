const fs = require('fs');

const langs = ['en', 'fr', 'pt', 'ar', 'sw', 'ha'];

const additions = {
  en: {
    "LiveMap": {
      "location_active": "Location Active",
      "location_denied": "Location Denied",
      "locating": "Locating...",
      "token_required": "Mapbox Token Required",
      "token_desc": "Please add a valid Mapbox access token to `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` to view the interactive map."
    }
  },
  fr: {
    "LiveMap": {
      "location_active": "Localisation Active",
      "location_denied": "Localisation Refusée",
      "locating": "Localisation...",
      "token_required": "Jeton Mapbox Requis",
      "token_desc": "Veuillez ajouter un jeton d'accès Mapbox valide à `NEXT_PUBLIC_MAPBOX_TOKEN` dans `.env.local`."
    }
  },
  pt: {
    "LiveMap": {
      "location_active": "Localização Ativa",
      "location_denied": "Localização Negada",
      "locating": "Localizando...",
      "token_required": "Token Mapbox Necessário",
      "token_desc": "Adicione um token Mapbox válido em `NEXT_PUBLIC_MAPBOX_TOKEN`."
    }
  },
  ar: {
    "LiveMap": {
      "location_active": "الموقع نشط",
      "location_denied": "تم رفض الموقع",
      "locating": "تحديد الموقع...",
      "token_required": "مطلوب رمز Mapbox",
      "token_desc": "يرجى إضافة رمز وصول Mapbox صالح إلى `NEXT_PUBLIC_MAPBOX_TOKEN` في `.env.local`."
    }
  },
  sw: {
    "LiveMap": {
      "location_active": "Eneo Amilifu",
      "location_denied": "Eneo Limekataliwa",
      "locating": "Inatafuta Eneo...",
      "token_required": "Tokeni ya Mapbox Inahitajika",
      "token_desc": "Tafadhali ongeza tokeni halali ya Mapbox kwenye `NEXT_PUBLIC_MAPBOX_TOKEN`."
    }
  },
  ha: {
    "LiveMap": {
      "location_active": "Wuri Mai Aiki",
      "location_denied": "An Karyata Wuri",
      "locating": "Neman Wuri...",
      "token_required": "Ana Bukatar Mapbox Token",
      "token_desc": "Don Allah ƙara Mapbox token mai aiki zuwa `NEXT_PUBLIC_MAPBOX_TOKEN`."
    }
  }
};

langs.forEach(lang => {
  const filePath = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.LiveMap = { ...data.LiveMap, ...additions[lang].LiveMap };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log("Updated map strings!");
