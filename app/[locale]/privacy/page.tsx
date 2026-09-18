import React from 'react';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('Privacy');
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('p1_title')}</h2>
          <p>{t('p1_desc')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('p2_title')}</h2>
          <p>{t('p2_desc')}</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>{t('p2_li1')}</li>
            <li>{t('p2_li2')}</li>
            <li>{t('p2_li3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('p3_title')}</h2>
          <p>{t('p3_desc')}</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>{t('p3_li1')}</li>
            <li>{t('p3_li2')}</li>
            <li>{t('p3_li3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('p4_title')}</h2>
          <p>{t('p4_desc')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('p5_title')}</h2>
          <p>{t('p5_desc')}</p>
        </section>
      </div>
    </div>
  );
}
