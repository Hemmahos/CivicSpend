const fs = require('fs');

const langs = ['en', 'fr', 'pt', 'ar', 'sw', 'ha'];

const additions = {
  en: {
    "Home": {
      "community_feed": "Community Feed",
      "active": "Active",
      "ai_radar": "AI Radar",
      "add_project": "Add Project",
      "no_projects_title": "No projects active in your feed",
      "no_projects_desc": "There are currently no civic infrastructure projects tracked. Be the first to report a project manually, or use the AI Radar to automatically discover projects from government sources!",
      "scan_ai": "Scan with AI Radar",
      "add_manual": "Add Project Manually",
      "show_less": "Show less",
      "load_more": "Load more projects",
      "ai_toast": "AI Discovery System found {count} new government projects today!"
    }
  },
  fr: {
    "Home": {
      "community_feed": "Flux Communautaire",
      "active": "Actif",
      "ai_radar": "Radar IA",
      "add_project": "Ajouter un projet",
      "no_projects_title": "Aucun projet actif dans votre flux",
      "no_projects_desc": "Aucun projet d'infrastructure civique n'est actuellement suivi. Soyez le premier à signaler un projet manuellement, ou utilisez le Radar IA pour découvrir automatiquement des projets à partir de sources gouvernementales !",
      "scan_ai": "Scanner avec le Radar IA",
      "add_manual": "Ajouter un projet manuellement",
      "show_less": "Montrer moins",
      "load_more": "Charger plus de projets",
      "ai_toast": "Le système de découverte IA a trouvé {count} nouveaux projets gouvernementaux aujourd'hui !"
    }
  },
  pt: {
    "Home": {
      "community_feed": "Feed da Comunidade",
      "active": "Ativo",
      "ai_radar": "Radar IA",
      "add_project": "Adicionar Projeto",
      "no_projects_title": "Nenhum projeto ativo em seu feed",
      "no_projects_desc": "Atualmente não há projetos de infraestrutura cívica rastreados. Seja o primeiro a relatar um projeto manualmente ou use o Radar IA para descobrir projetos de fontes governamentais automaticamente!",
      "scan_ai": "Escanear com Radar IA",
      "add_manual": "Adicionar Projeto Manualmente",
      "show_less": "Mostrar menos",
      "load_more": "Carregar mais projetos",
      "ai_toast": "O Sistema de Descoberta de IA encontrou {count} novos projetos governamentais hoje!"
    }
  },
  ar: {
    "Home": {
      "community_feed": "تغذية المجتمع",
      "active": "نشط",
      "ai_radar": "رادار الذكاء الاصطناعي",
      "add_project": "إضافة مشروع",
      "no_projects_title": "لا توجد مشاريع نشطة في خلاصتك",
      "no_projects_desc": "لا توجد حاليا مشاريع بنية تحتية مدنية يتم تتبعها. كن أول من يبلغ عن مشروع يدويا ، أو استخدم رادار الذكاء الاصطناعي لاكتشاف المشاريع تلقائيا من مصادر حكومية!",
      "scan_ai": "مسح باستخدام رادار الذكاء الاصطناعي",
      "add_manual": "إضافة مشروع يدويا",
      "show_less": "عرض أقل",
      "load_more": "تحميل المزيد من المشاريع",
      "ai_toast": "عثر نظام اكتشاف الذكاء الاصطناعي على {count} مشاريع حكومية جديدة اليوم!"
    }
  },
  sw: {
    "Home": {
      "community_feed": "Habari za Jamii",
      "active": "Inayotumika",
      "ai_radar": "Rada ya AI",
      "add_project": "Ongeza Mradi",
      "no_projects_title": "Hakuna miradi inayofanya kazi kwenye mlisho wako",
      "no_projects_desc": "Hivi sasa hakuna miradi ya miundombinu ya raia inayofuatiliwa. Kuwa wa kwanza kuripoti mradi kwa mikono, au tumia Rada ya AI kugundua miradi moja kwa moja kutoka kwa vyanzo vya serikali!",
      "scan_ai": "Changanua na Rada ya AI",
      "add_manual": "Ongeza Mradi kwa Mikono",
      "show_less": "Onyesha kidogo",
      "load_more": "Pakia miradi zaidi",
      "ai_toast": "Mfumo wa Ugunduzi wa AI umepata miradi {count} mipya ya serikali leo!"
    }
  },
  ha: {
    "Home": {
      "community_feed": "Labaran Al'umma",
      "active": "Mai Aiki",
      "ai_radar": "Radar AI",
      "add_project": "Kara Aiki",
      "no_projects_title": "Babu ayyuka masu aiki a cikin ciyarwarku",
      "no_projects_desc": "Babu wasu ayyukan ababen more rayuwa da ake biyawa. Kasance na farko da zai ba da rahoton aikin da hannu, ko amfani da Radar AI don gano ayyuka ta atomatik daga tushen gwamnati!",
      "scan_ai": "Bincika da Radar AI",
      "add_manual": "Kara Aiki da Hannu",
      "show_less": "Nuna kadan",
      "load_more": "Bude wasu ayyukan",
      "ai_toast": "Tsarin Gano AI ya sami sababbin ayyukan gwamnati guda {count} a yau!"
    }
  }
};

langs.forEach(lang => {
  const filePath = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.Home = additions[lang].Home;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log("Updated translation files with Home strings!");
