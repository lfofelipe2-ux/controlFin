import 'react-i18next';
import enAuth from '../locales/en/auth.json';
import enCommon from '../locales/en/common.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof enCommon;
      auth: typeof enAuth;
    };
  }
}
