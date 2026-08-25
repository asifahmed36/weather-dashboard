import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results) throw new Error("City not found");

      const { latitude, longitude, name } = geoData.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      );
      const weatherData = await weatherRes.json();

      setWeather({ ...weatherData.current_weather, name });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Weather Forecast
        </h1>

        <div className="flex gap-2">
          <input
            className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter city name..."
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            onClick={fetchWeather}
          >
            Search
          </button>
        </div>

        {loading && <p className="mt-5 text-gray-600">Loading...</p>}
        {error && <p className="mt-5 text-red-500 font-semibold">{error}</p>}

        {weather && !loading && (
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-900">{weather.name}</h2>
            <p className="text-6xl font-extrabold text-blue-600 my-4">
              {weather.temperature}°C
            </p>
            <div className="flex justify-around text-gray-700 font-medium">
              <p>Wind: {weather.windspeed} km/h</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
