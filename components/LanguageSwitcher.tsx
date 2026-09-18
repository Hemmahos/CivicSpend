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
    <div className="relative flex items-center bg-transparent rounded-md border border-[#006b40] hover:bg-[#006b40]/30 transition-colors">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <Globe className="h-4 w-4 text-gray-400" />
      </div>
      <select
        value={locale}
        onChange={onSelectChange}
        disabled={isPending}
        aria-label={t('switch_language')}
        className="block w-full appearance-none bg-transparent py-1.5 pl-8 pr-6 text-sm font-medium text-gray-300 hover:text-white focus:outline-none cursor-pointer"
      >
        <option value="en" className="bg-[#004d2e] text-white">English</option>
        <option value="fr" className="bg-[#004d2e] text-white">Français</option>
        <option value="pt" className="bg-[#004d2e] text-white">Português</option>
        <option value="ar" className="bg-[#004d2e] text-white">العربية (Arabic)</option>
        <option value="sw" className="bg-[#004d2e] text-white">Kiswahili</option>
        <option value="ha" className="bg-[#004d2e] text-white">Hausa</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
