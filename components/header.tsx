'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="mx-auto px-4 sm:px-6">
        <div className="relative flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/Logo%20GPT.png" alt="BioCount logo" className="h-10 sm:h-12 w-auto" />
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                BioCount.io
              </span>
            </Link>
          </div>

          {/* Centered Schedule Demo button */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="mailto:sales@biocount.ai?subject=Schedule%20a%20Demo"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Schedule Demo
              </a>
              <Link
                href="/login"
                className="inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
              >
                Log In
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/reports" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                Research Reports
              </Link>
              <a href="mailto:info@biocount.ai" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
