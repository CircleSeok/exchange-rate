import React from 'react';
import { useUserCountry, useCurrencyCode } from '../api/Ipinfo';

const CountryWithCurrencyCode = () => {
  const {
    data: userCountry,
    isLoading: isUserCountryLoading,
    isError: isUserCountryError,
  } = useUserCountry();

  const {
    data: currencyCode,
    isLoading: isCurrencyCodeLoading,
    isError: isCurrencyCodeError,
  } = useCurrencyCode(userCountry);

  if (isUserCountryLoading || isCurrencyCodeLoading) {
    return <div>Loading...</div>;
  }

  if (isUserCountryError || isCurrencyCodeError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      <p>사용자 접속 국가: {userCountry}</p>
      <p>접속 국가 통화 코드: {currencyCode}</p>
    </div>
  );
};

export default CountryWithCurrencyCode;
