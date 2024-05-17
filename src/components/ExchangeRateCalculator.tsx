import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  fetchUserCountry,
  fetchCurrencyCodes,
  getCurrencyCode,
} from '../api/Ipinfo';
import { useExchangeRates } from '../api/ExchangeRate';

export default function ExchangeRateCalculator() {
  const {
    data: userCountryData,
    isLoading: isUserCountryLoading,
    error: userCountryError,
  } = useQuery('userCountry', fetchUserCountry);

  const {
    data: exchangeRatesData,
    isLoading: isExchangeRatesLoading,
    error: exchangeRatesError,
  } = useExchangeRates();

  const {
    data: currencyCodes,
    isLoading: isCurrencyCodesLoading,
    error: currencyCodesError,
  } = useQuery('currencyCodes', fetchCurrencyCodes);

  function renderOptions() {
    return options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  }

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
      console.log('통화 코드 목록:', currencyCodes);
      setOptions(currencyCodes);
    }

    if (userCurrencyCode) {
      console.log('사용자 통화 코드:', userCurrencyCode);
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
    return <div>로딩 중...</div>;
  }

  if (userCountryError || exchangeRatesError || currencyCodesError) {
    return <div>에러 발생</div>;
  }

  return (
    <div>
      <label>금액</label>
      <select
        value={amountCurrency}
        onChange={(e) => setAmountCurrency(e.target.value)}
      >
        {renderOptions()}
      </select>
      <input
        value={amountValue}
        onChange={(e) => setAmountValue(e.target.value)}
        type='number'
      />
      <label>환전</label>
      <select
        value={exchangeCurrency}
        onChange={(e) => setExchangeCurrency(e.target.value)}
      >
        {renderOptions()}
      </select>
      <input
        value={exchangeValue}
        onChange={(e) => setExchangeValue(e.target.value)}
        type='number'
        readOnly
      />
      <button onClick={swapCurrencies}>swap</button>
    </div>
  );
}
