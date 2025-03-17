import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">ConfidentKids</Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, Parent</span>
            <button className="bg-gray-200 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <nav className="space-y-2">
                <Link href="/dashboard" className="block px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium">Dashboard</Link>
                <Link href="/dashboard/children" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">My Children</Link>
                <Link href="/dashboard/activities" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Activities</Link>
                <Link href="/dashboard/progress" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Progress Tracker</Link>
                <Link href="/dashboard/resources" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Resources</Link>
                <Link href="/dashboard/community" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Community</Link>
                <Link href="/dashboard/settings" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Settings</Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-2">Welcome to Your Confidence Dashboard</h1>
              <p className="text-gray-600 mb-4">Track your child's confidence journey and access personalized activities.</p>
              <div className="bg-indigo-50 p-4 rounded-md">
                <h3 className="font-medium text-indigo-800 mb-2">Current Focus: Pillar 1 - Independence & Problem-Solving</h3>
                <p className="text-indigo-700">Week 2 of 4 - Building decision-making skills</p>
              </div>
            </div>

            {/* Child Profiles */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Child Profiles</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Child</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">E</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Emma</h3>
                    <p className="text-gray-600 text-sm">Age: 8</p>
                    <div className="mt-1">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Great progress!</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">J</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Jacob</h3>
                    <p className="text-gray-600 text-sm">Age: 5</p>
                    <div className="mt-1">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Just started</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Activities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Today's Activities</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Decision-Making Game</h3>
                      <p className="text-gray-600 text-sm">For Emma - Pillar 1: Independence & Problem-Solving</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">15 min</span>
                  </div>
                  <p className="mt-2 text-gray-700">Play the "What Would You Do?" scenario game to help Emma practice making decisions independently.</p>
                  <button className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Activity →</button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Simple Choices Exercise</h3>
                      <p className="text-gray-600 text-sm">For Jacob - Pillar 1: Independence & Problem-Solving</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">10 min</span>
                  </div>
                  <p className="mt-2 text-gray-700">Offer Jacob two acceptable choices for snack time and let him decide which one he wants.</p>
                  <button className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Activity →</button>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Progress Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <h3 className="font-medium text-sm text-blue-800">Pillar 1</h3>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-blue-800">75%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <h3 className="font-medium text-sm text-purple-800">Pillar 2</h3>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-purple-800">40%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <h3 className="font-medium text-sm text-green-800">Pillar 3</h3>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-green-800">25%</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <h3 className="font-medium text-sm text-yellow-800">Pillar 4</h3>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-600 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-yellow-800">10%</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <h3 className="font-medium text-sm text-red-800">Pillar 5</h3>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-red-800">5%</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link href="/dashboard/progress" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Detailed Progress →</Link>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">23</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Expert Webinar: Building Independence</h3>
                    <p className="text-sm text-gray-600">March 23, 2025 • 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">30</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Monthly Progress Review</h3>
                    <p className="text-sm text-gray-600">March 30, 2025 • Automated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
