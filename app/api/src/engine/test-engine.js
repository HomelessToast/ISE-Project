// Simple test script for the ISE engine
const { compute } = require('./compute');

// Test inputs (similar to the golden cases)
const testInputs = {
  // Fill weight (g) - maps to Sheet1!J11
  'Sheet1!J11': 1.0,
  
  // Dilution coefficient - maps to Sheet1!C18
  'Sheet1!C18': 0.001, // 1:1000
  
  // TOU values - maps to Sheet1!D18, D19, D20, D21
  'Sheet1!D18': 100,  // h0
  'Sheet1!D19': 120,  // h10
  'Sheet1!D20': 150,  // h20
  'Sheet1!D21': 180,  // h24
  
  // Required dilution spec - maps to Sheet1!C35
  'Sheet1!C35': 1,
  
  // Constants from Excel
  'Sheet1!H3': 0.5,
  'Sheet1!I3': 1.0,
  'Sheet1!K4': 1.0,
  'Sheet1!L4': 1.0,
  'Sheet1!I4': 1.0,
  'Sheet1!$N$14': 100,
  'Sheet1!$O$14': 1.0,
};

console.log('Testing ISE Engine...');
console.log('Inputs:', testInputs);

try {
  const result = compute(testInputs);
  
  console.log('\n=== Engine Test Results ===');
  console.log('K15 (cfu/g):', result['Sheet1!K15']);
  console.log('P10 (exponent):', result['Sheet1!P10']);
  console.log('I15 (average):', result['Sheet1!I15']);
  console.log('J15 (I15*C18):', result['Sheet1!J15']);
  
  console.log('\n=== Key Intermediate Values ===');
  console.log('D18 (TOU h0):', result['Sheet1!D18']);
  console.log('D19 (TOU h10):', result['Sheet1!D19']);
  console.log('D20 (TOU h20):', result['Sheet1!D20']);
  console.log('D21 (TOU h24):', result['Sheet1!D21']);
  console.log('C18 (dilution):', result['Sheet1!C18']);
  console.log('J11 (fill weight):', result['Sheet1!J11']);
  
  console.log('\n=== Engine Test PASSED ===');
  
} catch (error) {
  console.error('Engine test FAILED:', error.message);
  console.error('Stack:', error.stack);
}
