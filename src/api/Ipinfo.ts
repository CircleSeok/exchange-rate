import axios from 'axios';
import { useQuery } from 'react-query';

export interface IpInfoData {
  ip: string;
  country: string;
}

const fetchIpinfo = async () => {
  const APIKEY = process.env.REACT_APP_IPINFO;
  const ipInfoResponse = await axios.get(
    `https://ipinfo.io/json?token=${APIKEY}`
  );
  return ipInfoResponse.data;
};

const useIpinfo = () => {
  return useQuery<IpInfoData>('ipinfo', fetchIpinfo);
};

export default useIpinfo;

// const APIKEY = process.env.REACT_APP_IPINFO;
// export const fetchIpinfo = async (): Promise<IpInfoData> => {
//   try {
//     const ipInfoResponse = await axios.get(
//       `https://ipinfo.io/json?token=${APIKEY}`
//     );
//     console.log('ipInfoResponse:', ipInfoResponse.data);
//     const ip = ipInfoResponse.data.ip;
//     const userCountry = ipInfoResponse.data.country;
//     return { ip, country: userCountry };
//   } catch (error) {
//     console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
//     throw error;
//   }
// };
