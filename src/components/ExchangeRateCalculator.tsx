import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  fetchUserCountry,
  fetchCurrencyCodes,
  getCurrencyCode,
} from '../api/Ipinfo';
import { fetchExchangeRates, useExchangeRates } from '../api/ExchangeRate';
import './styles.css';

export default function ExchangeRateCalculator() {
  const [isPaused, setIsPaused] = useState(false);
  const {
    data: userCountryData,
    isLoading: isUserCountryLoading,
    error: userCountryError,
  } = useQuery('userCountry', fetchUserCountry, { enabled: !isPaused });

  const {
    data: exchangeRatesData,
    isLoading: isExchangeRatesLoading,
    error: exchangeRatesError,
  } = useQuery('exchangeRates', fetchExchangeRates, { enabled: !isPaused });

  const {
    data: currencyCodes,
    isLoading: isCurrencyCodesLoading,
    error: currencyCodesError,
  } = useQuery('currencyCodes', fetchCurrencyCodes, { enabled: !isPaused });

  const [options, setOptions] = useState<string[]>([]);
  const [amountValue, setAmountValue] = useState('');
  const [exchangeValue, setExchangeValue] = useState('');
  const [amountCurrency, setAmountCurrency] = useState('USD');
  const [exchangeCurrency, setExchangeCurrency] = useState('USD');

  const { data: userCurrencyCode, isLoading: isUserCurrencyLoading } = useQuery(
    ['currencyCode', userCountryData?.country],
    () => getCurrencyCode(userCountryData?.country),
    { enabled: !!userCountryData?.country }
  );

  useEffect(() => {
    if (currencyCodes) {
      setOptions(currencyCodes);
    }

    if (userCurrencyCode) {
      setAmountCurrency(userCurrencyCode);
    }
  }, [currencyCodes, userCurrencyCode]);

  const calculateExchange = () => {
    if (amountValue && exchangeRatesData) {
      const amount = parseFloat(amountValue);
      const rate =
        exchangeRatesData.rates[exchangeCurrency] /
        exchangeRatesData.rates[amountCurrency];
      const convertedAmount = amount * rate;
      setExchangeValue(convertedAmount.toFixed(2));
    }
  };

  useEffect(() => {
    calculateExchange();
  }, [amountValue, amountCurrency, exchangeCurrency, exchangeRatesData]);

  const swapCurrencies = () => {
    const tempCurrency = amountCurrency;
    setAmountCurrency(exchangeCurrency);
    setExchangeCurrency(tempCurrency);
    calculateExchange();
  };

  if (
    isUserCountryLoading ||
    isExchangeRatesLoading ||
    isCurrencyCodesLoading ||
    isUserCurrencyLoading
  ) {
    return <div className='loading'>로딩 중...</div>;
  }

  if (userCountryError || exchangeRatesError || currencyCodesError) {
    return <div className='error'>에러 발생</div>;
  }

  return (
    <div className='container'>
      <div className='wrapper'>
        <h1>Exchange Rate Calculator</h1>
        <div className='input-wrap'>
          <div className='input-row'>
            <label className='label'>금액</label>
            <div className='input-group'>
              <select
                className='select'
                value={amountCurrency}
                onChange={(e) => setAmountCurrency(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                className='input'
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                type='number'
              />
            </div>
          </div>

          <div className='input-row'>
            <label className='label'>환전</label>
            <div className='input-group'>
              <select
                className='select'
                value={exchangeCurrency}
                onChange={(e) => setExchangeCurrency(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                className='input'
                value={exchangeValue}
                onChange={(e) => setExchangeValue(e.target.value)}
                type='number'
              />
            </div>
          </div>
        </div>

        <button className='button' onClick={swapCurrencies}>
          swap
        </button>
      </div>
    </div>
  );
}
