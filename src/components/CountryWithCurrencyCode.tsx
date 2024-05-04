import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import {
  CountryInfo,
  IpInfoData,
  fetchUserCountry,
  getCurrencyCode,
} from '../api/Ipinfo';
import { getResultRatesByBaseCode } from '../api/ExchangeRate';

const APIKEY = process.env.REACT_APP_IPINFO;

const useUserCountry = () => {
  return useQuery<IpInfoData>('userCountry', fetchUserCountry);
};

const useCurrencyCode = (countryCode: string) => {
  return useQuery<string>(['currencyCode', countryCode], () =>
    getCurrencyCode(countryCode)
  );
};

const useInputRef = () => {
  const CurrencyCodeOne = useRef<HTMLSelectElement>(null);
  const CurrencyCodeTwo = useRef<HTMLSelectElement>(null);
  const ConvertOne = useRef<HTMLInputElement>(null);
  const ConvertTwo = useRef<HTMLInputElement>(null);
  const rateEl = useRef<HTMLParagraphElement>(null);

  return { CurrencyCodeOne, CurrencyCodeTwo, ConvertOne, ConvertTwo, rateEl };
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
  const { CurrencyCodeOne, CurrencyCodeTwo, ConvertOne, ConvertTwo, rateEl } =
    useInputRef();

  const userCountryQuery = useUserCountry();
  const currencyCodeQuery = useCurrencyCode(
    userCountryQuery.data?.country ?? ''
  );

  useEffect(() => {
    if (CurrencyCodeOne.current && currencyCodeQuery.data) {
      CurrencyCodeOne.current.value = currencyCodeQuery.data;
    }
  }, [currencyCodeQuery.data]);

  const calculate = async () => {
    const currency_code_one: string = CurrencyCodeOne.current?.value || '';
    const currency_code_two: string = CurrencyCodeTwo.current?.value || '';

    try {
      const data: number = await getResultRatesByBaseCode(
        currency_code_one,
        currency_code_two
      );
      const amount_one: number = parseFloat(ConvertOne.current?.value || '0');
      const convertedAmount: number = data * amount_one || 0;

      if (ConvertTwo.current && rateEl.current) {
        ConvertTwo.current.value = convertedAmount.toFixed(2);
        rateEl.current.innerText = `${amount_one} ${currency_code_one} = ${convertedAmount.toFixed(
          2
        )} ${currency_code_two}`;
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
