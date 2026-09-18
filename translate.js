const fs = require('fs');
const path = require('path');

const en = {
  "Header": {
    "logo": "CivicSpend",
    "how_it_works": "How it Works",
    "expert_audit": "Expert Audit",
    "wallet_connected": "Wallet Connected",
    "connect_wallet": "Connect Wallet",
    "join_oracle": "Join Oracle",
    "oracle_verified": "Oracle Verified",
    "feed": "Feed"
  },
  "Hero": {
    "title": "Transparent Civic Spending",
    "subtitle": "Community-driven accountability platform for tracking and verifying civic projects. Ensure public funds build public value.",
    "scan_projects": "Scan Projects",
    "report_project": "Report Project",
    "verified": "Verified",
    "audited": "Audited",
    "disputed": "Disputed"
  },
  "LanguageSwitcher": {
    "switch_language": "Change Language"
  },
  "Footer": {
    "community_feed": "Community Feed",
    "expert_audit": "Expert Audit",
    "how_it_works": "How it Works",
    "mission_title": "Empowering Citizens",
    "mission_text": "Verified infrastructure data from professionals across every state, local government, and ward. Curated daily by the community.",
    "send_message": "Send Us A Message",
    "address_title": "Plot 123, Infrastructure Way",
    "address_city": "Abuja, FCT, Nigeria",
    "rights": "© 2024 CivicSpend. All Rights Reserved.",
    "crafted_by": "Crafted by",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service"
  },
  "ProjectCard": {
    "pending": "Pending Consensus",
    "awaiting_audit": "Awaiting Audit",
    "expert_audited": "Expert Audited",
    "disputed": "Disputed",
    "ai_discovered": "AI Discovered",
    "community_added": "Community Added",
    "government": "Government",
    "sources_attached": "Sources attached",
    "view_details": "View Details"
  },
  "AddProjectModal": {
    "title": "Report New Project",
    "description": "Help the community track civic infrastructure by adding a new project you've verified in your local area.",
    "name_label": "Project Name",
    "name_placeholder": "e.g. Obasanjo Road Rehabilitation",
    "address_label": "Specific Address / Landmark",
    "state_label": "State / Region",
    "budget_label": "Budget (if known)",
    "contractor_label": "Contractor (if known)",
    "cancel": "Cancel",
    "submit": "Submit Project",
    "submitting": "Submitting..."
  },
  "UploadForm": {
    "title": "Upload Evidence",
    "description": "Upload a photo or video to verify the status of this project.",
    "drag_drop": "Drag & drop your file here, or click to select",
    "support": "Supports JPG, PNG, MP4 (Max 10MB)",
    "caption_label": "Caption (Optional)",
    "cancel": "Cancel",
    "upload": "Upload Evidence"
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
  },
  "Tabs": {
    "discovery": "Discovery Feed",
    "map": "Live Map",
    "news": "News & Updates"
  }
};

const translations = {
  fr: {
    Header: { logo: "CivicSpend", how_it_works: "Comment ça marche", expert_audit: "Audit Expert", wallet_connected: "Portefeuille Connecté", connect_wallet: "Connecter Portefeuille", join_oracle: "Rejoindre Oracle", oracle_verified: "Oracle Vérifié", feed: "Flux" },
    Hero: { title: "Dépenses Civiques Transparentes", subtitle: "Plateforme communautaire pour suivre et vérifier les projets civiques. Assurez-vous que les fonds publics créent de la valeur publique.", scan_projects: "Scanner Projets", report_project: "Signaler Projet", verified: "Vérifié", audited: "Audité", disputed: "Contesté" },
    LanguageSwitcher: { switch_language: "Changer de Langue" },
    Footer: { community_feed: "Flux Communautaire", expert_audit: "Audit Expert", how_it_works: "Comment ça marche", mission_title: "Responsabiliser les Citoyens", mission_text: "Données d'infrastructure vérifiées par des professionnels dans chaque État, gouvernement local et quartier. Organisé quotidiennement par la communauté.", send_message: "Envoyez-nous un message", address_title: "Parcelle 123, Voie des Infrastructures", address_city: "Abuja, FCT, Nigeria", rights: "© 2024 CivicSpend. Tous droits réservés.", crafted_by: "Conçu par", privacy: "Politique de Confidentialité", terms: "Conditions de Service" },
    ProjectCard: { pending: "Consensus en attente", awaiting_audit: "En attente d'audit", expert_audited: "Audit par un Expert", disputed: "Contesté", ai_discovered: "Découvert par l'IA", community_added: "Ajouté par la Communauté", government: "Gouvernement", sources_attached: "Sources jointes", view_details: "Voir les Détails" },
    AddProjectModal: { title: "Signaler un Nouveau Projet", description: "Aidez la communauté en ajoutant un nouveau projet que vous avez vérifié dans votre région.", name_label: "Nom du Projet", name_placeholder: "ex. Réhabilitation de la Route Obasanjo", address_label: "Adresse Spécifique / Repère", state_label: "État / Région", budget_label: "Budget (si connu)", contractor_label: "Entrepreneur (si connu)", cancel: "Annuler", submit: "Soumettre Projet", submitting: "Soumission..." },
    UploadForm: { title: "Télécharger Preuve", description: "Téléchargez une photo ou une vidéo pour vérifier le statut de ce projet.", drag_drop: "Glissez et déposez votre fichier ici, ou cliquez pour sélectionner", support: "Prend en charge JPG, PNG, MP4 (Max 10 Mo)", caption_label: "Légende (Optionnelle)", cancel: "Annuler", upload: "Télécharger Preuve" },
    ProjectDetails: { back: "Retour au Flux", budget: "Budget", contractor: "Entrepreneur", reported: "Signalé", location: "Emplacement", evidence: "Preuves Médiatiques", no_evidence: "Aucune preuve téléchargée pour l'instant.", upload_evidence: "Télécharger Preuve", discrepancy_title: "Barre de Discordance", community_sentiment: "Sentiment de la Communauté", expert_analysis: "Analyse d'Expert", no_analysis: "Vérification d'expert en attente", ai_summary: "Résumé de l'IA", timeline: "Chronologie" },
    Tabs: { discovery: "Flux de Découverte", map: "Carte en Direct", news: "Actualités et Mises à jour" }
  },
  pt: {
    Header: { logo: "CivicSpend", how_it_works: "Como Funciona", expert_audit: "Auditoria Especializada", wallet_connected: "Carteira Conectada", connect_wallet: "Conectar Carteira", join_oracle: "Junte-se à Oracle", oracle_verified: "Oracle Verificado", feed: "Feed" },
    Hero: { title: "Gastos Cívicos Transparentes", subtitle: "Plataforma para rastrear e verificar projetos cívicos. Garanta que fundos públicos construam valor público.", scan_projects: "Escanear Projetos", report_project: "Reportar Projeto", verified: "Verificado", audited: "Auditado", disputed: "Contestado" },
    LanguageSwitcher: { switch_language: "Mudar Idioma" },
    Footer: { community_feed: "Feed da Comunidade", expert_audit: "Auditoria Especializada", how_it_works: "Como Funciona", mission_title: "Capacitando Cidadãos", mission_text: "Dados de infraestrutura verificados por profissionais em cada estado. Com curadoria da comunidade.", send_message: "Envie-nos uma Mensagem", address_title: "Lote 123, Caminho da Infraestrutura", address_city: "Abuja, FCT, Nigéria", rights: "© 2024 CivicSpend. Todos os Direitos Reservados.", crafted_by: "Criado por", privacy: "Política de Privacidade", terms: "Termos de Serviço" },
    ProjectCard: { pending: "Consenso Pendente", awaiting_audit: "Aguardando Auditoria", expert_audited: "Auditado por Especialista", disputed: "Contestado", ai_discovered: "Descoberto por IA", community_added: "Adicionado pela Comunidade", government: "Governo", sources_attached: "Fontes anexadas", view_details: "Ver Detalhes" },
    AddProjectModal: { title: "Reportar Novo Projeto", description: "Ajude a comunidade adicionando um novo projeto que você verificou.", name_label: "Nome do Projeto", name_placeholder: "ex. Reabilitação da Estrada Obasanjo", address_label: "Endereço Específico / Ponto de Referência", state_label: "Estado / Região", budget_label: "Orçamento (se conhecido)", contractor_label: "Empreiteiro (se conhecido)", cancel: "Cancelar", submit: "Enviar Projeto", submitting: "Enviando..." },
    UploadForm: { title: "Carregar Evidência", description: "Envie uma foto ou vídeo para verificar o status deste projeto.", drag_drop: "Arraste e solte o arquivo aqui, ou clique para selecionar", support: "Suporta JPG, PNG, MP4 (Max 10MB)", caption_label: "Legenda (Opcional)", cancel: "Cancelar", upload: "Carregar Evidência" },
    ProjectDetails: { back: "Voltar ao Feed", budget: "Orçamento", contractor: "Empreiteiro", reported: "Reportado", location: "Localização", evidence: "Evidência em Mídia", no_evidence: "Nenhuma evidência carregada ainda.", upload_evidence: "Carregar Evidência", discrepancy_title: "Barra de Discrepância", community_sentiment: "Sentimento da Comunidade", expert_analysis: "Análise de Especialista", no_analysis: "Verificação de especialista pendente", ai_summary: "Resumo da IA", timeline: "Linha do Tempo" },
    Tabs: { discovery: "Feed de Descoberta", map: "Mapa ao Vivo", news: "Notícias e Atualizações" }
  },
  ar: {
    Header: { logo: "سيفيك سبيند", how_it_works: "كيف يعمل", expert_audit: "تدقيق الخبراء", wallet_connected: "تم اتصال المحفظة", connect_wallet: "اتصل بالمحفظة", join_oracle: "انضم إلى أوراكل", oracle_verified: "تم التحقق من أوراكل", feed: "التغذية" },
    Hero: { title: "إنفاق مدني شفاف", subtitle: "منصة مجتمعية لتتبع ومراجعة المشاريع المدنية. ضمان أن تبني الأموال العامة قيمة عامة.", scan_projects: "مسح المشاريع", report_project: "الإبلاغ عن مشروع", verified: "تم التحقق", audited: "تمت المراجعة", disputed: "متنازع عليه" },
    LanguageSwitcher: { switch_language: "تغيير اللغة" },
    Footer: { community_feed: "تغذية المجتمع", expert_audit: "تدقيق الخبراء", how_it_works: "كيف يعمل", mission_title: "تمكين المواطنين", mission_text: "بيانات بنية تحتية تم التحقق منها من قبل محترفين في كل ولاية. منظمة يوميا من قبل المجتمع.", send_message: "أرسل لنا رسالة", address_title: "القطعة 123 ، طريق البنية التحتية", address_city: "أبوجا، نيجيريا", rights: "© 2024 سيفيك سبيند. جميع الحقوق محفوظة.", crafted_by: "صُنع بواسطة", privacy: "سياسة الخصوصية", terms: "شروط الخدمة" },
    ProjectCard: { pending: "في انتظار الإجماع", awaiting_audit: "في انتظار المراجعة", expert_audited: "تم تدقيقه من خبير", disputed: "متنازع عليه", ai_discovered: "مكتشف بواسطة الذكاء الاصطناعي", community_added: "مضاف من المجتمع", government: "حكومي", sources_attached: "مصادر مرفقة", view_details: "عرض التفاصيل" },
    AddProjectModal: { title: "الإبلاغ عن مشروع جديد", description: "ساعد المجتمع عن طريق إضافة مشروع جديد قمت بالتحقق منه في منطقتك.", name_label: "اسم المشروع", name_placeholder: "مثال: إعادة تأهيل طريق أوباسانجو", address_label: "العنوان المحدد / المعلم", state_label: "الولاية / المنطقة", budget_label: "الميزانية (إن وجدت)", contractor_label: "المقاول (إن وجد)", cancel: "إلغاء", submit: "إرسال المشروع", submitting: "جاري الإرسال..." },
    UploadForm: { title: "تحميل أدلة", description: "قم بتحميل صورة أو فيديو للتحقق من حالة هذا المشروع.", drag_drop: "اسحب وأسقط الملف هنا، أو انقر للاختيار", support: "يدعم JPG، PNG، MP4 (بحد أقصى 10 ميغابايت)", caption_label: "وصف (اختياري)", cancel: "إلغاء", upload: "تحميل أدلة" },
    ProjectDetails: { back: "العودة إلى التغذية", budget: "الميزانية", contractor: "المقاول", reported: "تاريخ الإبلاغ", location: "الموقع", evidence: "أدلة إعلامية", no_evidence: "لم يتم تحميل أي أدلة بعد.", upload_evidence: "تحميل أدلة", discrepancy_title: "شريط التباين", community_sentiment: "آراء المجتمع", expert_analysis: "تحليل الخبراء", no_analysis: "في انتظار التحقق من الخبراء", ai_summary: "ملخص الذكاء الاصطناعي", timeline: "الجدول الزمني" },
    Tabs: { discovery: "تغذية الاستكشاف", map: "خريطة حية", news: "أخبار وتحديثات" }
  },
  sw: {
    Header: { logo: "CivicSpend", how_it_works: "Jinsi Inavyofanya Kazi", expert_audit: "Ukaguzi wa Wataalam", wallet_connected: "Mkoba Umeunganishwa", connect_wallet: "Unganisha Mkoba", join_oracle: "Jiunge na Oracle", oracle_verified: "Imethibitishwa na Oracle", feed: "Habari" },
    Hero: { title: "Matumizi ya Umma kwa Uwazi", subtitle: "Jukwaa la jamii la kufuatilia na kuthibitisha miradi ya umma.", scan_projects: "Kagua Miradi", report_project: "Ripoti Mradi", verified: "Imethibitishwa", audited: "Imekaguliwa", disputed: "Inabishaniwa" },
    LanguageSwitcher: { switch_language: "Badilisha Lugha" },
    Footer: { community_feed: "Habari za Jamii", expert_audit: "Ukaguzi wa Wataalam", how_it_works: "Jinsi Inavyofanya Kazi", mission_title: "Kuwawezesha Wananchi", mission_text: "Data ya miundombinu iliyothibitishwa na wataalamu.", send_message: "Tutume Ujumbe", address_title: "Kiwanja 123, Njia ya Miundombinu", address_city: "Abuja, FCT, Nigeria", rights: "© 2024 CivicSpend. Haki Zote Zimehifadhiwa.", crafted_by: "Imeundwa na", privacy: "Sera ya Faragha", terms: "Masharti ya Huduma" },
    ProjectCard: { pending: "Inasubiri Makubaliano", awaiting_audit: "Inasubiri Ukaguzi", expert_audited: "Imekaguliwa na Mtaalam", disputed: "Inabishaniwa", ai_discovered: "Iligunduliwa na AI", community_added: "Imeongezwa na Jamii", government: "Serikali", sources_attached: "Vyanzo vimeambatishwa", view_details: "Tazama Maelezo" },
    AddProjectModal: { title: "Ripoti Mradi Mpya", description: "Saidia jamii kwa kuongeza mradi mpya uliothibitisha.", name_label: "Jina la Mradi", name_placeholder: "k.m. Ukarabati wa Barabara ya Obasanjo", address_label: "Anwani Maalum", state_label: "Jimbo / Mkoa", budget_label: "Bajeti (kama inajulikana)", contractor_label: "Mkandarasi (kama anajulikana)", cancel: "Ghairi", submit: "Wasilisha Mradi", submitting: "Inawasilisha..." },
    UploadForm: { title: "Pakia Ushahidi", description: "Pakia picha au video ili kuthibitisha hali ya mradi huu.", drag_drop: "Buruta na udondoshe faili yako hapa", support: "Inasaidia JPG, PNG, MP4 (Max 10MB)", caption_label: "Maelezo (Si Lazima)", cancel: "Ghairi", upload: "Pakia Ushahidi" },
    ProjectDetails: { back: "Rudi kwenye Habari", budget: "Bajeti", contractor: "Mkandarasi", reported: "Imeripotiwa", location: "Mahali", evidence: "Ushahidi wa Vyombo vya Habari", no_evidence: "Hakuna ushahidi uliopakiwa bado.", upload_evidence: "Pakia Ushahidi", discrepancy_title: "Baa ya Tofauti", community_sentiment: "Hisia za Jamii", expert_analysis: "Uchambuzi wa Wataalam", no_analysis: "Inasubiri uthibitisho wa mtaalam", ai_summary: "Muhtasari wa AI", timeline: "Ratiba" },
    Tabs: { discovery: "Uvumbuzi", map: "Ramani ya Moja kwa Moja", news: "Habari na Sasisho" }
  },
  ha: {
    Header: { logo: "CivicSpend", how_it_works: "Yadda Ake Yi", expert_audit: "Binciken Masana", wallet_connected: "An Haɗa Jaka", connect_wallet: "Haɗa Jaka", join_oracle: "Shiga Oracle", oracle_verified: "Tabbacin Oracle", feed: "Labarai" },
    Hero: { title: "Kudin Jama'a a bayyane", subtitle: "Dandalin da jama'a ke jagoranta don lura da ayyukan yau da kullum.", scan_projects: "Duba Ayyuka", report_project: "Kawo Rahoton Aiki", verified: "Tabbatacce", audited: "An Bincika", disputed: "An Yi Rigima" },
    LanguageSwitcher: { switch_language: "Canja Harshe" },
    Footer: { community_feed: "Labaran Al'umma", expert_audit: "Binciken Masana", how_it_works: "Yadda Ake Yi", mission_title: "Karfafa Jama'a", mission_text: "Bayanan ababen more rayuwa da kwararru suka tabbatar.", send_message: "Aiko Mana Sako", address_title: "Fili 123, Hanyar Ababen More Rayuwa", address_city: "Abuja, FCT, Najeriya", rights: "© 2024 CivicSpend. Dukkan Hakkoki Sun Kare.", crafted_by: "Wanda ya tsara", privacy: "Tsarin Sirri", terms: "Ka'idojin Sabis" },
    ProjectCard: { pending: "Ana Jiran Amincewa", awaiting_audit: "Ana Jiran Bincike", expert_audited: "Masanin Ya Bincika", disputed: "An Yi Rigima", ai_discovered: "AI Ne Ya Gano", community_added: "Al'umma Sun Kara", government: "Gwamnati", sources_attached: "Majiyoyi da aka makala", view_details: "Duba Cikakkun Bayanai" },
    AddProjectModal: { title: "Kawo Rahoton Sabon Aiki", description: "Taimaka wa al'umma ta hanyar ƙara sabon aiki da ka tabbatar.", name_label: "Sunan Aiki", name_placeholder: "misali Gyaran Hanyar Obasanjo", address_label: "Ainihin Adireshi / Alama", state_label: "Jiha / Yanki", budget_label: "Kasafin Kudi", contractor_label: "Dan Kwangila", cancel: "Soke", submit: "Aika Aiki", submitting: "Ana Aikewa..." },
    UploadForm: { title: "Saka Shaida", description: "Saka hoto ko bidiyo don tabbatar da aikin.", drag_drop: "Jawo kuma saki fayil anan, ko danna", support: "Yana tallafawa JPG, PNG, MP4 (Max 10MB)", caption_label: "Rubutu (Na Zabi)", cancel: "Soke", upload: "Saka Shaida" },
    ProjectDetails: { back: "Koma baya", budget: "Kasafin Kudi", contractor: "Dan Kwangila", reported: "An Kawo Rahoto", location: "Wuri", evidence: "Shaidar Kafofin Yada Labarai", no_evidence: "Babu shaidar da aka saka tukunna.", upload_evidence: "Saka Shaida", discrepancy_title: "Matsalar Tabbatarwa", community_sentiment: "Tunanin Al'umma", expert_analysis: "Binciken Masana", no_analysis: "Ana jiran tabbacin masana", ai_summary: "Takaitaccen AI", timeline: "Tsarin Lokaci" },
    Tabs: { discovery: "Labarai", map: "Taswira tsaye", news: "Sabbin Labarai" }
  }
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(translations.fr, null, 2));
fs.writeFileSync('messages/pt.json', JSON.stringify(translations.pt, null, 2));
fs.writeFileSync('messages/ar.json', JSON.stringify(translations.ar, null, 2));
fs.writeFileSync('messages/sw.json', JSON.stringify(translations.sw, null, 2));
fs.writeFileSync('messages/ha.json', JSON.stringify(translations.ha, null, 2));

console.log("Written translation files!");
