const axios = require('axios');

async function testExtraction() {
  console.log('\nTesting /api/extract with MORE LOGGING...');
  const transcript = "Doctor: Hello Ramesh, how are you? Patient: I have a fever for 4 days. Doctor: Okay, so if you have a fever, I suggest paracetamol now, after lunch. Take it for 5 days.";
  const patientId = "P12345";

  try {
    const response = await axios.post('http://localhost:3000/api/extract', {
      transcript,
      patientId
    });
    console.log('Status:', response.status);
    console.log('Extraction Result:', JSON.stringify(response.data, null, 2));
    
    const meds = response.data.medications;
    if (meds && meds.length > 0) {
      console.log('\n✅ Medications extracted:');
      meds.forEach(m => {
        console.log(`- ${m.name} | Timing: ${m.timing || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('Detailed Error:');
    if (error.response) {
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testExtraction();
