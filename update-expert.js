const fs = require('fs');

const langs = ['en', 'fr', 'pt', 'ar', 'sw', 'ha'];

const additions = {
  en: {
    "ExpertDashboard": {
      "oracle_access": "Expert Oracle Access",
      "oracle_desc": "Connect your verified auditor wallet to review community consensus reports and cryptographically sign discrepancy findings to the Arc blockchain.",
      "authenticate": "Authenticate Auditor Credentials",
      "pending_audits": "Pending Audits",
      "review_sign": "Review and sign physical value verification.",
      "verified_engineer": "Verified Civil Engineer",
      "project_name": "Project Name",
      "location": "Location",
      "claimed_budget": "Claimed Budget (NGN)",
      "community_status": "Community Status",
      "action": "Action",
      "ready_for_audit": "Ready for Audit",
      "awaiting_consensus": "Awaiting Consensus",
      "perform_audit": "Perform Audit",
      "no_pending": "No pending audits at this time.",
      "audit_verification": "Audit Verification",
      "project_lbl": "Project",
      "claimed_gov_budget": "Claimed Government Budget",
      "enter_verified_value": "Enter Verified Physical Value (NGN)",
      "based_on_evidence": "Based on submitted photographic evidence and engineering estimation.",
      "audit_note": "Public Audit Note (Optional)",
      "explain_findings": "Explain your findings. This note will be signed by your wallet and visible to the public.",
      "signing": "Signing on Blockchain...",
      "sign_report": "Sign Discrepancy Report"
    }
  },
  fr: {
    "ExpertDashboard": {
      "oracle_access": "Accès Oracle Expert",
      "oracle_desc": "Connectez votre portefeuille d'auditeur vérifié pour examiner les rapports...",
      "authenticate": "Authentifier les informations de l'auditeur",
      "pending_audits": "Audits en attente",
      "review_sign": "Examiner et signer la vérification",
      "verified_engineer": "Ingénieur civil vérifié",
      "project_name": "Nom du Projet",
      "location": "Emplacement",
      "claimed_budget": "Budget Réclamé (NGN)",
      "community_status": "Statut de la Communauté",
      "action": "Action",
      "ready_for_audit": "Prêt pour Audit",
      "awaiting_consensus": "Consensus en attente",
      "perform_audit": "Effectuer l'Audit",
      "no_pending": "Aucun audit en attente pour le moment.",
      "audit_verification": "Vérification d'Audit",
      "project_lbl": "Projet",
      "claimed_gov_budget": "Budget Gouvernemental Réclamé",
      "enter_verified_value": "Entrer la Valeur Physique Vérifiée (NGN)",
      "based_on_evidence": "Basé sur les preuves soumises...",
      "audit_note": "Note Publique d'Audit (Optionnelle)",
      "explain_findings": "Expliquez vos découvertes...",
      "signing": "Signature sur Blockchain...",
      "sign_report": "Signer le Rapport de Discordance"
    }
  },
  pt: {
    "ExpertDashboard": {
      "oracle_access": "Acesso Oráculo Especialista",
      "oracle_desc": "Conecte sua carteira de auditor verificada para revisar...",
      "authenticate": "Autenticar Credenciais do Auditor",
      "pending_audits": "Auditorias Pendentes",
      "review_sign": "Revisar e assinar verificação",
      "verified_engineer": "Engenheiro Civil Verificado",
      "project_name": "Nome do Projeto",
      "location": "Localização",
      "claimed_budget": "Orçamento Declarado (NGN)",
      "community_status": "Status da Comunidade",
      "action": "Ação",
      "ready_for_audit": "Pronto para Auditoria",
      "awaiting_consensus": "Aguardando Consenso",
      "perform_audit": "Realizar Auditoria",
      "no_pending": "Nenhuma auditoria pendente no momento.",
      "audit_verification": "Verificação de Auditoria",
      "project_lbl": "Projeto",
      "claimed_gov_budget": "Orçamento Governamental Declarado",
      "enter_verified_value": "Inserir Valor Físico Verificado (NGN)",
      "based_on_evidence": "Com base nas evidências enviadas...",
      "audit_note": "Nota Pública de Auditoria (Opcional)",
      "explain_findings": "Explique suas descobertas...",
      "signing": "Assinando no Blockchain...",
      "sign_report": "Assinar Relatório de Discrepância"
    }
  },
  ar: {
    "ExpertDashboard": {
      "oracle_access": "وصول خبير أوراكل",
      "oracle_desc": "قم بربط محفظة المدقق الخاصة بك لمراجعة تقارير الإجماع...",
      "authenticate": "مصادقة بيانات المدقق",
      "pending_audits": "عمليات التدقيق المعلقة",
      "review_sign": "مراجعة وتوقيع التحقق",
      "verified_engineer": "مهندس مدني معتمد",
      "project_name": "اسم المشروع",
      "location": "الموقع",
      "claimed_budget": "الميزانية المطالب بها (NGN)",
      "community_status": "حالة المجتمع",
      "action": "إجراء",
      "ready_for_audit": "جاهز للتدقيق",
      "awaiting_consensus": "في انتظار الإجماع",
      "perform_audit": "إجراء التدقيق",
      "no_pending": "لا توجد تدقيقات معلقة حاليًا.",
      "audit_verification": "تحقق التدقيق",
      "project_lbl": "مشروع",
      "claimed_gov_budget": "ميزانية الحكومة المطالب بها",
      "enter_verified_value": "إدخال القيمة الفعلية المتحقق منها (NGN)",
      "based_on_evidence": "بناءً على الأدلة المقدمة...",
      "audit_note": "ملاحظة تدقيق عامة (اختياري)",
      "explain_findings": "اشرح النتائج التي توصلت إليها...",
      "signing": "التوقيع على البلوكتشين...",
      "sign_report": "توقيع تقرير التباين"
    }
  },
  sw: {
    "ExpertDashboard": {
      "oracle_access": "Ufikiaji wa Oracle wa Mtaalam",
      "oracle_desc": "Unganisha pochi yako iliyothibitishwa...",
      "authenticate": "Thibitisha Vitambulisho vya Mkaguzi",
      "pending_audits": "Ukaguzi Unaosubiriwa",
      "review_sign": "Pitia na utie saini uthibitishaji...",
      "verified_engineer": "Mhandisi wa Ujenzi Aliyethibitishwa",
      "project_name": "Jina la Mradi",
      "location": "Eneo",
      "claimed_budget": "Bajeti Iliyodaiwa (NGN)",
      "community_status": "Hali ya Jamii",
      "action": "Kitendo",
      "ready_for_audit": "Tayari kwa Ukaguzi",
      "awaiting_consensus": "Inasubiri Makubaliano",
      "perform_audit": "Fanya Ukaguzi",
      "no_pending": "Hakuna ukaguzi unaosubiri kwa sasa.",
      "audit_verification": "Uthibitishaji wa Ukaguzi",
      "project_lbl": "Mradi",
      "claimed_gov_budget": "Bajeti Inayodaiwa na Serikali",
      "enter_verified_value": "Weka Thamani Iliyothibitishwa (NGN)",
      "based_on_evidence": "Kulingana na ushahidi...",
      "audit_note": "Ujumbe wa Ukaguzi (Si lazima)",
      "explain_findings": "Eleza matokeo yako...",
      "signing": "Inasaini Kwenye Blockchain...",
      "sign_report": "Saini Ripoti ya Tofauti"
    }
  },
  ha: {
    "ExpertDashboard": {
      "oracle_access": "Hanyar Kwararre",
      "oracle_desc": "Haɗa walet ɗin ku don bincika...",
      "authenticate": "Tabbatar da Takardun Bincike",
      "pending_audits": "Bincike Masu Jiran Gado",
      "review_sign": "Duba kuma sa hannu kan tabbatarwa...",
      "verified_engineer": "Tabbataccen Injiniya",
      "project_name": "Sunan Aiki",
      "location": "Wuri",
      "claimed_budget": "Kasafin Kudi (NGN)",
      "community_status": "Matsayin Al'umma",
      "action": "Mataki",
      "ready_for_audit": "A Shirye Don Bincike",
      "awaiting_consensus": "Ana Jiran Amincewa",
      "perform_audit": "Gudanar Da Bincike",
      "no_pending": "Babu bincike da ke jiran a yanzu.",
      "audit_verification": "Tabbatar da Bincike",
      "project_lbl": "Aiki",
      "claimed_gov_budget": "Kasafin Gwamnati",
      "enter_verified_value": "Shigar da Ainihin Daraja (NGN)",
      "based_on_evidence": "Bisa ga shaidar da aka bayar...",
      "audit_note": "Bayanin Bincike (Zabi)",
      "explain_findings": "Yi bayanin sakamakon ku...",
      "signing": "Ana Sa hannu kan Blockchain...",
      "sign_report": "Sa hannu kan Matsalar"
    }
  }
};

langs.forEach(lang => {
  const filePath = `messages/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.ExpertDashboard = additions[lang].ExpertDashboard;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log("Updated expert dashboard strings!");
