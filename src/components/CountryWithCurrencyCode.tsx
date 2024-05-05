import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { IpInfoData, fetchUserCountry, getCurrencyCode } from '../api/Ipinfo';
import { getResultRatesByBaseCode } from '../api/ExchangeRate';

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
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const userCountryQuery = useUserCountry();
  const currencyCodeQuery = useCurrencyCode(
    userCountryQuery.data?.country ?? ''
  );

  useEffect(() => {
    if (CurrencyCodeOne.current && currencyCodeQuery.data) {
      CurrencyCodeOne.current.value = currencyCodeQuery.data;
    }
  }, [currencyCodeQuery.data]);

  const calculateAndUpdate = async () => {
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
        setConvertedAmount(convertedAmount);
      }
    } catch (error) {
      throw new Error('에러 발생');
    }
  };

  useEffect(() => {
    calculateAndUpdate();
  }, [ConvertOne.current?.value, CurrencyCodeTwo.current?.value]);

  const handleConvertTwoChange = async () => {
    const currency_code_one: string = CurrencyCodeOne.current?.value || '';
    const currency_code_two: string = CurrencyCodeTwo.current?.value || '';

    try {
      const data: number = await getResultRatesByBaseCode(
        currency_code_two,
        currency_code_one
      );
      const amount_two: number = parseFloat(ConvertTwo.current?.value || '0');
      const convertedAmount: number = amount_two / data || 0;

      if (ConvertOne.current && rateEl.current) {
        ConvertOne.current.value = convertedAmount.toFixed(2);
        rateEl.current.innerText = `${amount_two} ${currency_code_two} = ${convertedAmount.toFixed(
          2
        )} ${currency_code_one}`;
        setConvertedAmount(convertedAmount);
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
        <input type='number' ref={ConvertOne} onChange={calculateAndUpdate} />
      </div>
      <div>
        <label htmlFor='CurrencyCodeTwo'>Currency 2:</label>
        <select
          id='CurrencyCodeTwo'
          ref={CurrencyCodeTwo}
          onChange={handleConvertTwoChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type='number' ref={ConvertTwo} readOnly />
      </div>
      <p ref={rateEl}></p>
    </div>
  );
};

export default ExchangeRateCalculator;
