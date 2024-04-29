import axios from 'axios';

export interface CountryData {
  isoAlpha2: string;
  isoAlpha3: string;
  nameKorean: string;
  nameEnglish: string;
}

const APIKEY = process.env.REACT_APP_COUNTRY_CODE;

export const fetchAllCountries = async (): Promise<CountryData[]> => {
  try {
    const response = await axios.get(
      `https://api.odcloud.kr/api/15076566/v1/uddi:b003548e-3d28-42f4-8f82-e64766b055bc?page=1&perPage=237&serviceKey=${APIKEY}`
    );
    console.log(response.data.data);

    const countriesData: CountryData[] = response.data.data.map(
      (countryData: CountryData) => ({
        isoAlpha2: countryData.isoAlpha2,
        isoAlpha3: countryData.isoAlpha3,
        nameKorean: countryData.nameKorean,
        nameEnglish: countryData.nameEnglish,
      })
    );

    return countriesData;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
    throw error;
  }
};
