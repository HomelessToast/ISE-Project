// Simple test script for the ISE engine
const { compute } = require('./compute');

// Test inputs with all the required values
const testInputs = {
  // Core inputs
  'Sheet1!J11': 1.0,      // Fill weight
  'Sheet1!C18': 0.001,    // Dilution coefficient
  'Sheet1!D18': 100,      // TOU h0
  'Sheet1!D19': 120,      // TOU h10
  'Sheet1!D20': 150,      // TOU h20
  'Sheet1!D21': 180,      // TOU h24
  
  // Constants
  'Sheet1!H3': 0.5,
  'Sheet1!I3': 1.0,
  'Sheet1!K4': 1.0,
  'Sheet1!L4': 1.0,
  'Sheet1!I4': 1.0,
  'Sheet1!$N$14': 100,
  'Sheet1!$O$14': 1.0,
  
  // Statistical function results
  'Sheet1!H4': 0.8305400372439479,
  'Sheet1!H5': 0.1336126629422719,
  'Sheet1!H6': 0.9168833084425762,
  
  // Additional required inputs
  'Sheet1!B6': 0.5,
  'Sheet1!D6': 0.5,
  'Sheet1!B18': 0.001,
  'Sheet1!$B$18': 0.001,
  'Sheet1!$C$18': 0.001,
  'Sheet1!$D$18': 100,
  'Sheet1!$D$19': 120,
  'Sheet1!$D$20': 150,
  'Sheet1!$D$21': 180,
  'Sheet1!$C$35': 1,
  'Sheet1!$I$4': 1.0,
  'Sheet1!$L$4': 1.0,
  'Sheet1!$K$4': 1.0,
  
  // N10 input (would normally be calculated)
  'Sheet1!N10': 0.018585262285743878,
  
  // Additional cells
  'Sheet1!J23': 1.0,
  'Sheet1!J24': 1.0,
  'Sheet1!J25': 1.0,
  'Sheet1!J26': 1.0,
  'Sheet1!O28': 1.0,
  'Sheet1!O29': 1.0,
  'Sheet1!O30': 1.0,
  'Sheet1!O31': 1.0,
  'Sheet1!O32': 1.0,
  'Sheet1!O33': 1.0,
  
  // Statistical calculation inputs
  'Sheet1!B3': 0.125,
  'Sheet1!B4': 0.25,
  'Sheet1!B5': 0.5,
  'Sheet1!B6': 0.5,
  'Sheet1!B7': 0.5,
  'Sheet1!B8': 0.5,
  'Sheet1!B9': 1.0,
  'Sheet1!C3': 0.0625,
  'Sheet1!C4': 0.125,
  'Sheet1!C5': 0.25,
  'Sheet1!C6': 0.5,
  'Sheet1!C7': 0.5,
  'Sheet1!C8': 0.5,
  'Sheet1!C9': 1.0,
  'Sheet1!D3': 0.0625,
  'Sheet1!D4': 0.125,
  'Sheet1!D5': 0.25,
  'Sheet1!D6': 0.5,
  'Sheet1!D7': 0.5,
  'Sheet1!D8': 0.5,
  'Sheet1!D9': 1.0,
  'Sheet1!A3': 0.125,
  'Sheet1!A4': 0.25,
  'Sheet1!A5': 0.5,
  'Sheet1!A6': 1.0,
  'Sheet1!A7': 1.0,
  'Sheet1!A8': 1.0,
  'Sheet1!A9': 2.0,
};

console.log('Testing ISE Engine...');
console.log('Inputs:', testInputs);

try {
  const result = compute(testInputs);
  
  console.log('\n=== Key Results ===');
  console.log('K15 (cfu/g):', result['Sheet1!K15']);
  console.log('P10 (exponent):', result['Sheet1!P10']);
  console.log('I15 (average):', result['Sheet1!I15']);
  console.log('J15 (I15*C18):', result['Sheet1!J15']);
  
  console.log('\n=== Intermediate Values ===');
  console.log('E12:', result['Sheet1!E12']);
  console.log('K23:', result['Sheet1!K23']);
  console.log('L23:', result['Sheet1!L23']);
  console.log('L24:', result['Sheet1!L24']);
  console.log('L25:', result['Sheet1!L25']);
  console.log('L26:', result['Sheet1!L26']);
  console.log('K28:', result['Sheet1!K28']);
  console.log('J30:', result['Sheet1!J30']);
  console.log('N10:', result['Sheet1!N10']);
  console.log('O10:', result['Sheet1!O10']);
  console.log('M10:', result['Sheet1!M10']);
  
  if (typeof result['Sheet1!K15'] === 'number' && !isNaN(result['Sheet1!K15'])) {
    console.log('\n✅ SUCCESS: K15 calculated successfully!');
  } else {
    console.log('\n❌ FAILED: K15 is', result['Sheet1!K15']);
  }
  
} catch (error) {
  console.error('Engine test failed:', error.message);
  console.error('Stack:', error.stack);
}
