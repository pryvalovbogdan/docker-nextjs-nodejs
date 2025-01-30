'use client';

import { useRouter } from 'next/navigation';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();

  const switchLanguage = (locale: string) => {
    router.push(`/${locale}`);
  };

  return (
    <div>
      <button type='submit' disabled={currentLocale === 'en'} onClick={() => switchLanguage('en')}>
        English
      </button>
      <button type='submit' disabled={currentLocale === 'ua'} onClick={() => switchLanguage('ua')}>
        Українська
      </button>
    </div>
  );
}
