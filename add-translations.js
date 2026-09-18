const fs = require('fs');

const langs = ['en', 'fr', 'pt', 'ar', 'sw', 'ha'];

const additions = {
  en: {
    "AIDiscovery": {
      "title": "AI Project Discovery",
      "deploy_title": "Deploy AI Scraper",
      "deploy_desc": "Our AI Oracle can scan recent government press releases, federal budgets, and verified news outlets to discover newly announced public infrastructure projects in your region.",
      "initiate_scan": "Initiate Scan",
      "scanning": "Scanning News & Databases...",
      "parsing": "Parsing Financial Data & Cross-referencing...",
      "found_projects": "Found {count} Projects",
      "select_projects": "Select projects to add to the public ledger",
      "ai_sources": "AI Extracted Sources",
      "caught_up": "You're all caught up!",
      "no_new_projects": "Our AI didn't find any new public infrastructure announcements in your region today. All recently announced projects are already being tracked on the CivicSpend ledger.",
      "discard": "Discard",
      "publish": "Publish {count} to Ledger",
      "publishing": "Publishing...",
      "success_toast": "{count} AI-discovered project(s) added to ledger."
    },
    "LiveMap": {
      "title": "Live Infrastructure Map",
      "subtitle": "Discover and verify civic projects in your area",
      "recent_activity": "Recent Activity",
      "active_projects": "Active Projects",
      "verified_projects": "Verified Projects",
      "expert_audits": "Expert Audits"
    },
    "ProjectDetails": {
      "back": "Back to Feed",
      "budget": "Budget",
      "contractor": "Contractor",
      "reported": "Reported",
      "location": "Location",
      "evidence": "Media Evidence",
      "no_evidence": "No evidence uploaded yet.",
      "upload_evidence": "Upload Evidence",
      "discrepancy_title": "Discrepancy Bar",
      "community_sentiment": "Community Sentiment",
      "expert_analysis": "Expert Analysis",
      "no_analysis": "Pending expert verification",
      "ai_summary": "AI Summary",
      "timeline": "Timeline"
    }
  },
  fr: {
    "AIDiscovery": {
      "title": "Découverte de Projets IA",
      "deploy_title": "Déployer le Scraper IA",
      "deploy_desc": "Notre Oracle IA peut scanner les communiqués de presse gouvernementaux, les budgets fédéraux et les médias vérifiés pour découvrir les projets d'infrastructure publique annoncés dans votre région.",
      "initiate_scan": "Lancer le scan",
      "scanning": "Scan des actualités et bases de données...",
      "parsing": "Analyse des données financières et croisement...",
      "found_projects": "{count} projets trouvés",
      "select_projects": "Sélectionnez les projets à ajouter au registre public",
      "ai_sources": "Sources extraites par l'IA",
      "caught_up": "Vous êtes à jour !",
      "no_new_projects": "Notre IA n'a trouvé aucune nouvelle annonce d'infrastructure publique dans votre région aujourd'hui.",
      "discard": "Annuler",
      "publish": "Publier {count} dans le registre",
      "publishing": "Publication...",
      "success_toast": "{count} projet(s) découvert(s) par l'IA ajouté(s) au registre."
    },
    "LiveMap": {
      "title": "Carte des Infrastructures en Direct",
      "subtitle": "Découvrez et vérifiez les projets civiques dans votre région",
      "recent_activity": "Activité Récente",
      "active_projects": "Projets Actifs",
      "verified_projects": "Projets Vérifiés",
      "expert_audits": "Audits d'Experts"
    },
    "ProjectDetails": {
      "back": "Retour au Flux",
      "budget": "Budget",
      "contractor": "Entrepreneur",
      "reported": "Signalé",
      "location: ": "Emplacement",
      "evidence": "Preuves Médiatiques",
      "no_evidence": "Aucune preuve téléchargée pour l'instant.",
      "upload_evidence": "Télécharger Preuve",
      "discrepancy_title": "Barre de Discordance",
      "community_sentiment": "Sentiment de la Communauté",
      "expert_analysis": "Analyse d'Expert",
      "no_analysis": "Vérification d'expert en attente",
      "ai_summary": "Résumé de l'IA",
      "timeline": "Chronologie"
    }
  },
  pt: {
    "AIDiscovery": {
      "title": "Descoberta de Projetos de IA",
      "deploy_title": "Implantar Rastreador IA",
      "deploy_desc": "Nosso Oráculo IA pode verificar comunicados governamentais, orçamentos federais e notícias para descobrir projetos de infraestrutura anunciados em sua região.",
      "initiate_scan": "Iniciar Verificação",
      "scanning": "Verificando Notícias e Bancos de Dados...",
      "parsing": "Analisando Dados Financeiros e Cruzando Informações...",
      "found_projects": "{count} Projetos Encontrados",
      "select_projects": "Selecione projetos para adicionar ao registro público",
      "ai_sources": "Fontes Extraídas por IA",
      "caught_up": "Você está atualizado!",
      "no_new_projects": "Nossa IA não encontrou novos anúncios de infraestrutura pública hoje.",
      "discard": "Descartar",
      "publish": "Publicar {count} no Registro",
      "publishing": "Publicando...",
      "success_toast": "{count} projeto(s) descoberto(s) por IA adicionado(s) ao registro."
    },
    "LiveMap": {
      "title": "Mapa de Infraestrutura ao Vivo",
      "subtitle": "Descubra e verifique projetos cívicos na sua área",
      "recent_activity": "Atividade Recente",
      "active_projects": "Projetos Ativos",
      "verified_projects": "Projetos Verificados",
      "expert_audits": "Auditorias Especializadas"
    },
    "ProjectDetails": {
      "back": "Voltar ao Feed",
      "budget": "Orçamento",
      "contractor": "Empreiteiro",
      "reported": "Reportado",
      "location": "Localização",
      "evidence": "Evidência em Mídia",
      "no_evidence": "Nenhuma evidência carregada ainda.",
      "upload_evidence": "Carregar Evidência",
      "discrepancy_title": "Barra de Discrepância",
      "community_sentiment": "Sentimento da Comunidade",
      "expert_analysis": "Análise de Especialista",
      "no_analysis": "Verificação de especialista pendente",
      "ai_summary": "Resumo da IA",
      "timeline": "Linha do Tempo"
    }
  },
  ar: {
    "AIDiscovery": {
      "title": "اكتشاف مشاريع الذكاء الاصطناعي",
      "deploy_title": "نشر ماسح الذكاء الاصطناعي",
      "deploy_desc": "يمكن لأوراكل الذكاء الاصطناعي الخاص بنا مسح البيانات الصحفية الحكومية لاكتشاف مشاريع البنية التحتية العامة الجديدة في منطقتك.",
      "initiate_scan": "بدء المسح",
      "scanning": "جاري مسح الأخبار وقواعد البيانات...",
      "parsing": "تحليل البيانات المالية والمطابقة...",
      "found_projects": "تم العثور على {count} مشاريع",
      "select_projects": "حدد المشاريع لإضافتها إلى السجل العام",
      "ai_sources": "مصادر الذكاء الاصطناعي المستخرجة",
      "caught_up": "أنت على اطلاع بكل جديد!",
      "no_new_projects": "لم يعثر الذكاء الاصطناعي لدينا على أي إعلانات جديدة للبنية التحتية العامة في منطقتك اليوم.",
      "discard": "تجاهل",
      "publish": "نشر {count} إلى السجل",
      "publishing": "جاري النشر...",
      "success_toast": "تمت إضافة {count} مشروع (مشاريع) اكتشفها الذكاء الاصطناعي إلى السجل."
    },
    "LiveMap": {
      "title": "خريطة البنية التحتية الحية",
      "subtitle": "اكتشف وتحقق من المشاريع المدنية في منطقتك",
      "recent_activity": "النشاط الأخير",
      "active_projects": "مشاريع نشطة",
      "verified_projects": "مشاريع تم التحقق منها",
      "expert_audits": "تدقيقات الخبراء"
    },
    "ProjectDetails": {
      "back": "العودة إلى التغذية",
      "budget": "الميزانية",
      "contractor": "المقاول",
      "reported": "تاريخ الإبلاغ",
      "location": "الموقع",
      "evidence": "أدلة إعلامية",
      "no_evidence": "لم يتم تحميل أي أدلة بعد.",
      "upload_evidence": "تحميل أدلة",
      "discrepancy_title": "شريط التباين",
      "community_sentiment": "آراء المجتمع",
      "expert_analysis": "تحليل الخبراء",
      "no_analysis": "في انتظار التحقق من الخبراء",
      "ai_summary": "ملخص الذكاء الاصطناعي",
      "timeline": "الجدول الزمني"
    }
  },
  sw: {
    "AIDiscovery": {
      "title": "Ugunduzi wa Miradi wa AI",
      "deploy_title": "Peleka Kichanganuzi cha AI",
      "deploy_desc": "Oracle yetu ya AI inaweza kuchanganua taarifa za serikali kugundua miradi mipya ya miundombinu katika eneo lako.",
      "initiate_scan": "Anza Uchanganuzi",
      "scanning": "Inachanganua Habari na Hifadhidata...",
      "parsing": "Inachanganua Data ya Kifedha...",
      "found_projects": "Imepata Miradi {count}",
      "select_projects": "Chagua miradi ya kuongeza kwenye leja ya umma",
      "ai_sources": "Vyanzo Vilivyotolewa na AI",
      "caught_up": "Uko sawa sasa!",
      "no_new_projects": "AI yetu haikupata matangazo yoyote mapya leo.",
      "discard": "Tupa",
      "publish": "Chapisha {count} kwenye Leja",
      "publishing": "Inachapisha...",
      "success_toast": "Mradi(mi) {count} iliyogunduliwa na AI imeongezwa kwenye leja."
    },
    "LiveMap": {
      "title": "Ramani Moja kwa Moja ya Miundombinu",
      "subtitle": "Gundua na uthibitishe miradi ya kiraia katika eneo lako",
      "recent_activity": "Shughuli za Hivi Karibuni",
      "active_projects": "Miradi Inayotumika",
      "verified_projects": "Miradi Iliyothibitishwa",
      "expert_audits": "Ukaguzi wa Wataalam"
    },
    "ProjectDetails": {
      "back": "Rudi kwenye Habari",
      "budget": "Bajeti",
      "contractor": "Mkandarasi",
      "reported: ": "Imeripotiwa",
      "location": "Mahali",
      "evidence": "Ushahidi wa Vyombo vya Habari",
      "no_evidence": "Hakuna ushahidi uliopakiwa bado.",
      "upload_evidence": "Pakia Ushahidi",
      "discrepancy_title": "Baa ya Tofauti",
      "community_sentiment": "Hisia za Jamii",
      "expert_analysis": "Uchambuzi wa Wataalam",
      "no_analysis": "Inasubiri uthibitisho wa mtaalam",
      "ai_summary": "Muhtasari wa AI",
      "timeline": "Ratiba"
    }
  },
  ha: {
    "AIDiscovery": {
      "title": "Gano Aikin AI",
      "deploy_title": "Aika AI Scraper",
      "deploy_desc": "Masaninmu na AI zai iya bincika sababbin bayanai na gwamnati don gano sabbin ayyukan ababen more rayuwa a yankinku.",
      "initiate_scan": "Fara Bincike",
      "scanning": "Ana Binciken Labarai da Bayanai...",
      "parsing": "Ana Binciken Bayanan Kudi...",
      "found_projects": "An Sami Ayyuka {count}",
      "select_projects": "Zaɓi ayyukan da za ku saka a cikin littafin jama'a",
      "ai_sources": "Majiyoyin AI",
      "caught_up": "Ka gama duka!",
      "no_new_projects": "AI dinmu bai sami sabon aikin gwamnati a yau ba.",
      "discard": "Soke",
      "publish": "Buga {count} a cikin Littafi",
      "publishing": "Ana Bugawa...",
      "success_toast": "An ƙara aiki(iyuka) guda {count} da AI ya gano a cikin littafi."
    },
    "LiveMap": {
      "title": "Taswirar Ababen More Rayuwa na Kai Tsaye",
      "subtitle": "Gano kuma tabbatar da ayyukan jama'a a yankin ku",
      "recent_activity": "Ayyukan Kwanan Nan",
      "active_projects": "Ayyuka Masu Aiki",
      "verified_projects": "Ayyukan Tabbatattu",
      "expert_audits": "Binciken Masana"
    },
    "ProjectDetails": {
      "back": "Koma baya",
      "budget": "Kasafin Kudi",
      "contractor": "Dan Kwangila",
      "reported": "An Kawo Rahoto",
      "location": "Wuri",
      "evidence": "Shaidar Kafofin Yada Labarai",
      "no_evidence": "Babu shaidar da aka saka tukunna.",
      "upload_evidence": "Saka Shaida",
      "discrepancy_title": "Matsalar Tabbatarwa",
      "community_sentiment": "Tunanin Al'umma",
      "expert_analysis": "Binciken Masana",
      "no_analysis": "Ana jiran tabbacin masana",
      "ai_summary": "Takaitaccen AI",
      "timeline": "Tsarin Lokaci"
    }
  }
};

langs.forEach(lang => {
  const filePath = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.AIDiscovery = additions[lang].AIDiscovery;
  data.LiveMap = additions[lang].LiveMap;
  // ProjectDetails already existed in the first script but I'll add it back just in case 
  data.ProjectDetails = additions[lang].ProjectDetails;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log("Updated translation files with more strings!");
