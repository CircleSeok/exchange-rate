import axios from 'axios';

export interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
}

export async function fetchExchangeRates(): Promise<ExchangeRateResponse> {
  const APIKEY = process.env.REACT_APP_EXCHANGERATE;
  const url = `https://openexchangerates.org/api/latest.json?app_id=${APIKEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('환율 데이터를 가져오는 중 오류가 발생했습니다.', error);
    throw error;
  }
}
