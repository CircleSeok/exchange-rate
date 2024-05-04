import { useQuery } from 'react-query';
import axios from 'axios';

export interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
}

export const fetchExchangeRates = async (): Promise<ExchangeRateResponse> => {
  const APIKEY = process.env.REACT_APP_EXCHANGERATE;
  const url = `https://openexchangerates.org/api/latest.json?app_id=${APIKEY}`;

  try {
    const response = await axios.get(url);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error('에러 발생');
  }
};

export const useExchangeRates = () => {
  return useQuery<ExchangeRateResponse>('exchangeRates', fetchExchangeRates);
};
// import axios from 'axios';

export interface ExchangeRateData {
  rates: Record<string, number>;
}

export const getResultRatesByBaseCode = async (
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
    throw new Error('Unable to get the rate');
  }
};

// // Calculating currencies
// const calculate = async () => {
//   const currency_one: string = currencyEl_one.value;
//   const currency_two: string = currencyEl_two.value;

//   try {
//     const data: number = await getResultRatesByBaseCode(
//       currency_one,
//       currency_two
//     );
//     const amount_one: number = parseFloat(amountEl_one.value);
//     const convertedAmount: number = data * amount_one || 0;

//     amountEl_two.value = convertedAmount.toFixed(4).toString();
//     rateEl.innerText = `${amount_one} ${currency_one} = ${convertedAmount.toFixed(
//       4
//     )} ${currency_two}`;
//   } catch (error) {
//     console.error('Error occurred while calculating currencies:', error);
//   }
// };
