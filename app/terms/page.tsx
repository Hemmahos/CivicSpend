import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground italic mb-8">Last Updated: September 2026</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using CivicSpend ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            CivicSpend provides a decentralized, community-driven platform for tracking, reporting, and auditing public infrastructure projects and government spending. We rely on crowd-sourced evidence and expert cryptographic audits to ensure transparency.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Conduct</h2>
          <p>
            You agree to use the Platform only for lawful purposes. You agree not to take any action that might compromise the security of the Platform, render the Platform inaccessible to others, or otherwise cause damage to the Platform or its Content. Specifically, you agree not to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Submit false, misleading, or digitally manipulated photographic evidence.</li>
            <li>Attempt to bypass device fingerprinting to manipulate consensus voting (upvotes/downvotes).</li>
            <li>Use the platform to defame, harass, or threaten individuals or government entities.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Expert Auditors (Oracles)</h2>
          <p>
            Professionals accessing the Expert Audit dashboard must provide accurate credentials. By signing a discrepancy report on the blockchain, you attest to the physical engineering value to the best of your professional knowledge. CivicSpend is not liable for inaccuracies in expert reports.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            All evidence uploaded to CivicSpend is released under a Creative Commons Public Domain Dedication (CC0) license, ensuring that the data remains open and freely accessible to the public, journalists, and researchers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided "as is" without warranty of any kind, express or implied. We do not guarantee that the information crowd-sourced on the platform is 100% accurate, though we utilize community consensus and expert audits to mitigate inaccuracies.
          </p>
        </section>
      </div>
    </div>
  );
}
