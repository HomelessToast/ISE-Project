#!/usr/bin/env node

/**
 * Simple test script for ISE service endpoints
 * Run with: node scripts/test-ise-service.js
 */

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`\n${method} ${endpoint}:`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));

    return { success: response.ok, data };
  } catch (error) {
    console.error(`\nError testing ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing BioCount ISE Service Endpoints\n');

  // Test health endpoint
  await testEndpoint('/api/ise/health');

  // Test diagnostics endpoint
  await testEndpoint('/api/ise/diagnostics');

  // Test compute endpoint with valid input
  const validInput = {
    dilutionDisplay: '1:1000',
    tou: {
      h0: 100,
      h10: 120,
      h20: 150,
      h24: 180
    },
    requiredDilutionSpec: '1:1000',
    fillWeight_g: 1.0
  };

  await testEndpoint('/api/ise/compute', 'POST', validInput);

  // Test compute endpoint with invalid input
  const invalidInput = {
    tou: {
      h0: -1,  // Invalid: negative value
      h10: 0,
      h20: 0,
      h24: 0
    },
    requiredDilutionSpec: '1:1000',
    fillWeight_g: 1.0
  };

  await testEndpoint('/api/ise/compute', 'POST', invalidInput);

  // Test batch endpoint
  const batchInput = [
    {
      dilutionDisplay: '1:1000',
      tou: { h0: 100, h10: 120, h20: 150, h24: 180 },
      requiredDilutionSpec: '1:1000',
      fillWeight_g: 1.0
    },
    {
      dilutionDisplay: '1:100',
      tou: { h0: 50, h10: 60, h20: 70, h24: 80 },
      requiredDilutionSpec: '1:100',
      fillWeight_g: 1.0
    }
  ];

  await testEndpoint('/api/ise/batch', 'POST', batchInput);

  console.log('\n✅ Test script completed!');
  console.log('\nTo run the full test suite:');
  console.log('  npm test');
  console.log('\nTo run ISE tests only:');
  console.log('  npm run test:ise');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/ise/health`);
    if (response.ok) {
      console.log('✅ Server is running at', BASE_URL);
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start it with:');
    console.error('  npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error);
