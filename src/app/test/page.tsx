export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ App is Working!</h1>
        <p className="text-gray-700 mb-4">If you can see this, Next.js is running correctly.</p>
        <div className="space-y-2 text-sm">
          <div>✅ Next.js 15.4.6</div>
          <div>✅ React 19.1.0</div>
          <div>✅ Tailwind CSS</div>
          <div>✅ TypeScript</div>
        </div>
        <div className="mt-6">
          <a 
            href="/dashboard" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
