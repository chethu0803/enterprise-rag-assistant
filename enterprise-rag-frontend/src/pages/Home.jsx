
const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <header className="w-full shadow-sm bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">RAG Assistant</h1>
          <nav className="space-x-8 hidden md:flex">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Features</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Docs</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">GitHub</a>
          </nav>
          <button className="md:hidden p-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Menu</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">
        <div className="max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900 mb-6">
            Enterprise-grade <span className="text-indigo-600">RAG Assistant</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload documents, ask natural language queries, and get accurate answers powered by retrieval-augmented generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/chat" className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Chatting
            </a>
            <a href="/upload" className="px-8 py-4 bg-slate-800 text-white rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Upload Documents
            </a>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Intelligent Retrieval</h3>
            <p className="text-slate-600">Advanced semantic search finds the most relevant information from your documents.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-emerald-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Natural Language</h3>
            <p className="text-slate-600">Ask questions in plain English and get contextual, accurate responses.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-amber-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise Ready</h3>
            <p className="text-slate-600">Scalable, secure, and built for professional environments.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;