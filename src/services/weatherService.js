// Weather Service for Agricultural Districts

const DISTRICT_WEATHER_DATA = {
  Jalgaon: { temp: 31, condition: "Partly Cloudy", humidity: 72, rainProb: 25, windSpeed: "12 km/h", advice: "Ideal day for foliar fungicide application. Monitor humidity levels." },
  Nashik: { temp: 27, condition: "Light Rain Showers", humidity: 85, rainProb: 65, windSpeed: "18 km/h", advice: "Avoid open spraying today due to rain. Ensure field drainage." },
  Pune: { temp: 28, condition: "Sunny with Breeze", humidity: 60, rainProb: 15, windSpeed: "10 km/h", advice: "Good conditions for sugarcane drip fertigation and weeding." },
  Ahmednagar: { temp: 32, condition: "Clear Sky", humidity: 55, rainProb: 10, windSpeed: "14 km/h", advice: "Maintain soil moisture in onion beds to prevent heat stress." },
  Nagpur: { temp: 34, condition: "Humid & Warm", humidity: 78, rainProb: 40, windSpeed: "8 km/h", advice: "High humidity risk for bollworm buildup in cotton. Inspect bolls." }
};

export const fetchDistrictWeather = async (districtName = "Jalgaon") => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== "your_openweather_key") {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${districtName},IN&units=metric&appid=${apiKey}`
      );
      if (response.ok) {
        const data = await response.json();
        return {
          district: districtName,
          temp: Math.round(data.main.temp),
          condition: data.weather[0]?.main || "Clear",
          humidity: data.main.humidity,
          rainProb: data.clouds?.all > 60 ? 60 : 15,
          windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
          advice: "Live OpenWeather data retrieved. Maintain proper crop irrigation schedule.",
          isLive: true
        };
      }
    } catch (err) {
      console.warn("Weather API fetch failed, using fallback agricultural weather data", err);
    }
  }

  // Fallback agricultural data
  const fallback = DISTRICT_WEATHER_DATA[districtName] || DISTRICT_WEATHER_DATA["Jalgaon"];
  return {
    district: districtName,
    ...fallback,
    isLive: false
  };
};
