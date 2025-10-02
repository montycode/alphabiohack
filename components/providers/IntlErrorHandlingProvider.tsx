'use client';

import {NextIntlClientProvider} from 'next-intl';

export default function IntlErrorHandlingProvider({children}: {children: React.ReactNode}) {
  return (
    <NextIntlClientProvider
      onError={(error) => console.error(error)}
      getMessageFallback={({namespace, key}) => `${namespace}.${key}`}
    >
      {children}
    </NextIntlClientProvider>
  );
}