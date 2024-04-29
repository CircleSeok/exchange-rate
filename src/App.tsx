import React from 'react';
import logo from './logo.svg';
import './App.css';
import useIpinfo from './api/Ipinfo';

function App() {
  const { data, isLoading, isError } = useIpinfo();

  if (isLoading) return <div>로딩</div>;
  if (isError) return <div>에러</div>;
  if (!data) return <div>데이터없음</div>;

  return (
    <>
      <h1>IP Information</h1>
      <p>IP: {data.ip}</p>
      <p>Country: {data.country}</p>
    </>
  );
}

export default App;
