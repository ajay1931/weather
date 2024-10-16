import React, { useState, useEffect } from 'react';
import './MonthlyContent.css';
import { Element } from 'react-scroll';

const MonthlyContent = ({ location }) => {
  const [monthlyWeather, setMonthlyWeather] = useState([]);
  const apiKey = '885e5a63877a215f293e713a946e66db';

  useEffect(() => {
    const fetchMonthlyWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();
        const groupedByMonth = data.list.reduce((acc, entry) => {
          const date = new Date(entry.dt_txt);
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

          if (!acc[monthYear]) {
            acc[monthYear] = { temp: 0, count: 0, description: entry.weather[0].description };
          }
          acc[monthYear].temp += entry.main.temp;
          acc[monthYear].count += 1;
          acc[monthYear].description = entry.weather[0].description;
          return acc;
        }, {});

        const now = new Date();
        const currentMonthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;
        const nextMonthYear = getNextMonth(now);

        const monthlyData = [
          { monthYear: currentMonthYear, temp: 0, description: '' },
          { monthYear: nextMonthYear, temp: 0, description: '' }
        ];

        monthlyData.forEach(month => {
          if (groupedByMonth[month.monthYear]) {
            month.temp = (groupedByMonth[month.monthYear].temp / groupedByMonth[month.monthYear].count).toFixed(1);
            month.description = groupedByMonth[month.monthYear].description;
          }
        });

        setMonthlyWeather(monthlyData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setMonthlyWeather([]);
      }
    };

    if (location) {
      fetchMonthlyWeather();
    }
  }, [location]);

  const getNextMonth = (date) => {
    const nextDate = new Date(date);
    nextDate.setMonth(date.getMonth() + 1);
    return `${nextDate.getMonth() + 1}-${nextDate.getFullYear()}`;
  };

  return (
    <div>
      <Element name='monthly' className='monthlyContent'>
        <h1>Monthly Weather in {location}</h1>
        <div className='monthlyContent_weather'>
          {monthlyWeather.length > 0 ? (
            monthlyWeather.map((month, index) => (
              <div key={index} className='month'>
                <p>{month.monthYear}</p>
                <p>{month.temp} °C</p>
                <p>{month.description}</p>
              </div>
            ))
          ) : (
            <p>Select your location...</p>
          )}
        </div>
      </Element>
    </div>
  );
};

export default MonthlyContent;
