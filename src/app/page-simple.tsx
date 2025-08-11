export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 Student Research Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover European research opportunities, connect with researchers, and advance your academic journey
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">79,000+ Projects</h3>
              <p className="text-gray-600">Explore CORDIS research database</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">AI-powered research discovery</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Find researchers and opportunities</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <a 
              href="/test" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Test Page
            </a>
            <a 
              href="/dashboard" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
            >
              Go to Dashboard
            </a>
            <a 
              href="/auth/login" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              Login
            </a>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>✅ App is running successfully!</p>
          <p>Next.js 15.4.6 • React 19.1.0 • TypeScript • Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
