import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            ConfidentKids
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-[700px]">
            A research-backed approach to raising confident, resilient children
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-indigo-600 shadow transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Get Started
            </Link>
            <Link 
              href="/about" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-white px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The 5 Pillars of Confidence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="flex flex-col p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Independence & Problem-Solving</h3>
              <p className="text-gray-600 mb-4">The "Ask, Don't Tell" Method</p>
              <p className="text-gray-700 flex-grow">
                Help your child develop self-trust by encouraging them to make decisions and solve problems on their own.
              </p>
              <Link 
                href="/pillars/independence" 
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn techniques →
              </Link>
            </div>
            
            {/* Pillar 2 */}
            <div className="flex flex-col p-6 bg-purple-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Growth Mindset & Resilience</h3>
              <p className="text-gray-600 mb-4">The "Yet" Technique</p>
              <p className="text-gray-700 flex-grow">
                Teach your child to embrace challenges and push through failure with a growth mindset approach.
              </p>
              <Link 
                href="/pillars/growth-mindset" 
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn techniques →
              </Link>
            </div>
            
            {/* Pillar 3 */}
            <div className="flex flex-col p-6 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Social Confidence & Communication</h3>
              <p className="text-gray-600 mb-4">The "Conversation Challenge"</p>
              <p className="text-gray-700 flex-grow">
                Build your child's social confidence through practicing conversation skills in safe settings.
              </p>
              <Link 
                href="/pillars/social-confidence" 
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn techniques →
              </Link>
            </div>
            
            {/* Pillar 4 */}
            <div className="flex flex-col p-6 bg-yellow-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Purpose & Strength Discovery</h3>
              <p className="text-gray-600 mb-4">The "Strength Journal" Exercise</p>
              <p className="text-gray-700 flex-grow">
                Help your child discover their unique strengths and develop a sense of purpose.
              </p>
              <Link 
                href="/pillars/strength-discovery" 
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn techniques →
              </Link>
            </div>
            
            {/* Pillar 5 */}
            <div className="flex flex-col p-6 bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Managing Fear & Anxiety</h3>
              <p className="text-gray-600 mb-4">The "Reframe the Fear" Technique</p>
              <p className="text-gray-700 flex-grow">
                Teach your child how to manage fear and anxiety so they can take action despite feeling scared.
              </p>
              <Link 
                href="/pillars/managing-fear" 
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn techniques →
              </Link>
            </div>
            
            {/* How It Works */}
            <div className="flex flex-col p-6 bg-indigo-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">How It Works</h3>
              <p className="text-gray-600 mb-4">Your Confidence Building Journey</p>
              <p className="text-gray-700 flex-grow">
                Learn how to implement these techniques with our structured approach and personalized guidance.
              </p>
              <Link 
                href="/how-it-works" 
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                See the process →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features for Parents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Dashboard</h3>
              <p className="text-gray-600">
                Track your child's progress across all 5 pillars with customized recommendations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Daily Guidance</h3>
              <p className="text-gray-600">
                Get daily confidence-building activities and parent scripts for challenging situations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Connect with other parents and access expert advice in our moderated forums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-[700px] mx-auto">
            Choose the plan that works best for your family
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="flex flex-col p-6 bg-white border rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
              <div className="text-4xl font-bold mb-2">$9.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-gray-600 mb-6">Or $99/year (save 17%)</p>
              
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to all 5 pillars content
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Single child profile
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic progress tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Core activity library
                </li>
              </ul>
              
              <Link 
                href="/signup?plan=basic" 
                className="inline-flex h-12 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
            
            {/* Family Plan */}
            <div className="flex flex-col p-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Family Plan</h3>
              <div className="text-4xl font-bold mb-2">$14.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-gray-600 mb-6">Or $149/year (save 17%)</p>
              
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Multiple child profiles (up to 3)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced progress tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Full activity library
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic community access
                </li>
              </ul>
              
              <Link 
                href="/signup?plan=family" 
                className="inline-flex h-12 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
            
            {/* Premium Plan */}
            <div className="flex flex-col p-6 bg-white border rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold mb-2">$19.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-gray-600 mb-6">Or $199/year (save 17%)</p>
              
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>