const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API connection...\n');
  
  const apiKey = 'AIzaSyBdKll75MZ6sbjhG3n0_hW9vnAabQzcSwA';
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env.local');
    process.exit(1);
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('\n📡 Listing available models...');
    const models = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash-latest', 'gemini-pro-vision'];
    
    for (const modelName of models) {
      try {
        console.log(`\n🧪 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello from Gemini!" in a friendly way.');
        const response = result.response;
        const text = response.text();
        
        console.log('\n✅ SUCCESS! Gemini API is working!\n');
        console.log(`📝 Working Model: ${modelName}`);
        console.log('📝 Response:', text);
        console.log('\n🎉 Your Gemini API key is valid and ready to use!');
        break;
      } catch (modelError) {
        console.log(`   ❌ ${modelName}: ${modelError.message.split('\n')[0]}`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('\n💡 Your API key appears to be invalid. Please check:');
      console.error('   1. Visit https://aistudio.google.com/app/apikey');
      console.error('   2. Create a new API key');
      console.error('   3. Update GEMINI_API_KEY in .env.local');
    }
    process.exit(1);
  }
}

testGeminiAPI();
