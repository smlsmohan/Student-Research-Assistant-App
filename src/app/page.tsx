import { ProjectsSearchView } from '@/components/ProjectsSearchView';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            CORDIS Research Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore European research and innovation projects from HORIZON, H2020, and FP7 programmes.
            Discover cutting-edge research, funding opportunities, and collaboration networks.
          </p>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">79,069+</span> research projects • 
            <span className="font-medium"> €billions</span> in funding • 
            <span className="font-medium"> 27+</span> EU countries
          </div>
        </header>

        <ProjectsSearchView />
      </div>
    </div>
  );
}
