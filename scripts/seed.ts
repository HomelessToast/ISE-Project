import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.result.deleteMany();
  await prisma.assay.deleteMany();
  await prisma.sample.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'analyst@lab.com',
      name: 'Lab Analyst',
    },
  });

  console.log('👤 Created test user:', user.email);

  // Create samples based on manuscript examples
  const samples = [
    {
      code: 'SAMPLE-001',
      matrix: 'Ground Beef',
      testType: 'BACTERIA',
    },
    {
      code: 'SAMPLE-002',
      matrix: 'Chicken Breast',
      testType: 'BACTERIA',
    },
    {
      code: 'SAMPLE-003',
      matrix: 'Environmental Swab',
      testType: 'YEAST_MOLD',
    },
    {
      code: 'SAMPLE-004',
      matrix: 'Water Sample',
      testType: 'BACTERIA',
    },
    {
      code: 'SAMPLE-005',
      matrix: 'Spice Mix',
      testType: 'BACTERIA',
    },
    {
      code: 'SAMPLE-006',
      matrix: 'Dairy Product',
      testType: 'YEAST_MOLD',
    },
  ];

  const createdSamples = [];
  for (const sampleData of samples) {
    const sample = await prisma.sample.create({
      data: {
        ...sampleData,
        userId: user.id,
      },
    });
    createdSamples.push(sample);
    console.log(`📦 Created sample: ${sample.code}`);
  }

  // Create assays with realistic TOU data
  const assays = [
    {
      sampleId: createdSamples[0].id,
      dilution: 'ONE_TO_TEN',
      dilutionCoeff: 0.1,
      endAtHours: 24,
      touAt: JSON.stringify({
        '0': 150,
        '10': 180,
        '20': 230,
        'end': 260,
      }),
      notes: 'Standard 1:10 dilution - good growth curve',
    },
    {
      sampleId: createdSamples[1].id,
      dilution: 'ONE_TO_HUNDRED',
      dilutionCoeff: 0.01,
      endAtHours: 24,
      touAt: JSON.stringify({
        '0': 145,
        '10': 155,
        '20': 165,
        'end': 170,
      }),
      notes: '1:100 dilution - moderate growth',
    },
    {
      sampleId: createdSamples[2].id,
      dilution: 'NON_DISSOLVED_SWAB',
      dilutionCoeff: 1.0,
      endAtHours: 48,
      touAt: JSON.stringify({
        '0': 140,
        '20': 140,
        '40': 140,
        'end': 140,
      }),
      notes: 'Environmental swab - flatline, no growth detected',
    },
    {
      sampleId: createdSamples[3].id,
      dilution: 'AS_IS',
      dilutionCoeff: 1.0,
      endAtHours: 24,
      touAt: JSON.stringify({
        '0': 135,
        '10': 140,
        '20': 145,
        'end': 150,
      }),
      notes: 'Water sample - minimal growth',
    },
    {
      sampleId: createdSamples[4].id,
      dilution: 'ONE_TO_THOUSAND',
      dilutionCoeff: 0.001,
      endAtHours: 24,
      touAt: JSON.stringify({
        '0': 150,
        '10': 150,
        '20': 150,
        'end': 150,
      }),
      notes: 'High dilution - flatline, below detection limit',
    },
    {
      sampleId: createdSamples[5].id,
      dilution: 'ONE_TO_TEN',
      dilutionCoeff: 0.1,
      endAtHours: 48,
      touAt: JSON.stringify({
        '0': 130,
        '20': 160,
        '40': 200,
        'end': 220,
      }),
      notes: 'Yeast/mold sample - slower growth pattern',
    },
  ];

  const createdAssays = [];
  for (const assayData of assays) {
    const assay = await prisma.assay.create({
      data: {
        ...assayData,
        userId: user.id,
      },
    });
    createdAssays.push(assay);
    console.log(`🧪 Created assay for sample: ${createdSamples.find(s => s.id === assay.sampleId)?.code}`);
  }

  // Create results with calculated ISE values
  const results = [
    {
      assayId: createdAssays[0].id,
      cfuVial: 15,
      cfuPerG: 1500,
      logReported: 3.18,
      logIse: 3.18,
      logDiff: 0.0,
      qcNote: 'Within ±0.5 log of plate reference',
    },
    {
      assayId: createdAssays[1].id,
      cfuVial: 2,
      cfuPerG: 200,
      logReported: 2.30,
      logIse: 2.30,
      logDiff: 0.0,
      qcNote: 'Within ±0.5 log of plate reference',
    },
    {
      assayId: createdAssays[2].id,
      cfuVial: 1,
      cfuPerG: 1,
      logReported: null,
      logIse: 0.0,
      logDiff: null,
      qcNote: 'Flatline implies ≤ specification limit',
    },
    {
      assayId: createdAssays[3].id,
      cfuVial: 1,
      cfuPerG: 1,
      logReported: null,
      logIse: 0.0,
      logDiff: null,
      qcNote: 'Minimal growth detected',
    },
    {
      assayId: createdAssays[4].id,
      cfuVial: 1,
      cfuPerG: 1000,
      logReported: null,
      logIse: 3.0,
      logDiff: null,
      qcNote: 'Flatline implies ≤ specification limit',
    },
    {
      assayId: createdAssays[5].id,
      cfuVial: 8,
      cfuPerG: 80,
      logReported: null,
      logIse: 1.90,
      logDiff: null,
      qcNote: 'Yeast/mold growth pattern detected',
    },
  ];

  for (const resultData of results) {
    const result = await prisma.result.create({
      data: resultData,
    });
    console.log(`📊 Created result for assay: ${result.assayId}`);
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${createdSamples.length} samples, ${createdAssays.length} assays, and ${results.length} results`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
