'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    startTransition(() => {
      // Replace the current locale in the pathname with the new locale
      const segments = pathname.split('/');
      segments[1] = nextLocale;
      router.replace(segments.join('/') || '/');
    });
  };

  return (
    <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <Globe className="h-4 w-4 text-gray-500" />
      </div>
      <select
        value={locale}
        onChange={onSelectChange}
        disabled={isPending}
        aria-label={t('switch_language')}
        className="block w-full appearance-none bg-transparent py-1.5 pl-8 pr-6 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="pt">Português</option>
        <option value="ar">العربية (Arabic)</option>
        <option value="sw">Kiswahili</option>
        <option value="ha">Hausa</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
