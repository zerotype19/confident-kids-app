import Link from 'next/link';

export default function PillarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">ConfidentKids</Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
            <button className="bg-gray-200 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Pillar Header */}
        <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pillar 1: Independence & Problem-Solving</h1>
              <p className="text-blue-100 text-lg mb-4">The "Ask, Don't Tell" Method</p>
              <p className="text-white max-w-3xl">
                Independence builds self-trust. When kids are encouraged to make decisions and solve problems, they
                develop confidence in their own abilities. A child who feels capable of handling challenges is more
                likely to take initiative, try new things, and persevere through difficulties.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <span className="inline-block bg-white text-blue-600 text-lg font-bold px-4 py-2 rounded-full">
                Current Focus
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* How to Teach Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">How to Teach Independence</h2>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-blue-600 mb-2">The "Ask, Don't Tell" Method</h3>
                <p className="text-gray-700 mb-4">
                  Instead of providing answers, ask guiding questions to encourage critical thinking.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h4 className="font-bold text-blue-800 mb-3">Step-by-Step:</h4>
                  <ol className="space-y-3 text-blue-900">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">1.</span>
                      <span>When your child has a problem, <strong>resist the urge to jump in.</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">2.</span>
                      <span>Ask, <strong>"What do you think you should do?"</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">3.</span>
                      <span>If they struggle, offer, <strong>"What's one thing you could try first?"</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">4.</span>
                      <span>Encourage trial and error. Praise <strong>effort over getting it 'right.'</strong></span>
                    </li>
                  </ol>
                </div>
                
                <h4 className="font-bold text-gray-800 mb-3">Parent Example Responses:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span className="font-bold text-red-700">Common Mistake:</span>
                    </div>
                    <p className="text-red-700">"Just do it this way."</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="font-bold text-green-700">Better Approach:</span>
                    </div>
                    <p className="text-green-700">"That's tricky. What do you think would happen if you tried X?"</p>
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-800 mb-3">Troubleshooting:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>If your child says, <strong>"I don't know,"</strong> ask, <strong>"What would you do if I weren't here?"</strong></span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>If they resist, remind them, <strong>"You don't have to be perfect, just try something."</strong></span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Real-Life Scenarios */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Real-Life Parent-Child Scenarios</h2>
              <p className="text-gray-700 mb-6">
                Practical conversations help reinforce independence in daily life. Here are five common situations
                and how to respond:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">Scenario 1: Struggling with Homework</h3>
                  <div className="space-y-2 mb-3">
                    <p className="text-red-600 font-medium">Child: "I don't know how to do this math problem."</p>
                    <p className="text-red-600 font-medium">❌ Parent: "Here, let me do it for you."</p>
                    <p className="text-green-600 font-medium">✅ Parent: "Hmm, what part do you understand? What's the first step you could try?"</p>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">Scenario 2: Getting Dressed in the Morning</h3>
                  <div className="space-y-2 mb-3">
                    <p className="text-red-600 font-medium">Child: "I don't know what to wear!"</p>
                    <p className="text-red-600 font-medium">❌ Parent: "Just put on what I picked for you."</p>
                    <p className="text-green-600 font-medium">✅ Parent: "Check the weather outside. Do you think you'll need a jacket?"</p>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">Scenario 3: Forgetting Their Lunch at Home</h3>
                  <div className="space-y-2 mb-3">
                    <p className="text-red-600 font-medium">Child: "I forgot my lunch! Can you bring it to school?"</p>
                    <p className="text-red-600 font-medium">❌ Parent: "I'll bring it right away!"</p>
                    <p className="text-green-600 font-medium">✅ Parent: "That's frustrating! What could you do next time to remember it?"</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Scenarios →
                </button>
              </div>
            </div>
            
            {/* Activities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Activities to Try This Week</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">The Choice Game</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Ages 2-5</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Offer your toddler two acceptable choices throughout the day (e.g., "Would you like to wear the red shirt or the blue shirt?"). 
                    This builds decision-making skills in a safe, controlled way.
                  </p>
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Activity Details →
                  </button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">Problem-Solving Challenge</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Ages 6-11</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Present your child with a simple household problem (e.g., "The remote is missing" or "We need to organize these toys"). 
                    Ask them to come up with three possible solutions before choosing one to try.
                  </p>
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Activity Details →
                  </button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">Independent Project</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Ages 12+</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Challenge your teen to plan and execute a small project from start to finish without your help 
                    (e.g., cooking a meal, planning a family activity, or organizing a space in your home).
                  </p>
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Activity Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Your Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Pillar 1 Completion</span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Completed 6 activities</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Logged 12 practice sessions</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-700">2 activities remaining this week</span>
                </div>
              </div>
            </div>
            
            {/* Resources */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Helpful Resources</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Printable "Ask, Don't Tell" Guide</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </sv<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>