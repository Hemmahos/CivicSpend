import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to CivicSpend. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform to track, report, and audit public infrastructure projects.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            When you use CivicSpend, we may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Device Information:</strong> We use device fingerprints (such as local storage or cookies) to ensure fair voting and prevent duplicate submissions without requiring you to create an account.</li>
            <li><strong>Uploaded Evidence:</strong> Photos, notes, and geographical locations you submit to verify project status.</li>
            <li><strong>Expert Credentials:</strong> For professionals acting as Oracles, we verify your professional identity or wallet address to cryptographically sign audits.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            Your information is used strictly to maintain the integrity of the platform:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>To track community consensus and prevent vote manipulation.</li>
            <li>To display verified public infrastructure evidence to the community.</li>
            <li>To establish accountability and transparency through expert cryptographic signatures.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Security</h2>
          <p>
            CivicSpend is built on transparency. All evidence and project data submitted to the platform becomes public record. However, we do not sell your personal device data or professional wallet credentials to third parties. We use industry-standard security measures (including decentralized ledgers and secure databases) to protect against unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at privacy@civicspend.ng.
          </p>
        </section>
      </div>
    </div>
  );
}
