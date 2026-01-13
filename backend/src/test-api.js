const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testBackend() {
  console.log('🧪 Testing METEO Backend API...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log(`✅ Health check: ${healthResponse.data.status}`);
    console.log(`📅 Timestamp: ${healthResponse.data.timestamp}\n`);
    
    // Test 2: Current Weather (Single City)
    console.log('2️⃣ Testing current weather for "London"...');
    const currentWeather = await axios.get(`${API_BASE_URL}/weather/current`, {
      params: { city: 'London', units: 'metric' }
    });
    
    if (currentWeather.data.success) {
      console.log(`✅ Success! City: ${currentWeather.data.data.city.name}`);
      console.log(`🌡️ Temperature: ${currentWeather.data.data.weather.temperature.current}°C`);
      console.log(`🌤️ Condition: ${currentWeather.data.data.weather.description}`);
      console.log(`💨 Wind: ${currentWeather.data.data.weather.wind.speed} m/s\n`);
    } else {
      console.log(`❌ Failed: ${currentWeather.data.error}\n`);
    }
    
    // Test 3: Weather Forecast
    console.log('3️⃣ Testing 5-day forecast for "Paris"...');
    const forecast = await axios.get(`${API_BASE_URL}/weather/forecast`, {
      params: { city: 'Paris', units: 'metric' }
    });
    
    if (forecast.data.success) {
      console.log(`✅ Success! City: ${forecast.data.data.city.name}`);
      console.log(`📅 Forecast days: ${forecast.data.data.forecast.length}`);
      console.log(`🌡️ First day temp range: ${forecast.data.data.forecast[0].temperature.min}°C - ${forecast.data.data.forecast[0].temperature.max}°C\n`);
    } else {
      console.log(`❌ Failed: ${forecast.data.error}\n`);
    }
    
    // Test 4: Multiple Cities
    console.log('4️⃣ Testing multiple cities...');
    const multipleCities = await axios.post(`${API_BASE_URL}/weather/multiple`, {
      cities: ['Tokyo', 'New York', 'Dubai', 'Sydney'],
      units: 'metric'
    });
    
    if (multipleCities.data.success) {
      console.log(`✅ Success! Processed ${multipleCities.data.data.length} cities`);
      multipleCities.data.data.forEach((cityData, index) => {
        if (cityData.success !== false) {
          console.log(`   ${index + 1}. ${cityData.city.name}: ${cityData.weather.temperature.current}°C`);
        } else {
          console.log(`   ${index + 1}. ${cityData.city}: ${cityData.error}`);
        }
      });
      console.log('');
    } else {
      console.log(`❌ Failed: ${multipleCities.data.error}\n`);
    }
    
    // Test 5: Invalid City (Error handling)
    console.log('5️⃣ Testing error handling with invalid city...');
    try {
      const invalidCity = await axios.get(`${API_BASE_URL}/weather/current`, {
        params: { city: 'InvalidCityName12345' }
      });
      console.log(`❌ Should have failed but didn't: ${invalidCity.data}\n`);
    } catch (error) {
      if (error.response) {
        console.log(`✅ Properly handled invalid city: ${error.response.data.error}\n`);
      }
    }
    
    // Test 6: Missing parameter
    console.log('6️⃣ Testing missing parameter validation...');
    try {
      await axios.get(`${API_BASE_URL}/weather/current`);
    } catch (error) {
      if (error.response) {
        console.log(`✅ Proper validation: ${error.response.data.errors[0].msg}\n`);
      }
    }
    
    console.log('🎉 All tests completed!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Make sure the server is running on port 3001.');
      console.log('   Run: npm run dev');
    } else if (error.response) {
      console.error(`❌ API Error (${error.response.status}):`, error.response.data);
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:3001/health', { timeout: 1000 });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if server is running...');
  const isRunning = await checkServer();
  
  if (!isRunning) {
    console.log('🚫 Server not running on port 3001.');
    console.log('\n📋 To start the server:');
    console.log('   1. Make sure you have all the files in place');
    console.log('   2. Run: npm run dev');
    console.log('   3. Then run this test script again');
    return;
  }
  
  await testBackend();
}

main();