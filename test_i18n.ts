import {getRequestConfig} from 'next-intl/server';
export default getRequestConfig(async (params) => {
  console.log(params);
  return { locale: 'en', messages: {} };
});
