'use client';

import { useState, useEffect } from 'react';
import { weatherIconMap } from '@/config/WeatherIcons';
import { TiWeatherPartlySunny } from "react-icons/ti";
import { MainCardLoading } from './common/MainCard';

interface WeatherData {
  name: string;
  weather: { main: string }[];
  main: { temp: number };
}

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보가 지원되지 않는 브라우저입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  }, []);

  const onGeoSuccess = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

    fetch(url)
      .then((response) => response.json())
      .then((data: WeatherData) => {
        setWeatherData(data);
      })
      .catch((err) => {
        console.error('날씨 정보를 가져오는 중 오류 발생:', err);
        setError('날씨 정보를 가져오는 중 오류가 발생했습니다.');
      });
  };

  const onGeoError = () => {
    setError('위치 정보를 가져올 수 없습니다.');
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!weatherData) {
    return <MainCardLoading context="날씨 데이터를 불러오는 중입니다..." />;
  }

  const weatherCondition = weatherData.weather[0].main.toLowerCase();
  const WeatherIcon =
    weatherIconMap[weatherCondition] || weatherIconMap['default'];

  return (
    <>
      <div className="text-7xl m-2">
        <WeatherIcon />
      </div>
      <div className='ml-2 sm:ml-4'>
        <h2 className="text-2xl font-bold mb-2">현재 위치의 날씨</h2>
        <p className="text-xl">
          위치: {weatherData.name}
        </p>
        <p className="text-xl">
          날씨: {weatherData.weather[0].main} / 온도: {weatherData.main.temp}°C
        </p>
      </div>
    </>
  );
}