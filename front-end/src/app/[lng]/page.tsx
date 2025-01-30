import { Advent_Pro } from 'next/font/google';

import ImageSendForm from '@components/ImageSendForm';
import LanguageSwitcher from '@components/LanguageSwitcher';
import { fallbackLng, languages } from '@i18n/settings';
import styles from '@styles/page.module.css';

const font = Advent_Pro({ subsets: ['latin'], variable: '--font-advent-pro' });

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  return (
    <div className={styles.page} style={{ background: 'grey' }}>
      <div className={font.className}>
        <main className={styles.main}>
          <LanguageSwitcher currentLocale={lng} />
          <ImageSendForm />
        </main>
      </div>
    </div>
  );
}
