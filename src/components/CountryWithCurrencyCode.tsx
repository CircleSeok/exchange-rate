import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { CountryInfo } from '../api/Ipinfo';

interface ExchangeRateData {
  rates: Record<string, number>;
}

export interface IpInfoData {
  ip: string;
  country: string;
}

const APIKEY = process.env.REACT_APP_IPINFO;

const useUserCountry = () => {
  return useQuery<IpInfoData>('userCountry', fetchUserCountry);
};

const useCurrencyCode = (countryCode: string) => {
  return useQuery<string>(['currencyCode', countryCode], () =>
    getCurrencyCode(countryCode)
  );
};

export const fetchUserCountry = async () => {
  try {
    const ipInfoResponse = await axios.get(
      `https://ipinfo.io/json?token=${APIKEY}`
    );
    return ipInfoResponse.data;
  } catch (error) {
    throw new Error('사용자 국가 불러오기 실패');
  }
};

export const getCurrencyCode = async (countryCode: string): Promise<string> => {
  try {
    const response = await axios.get<CountryInfo[]>(
      'https://restcountries.com/v3.1/all'
    );
    const data = response.data;
    const country = data.find((country) => country.cca2 === countryCode);
    if (!country) {
      throw new Error('국가를 찾을 수 없음');
    }
    const currencyCode = Object.keys(country.currencies)[0];
    return currencyCode;
  } catch (error) {
    throw new Error('통화 코드 가져오기 실패');
  }
};

const options = [
  'USD',
  'EUR',
  'CAD',
  'AUD',
  'GBP',
  'INR',
  'SGD',
  'CNY',
  'JPY',
  'KRW',
];

const ExchangeRateCalculator: React.FC = () => {
  const CurrencyCodeOne = useRef<HTMLSelectElement>(null);
  const CurrencyCodeTwo = useRef<HTMLSelectElement>(null);
  const ConvertOne = useRef<HTMLInputElement>(null);
  const ConvertTwo = useRef<HTMLInputElement>(null);
  const rateEl = useRef<HTMLParagraphElement>(null);

  const userCountryQuery = useUserCountry();
  const currencyCodeQuery = useCurrencyCode(
    userCountryQuery.data?.country ?? ''
  );

  useEffect(() => {
    if (CurrencyCodeOne.current && currencyCodeQuery.data) {
      CurrencyCodeOne.current.value = currencyCodeQuery.data;
    }
  }, [currencyCodeQuery.data]);

  const getResultRatesByBaseCode = async (
    baseCode: string,
    resultCode: string
  ): Promise<number> => {
    try {
      const response = await axios.get<ExchangeRateData>(
        `https://api.exchangerate-api.com/v4/latest/${baseCode}`
      );
      const data = response.data;
      return data.rates[resultCode] || 0;
    } catch (error) {
      throw new Error('에러 발생');
    }
  };

  const calculate = async () => {
    const currency_one: string = CurrencyCodeOne.current?.value || '';
    const currency_two: string = CurrencyCodeTwo.current?.value || '';

    try {
      const data: number = await getResultRatesByBaseCode(
        currency_one,
        currency_two
      );
      const amount_one: number = parseFloat(ConvertOne.current?.value || '0');
      const convertedAmount: number = data * amount_one || 0;

      if (ConvertTwo.current && rateEl.current) {
        ConvertTwo.current.value = convertedAmount.toFixed(4).toString();
        rateEl.current.innerText = `${amount_one} ${currency_one} = ${convertedAmount.toFixed(
          4
        )} ${currency_two}`;
      }
    } catch (error) {
      throw new Error('에러 발생');
    }
  };

  return (
    <div>
      <div>
        <label htmlFor='CurrencyCodeOne'>Currency 1:</label>
        <select id='CurrencyCodeOne' ref={CurrencyCodeOne}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type='number' ref={ConvertOne} />
      </div>
      <div>
        <label htmlFor='CurrencyCodeTwo'>Currency 2:</label>
        <select id='CurrencyCodeTwo' ref={CurrencyCodeTwo}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type='number' ref={ConvertTwo} readOnly />
      </div>
      <button onClick={calculate}>Calculate</button>
      <p ref={rateEl}></p>
    </div>
  );
};

export default ExchangeRateCalculator;
