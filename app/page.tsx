import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
        {/* Dotted background overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(100,116,139,0.25) 1px, transparent 0)',
            backgroundSize: '20px 20px',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 55%, rgba(0,0,0,0))',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 55%, rgba(0,0,0,0))',
          }}
        />
        <div className="mx-auto max-w-7xl px-3 sm:px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                BioCount.io
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
                Advanced CO₂-based rapid microbiological enumeration using the validated ISE method. Transform your Soleris Fusion TOU data into accurate cfu/g results in seconds, not days.
              </p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-4 text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    Start Analysis
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
                <img src="/Screenshot 2025-09-04 125655.png" alt="BioCount.io interface preview" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider between hero and next section */}
      <section className="relative h-12 -mt-4 sm:-mt-6">
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-slate-300/50 via-slate-200/30 to-transparent"></div>
      </section>

      {/* Removed separate interface preview; integrated into hero */}

      {/* Key Benefits */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose BioCount.io?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Industry-leading accuracy with breakthrough speed for microbiological enumeration
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-slate-900">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Results in 24 hours for bacteria, 48 hours for yeast/mold. 
                  Eliminate the 5-7 day wait for traditional plating methods.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-slate-900">Lab-Grade Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  ±0.5 log agreement with plate counts. R² correlation of 0.9146 
                  validates our method against industry standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-slate-900">Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  AI-powered growth phase detection. Automatic identification of lag, 
                  exponential, and stationary phases from TOU curves.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How BioCount.io Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four simple steps from TOU data to accurate cfu/g results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Data Collection
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Import TOU readings from your Soleris Fusion system at specified time points
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Phase Detection
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Our algorithm automatically identifies growth phases from the sigmoidal curve
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                CFU Calculation
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Apply validated TOU/CFU ratios for each growth phase to calculate cfu per vial
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Final Results
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Apply dilution coefficients to report final cfu/g values for your sample
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built on validated science with industry-leading performance metrics
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Enumeration Range</h3>
                  <p className="text-slate-600">1 cfu/g to 4.5 million cfu/g for both Total Aerobic and Yeast/Mold counts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Assay Duration</h3>
                  <p className="text-slate-600">24 hours for aerobic bacteria, 48 hours for yeast/mold</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Validation Results</h3>
                  <p className="text-slate-600">±0.5 log difference threshold with R² correlation of 0.9146</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a1 1 0 01-1.57-.317l-.525-1.591a1 1 0 00-1.374-.374l-1.591.525a1 1 0 01-1.317-1.57l.158-.318a6 6 0 00.517-3.86l-.477-2.387a2 2 0 00-.547-1.022l-1.591-.525a1 1 0 010-1.902l1.591-.525a2 2 0 00.547-1.022l.477-2.387a6 6 0 00-.517-3.86l-.158-.318a1 1 0 011.57-1.317l.525-1.591a1 1 0 00.374-1.374l-1.591-.525a1 1 0 010-1.902l1.591.525a1 1 0 00.374 1.374l.525 1.591a1 1 0 001.317 1.57l.318.158a6 6 0 003.86-.517l2.387-.477a2 2 0 001.022-.547l1.591-.525a1 1 0 011.902 0l1.591.525a2 2 0 00.547 1.022l.477 2.387a6 6 0 00.517 3.86l.158.318a1 1 0 001.57 1.317l1.591-.525a1 1 0 001.374.374l.525 1.591a1 1 0 001.317 1.57l-.158.318a6 6 0 00.517 3.86l.477 2.387a2 2 0 00.547 1.022l1.591.525a1 1 0 010 1.902l-1.591.525a2 2 0 00-.547 1.022l-.477 2.387a6 6 0 00-.517 3.86l-.158.318a1 1 0 01-1.57 1.317l-1.591-.525a1 1 0 00-1.374-.374l-.525-1.591a1 1 0 00-1.317-1.57l.158-.318a6 6 0 00-.517-3.86l-.477-2.387a2 2 0 00-.547-1.022l-1.591-.525a1 1 0 010-1.902z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Growth Phase Analysis</h3>
                  <p className="text-slate-600">Automatic detection of lag, exponential, and stationary phases with dynamic TOU/CFU ratios</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-Time Monitoring</h3>
                  <p className="text-slate-600">Preliminary counts during assay with immediate resolution of presumptive failures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Comprehensive Reporting</h3>
                  <p className="text-slate-600">Export results to PDF/CSV with detailed growth curve analysis and QC notes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Microbiology Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join leading laboratories using BioCount.ai to achieve faster, more accurate results 
            while reducing costs and improving efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Free Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
