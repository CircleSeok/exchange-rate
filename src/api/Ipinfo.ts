import axios from 'axios';
import { useQuery } from 'react-query';

export interface IpInfoData {
  ip: string;
  country: string;
}

export interface CountryInfo {
  cca2: string;
  currencies: { code: string }[];
}
const APIKEY = process.env.REACT_APP_IPINFO;

export const fetchUserCountry = async () => {
  try {
    const ipInfoResponse = await axios.get(
      `https://ipinfo.io/json?token=${APIKEY}`
    );
    console.log(ipInfoResponse.data);
    return ipInfoResponse.data;
  } catch (error) {
    throw new Error('사용자 국가 불러오기 실패');
  }
};

export const useUserCountry = () => {
  return useQuery<IpInfoData>('userCountry', fetchUserCountry);
};

// export const getCurrencyCode = async (countryCode: string): Promise<string> => {
//   try {
//     const response = await axios.get<CountryInfo[]>(
//       'https://restcountries.com/v3.1/all'
//     );
//     const data = response.data;
//     console.log(data);
//     const country = data.find((country) => country.cca2 === countryCode);
//     if (!country) {
//       throw new Error('국가를 찾을 수 없음');
//     }
//     const currencyCode = Object.keys(country.currencies)[0];
//     return currencyCode;
//   } catch (error) {
//     console.log('통화 코드 에러');
//     throw new Error('통화 코드 가져오기 실패');
//   }
// };

export const getCurrencyCode = async (countryCode: string): Promise<string> => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    const countryData = response.data[0];

    if (!countryData) {
      throw new Error('국가를 찾을 수 없음');
    }

    const currencyCode = Object.keys(countryData.currencies)[0];
    return currencyCode;
  } catch (error) {
    console.log('통화 코드 에러:', error);
    throw new Error('통화 코드 가져오기 실패');
  }
};

export const useCurrencyCode = (countryCode: string) => {
  return useQuery(['currencyCode', countryCode], () =>
    getCurrencyCode(countryCode)
  );
};
//////////////////////////////////

export const fetchCurrencyCodes = async (): Promise<string[]> => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countriesData = response.data;

    // 모든 국가의 통화 코드를 추출
    const currencyCodes: string[] = countriesData.flatMap((country: any) =>
      Object.keys(country.currencies || {})
    );

    // 중복된 통화 코드를 제거
    const uniqueCurrencyCodes = Array.from(new Set(currencyCodes));

    console.log('통화 코드 목록:', uniqueCurrencyCodes);

    return uniqueCurrencyCodes;
  } catch (error) {
    console.error('통화 코드 가져오기 실패:', error);
    throw new Error('통화 코드 가져오기 실패');
  }
};
