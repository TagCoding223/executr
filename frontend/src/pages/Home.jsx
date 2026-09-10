import React from 'react';
import {
  ChevronDown,
  Server,
  BrainCircuit,
  ShieldCheck,
  Coffee,
  Leaf,
  Atom,
  Container,
  Rabbit,
  Database,
  Wind,
  Mail,
  Briefcase
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col items-center">

        {/* Hero Section */}
        <div className="text-center max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            v1.0 is live • Built with Spring Boot Microservices
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Master Complex Algorithms in a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
              Distributed Execution Sandbox
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
            A scalable, microservice-backed coding arena. Write pure logic, execute safely in isolated Docker containers, and get instant feedback from an integrated AI tutor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <button className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shadow-lg shadow-green-600/20">
              Enter the Arena
            </button>
            <button className="px-8 py-3 rounded-lg bg-gray-200 dark:bg-[#1A1D24] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 font-semibold transition-colors">
              View System Design
            </button>
          </div>
        </div>

        {/* Mock Code Editor */}
        <div className="w-full max-w-3xl bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xl mb-16 text-left">
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14]">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-[#1A1D24] rounded-md text-sm font-medium cursor-pointer border border-gray-300 dark:border-gray-700">
              Java <ChevronDown size={14} />
            </div>
          </div>
          <div className="p-6 overflow-x-auto text-sm md:text-base font-mono leading-relaxed">
            <pre className="text-gray-800 dark:text-gray-300">
              <span className="text-purple-600 dark:text-pink-400">class</span> Solution {'{\n'}
              {'    '}<span className="text-purple-600 dark:text-pink-400">public</span> <span className="text-blue-600 dark:text-blue-400">int</span>[] twoSum(<span className="text-blue-600 dark:text-blue-400">int</span>[] nums, <span className="text-blue-600 dark:text-blue-400">int</span> target) {'{\n'}
              {'        '}Map&lt;Integer, Integer&gt; numMap = <span className="text-purple-600 dark:text-pink-400">new</span> HashMap&lt;&gt;();{'\n'}
              {'        '}<span className="text-purple-600 dark:text-pink-400">for</span> (<span className="text-blue-600 dark:text-blue-400">int</span> i = <span className="text-orange-600 dark:text-orange-400">0</span>; i &lt; nums.length; i++) {'{\n'}
              {'            '}<span className="text-blue-600 dark:text-blue-400">int</span> complement = target - nums[i];{'\n'}
              {'            '}<span className="text-gray-500">....</span>{'\n'}
              {'        }\n'}
              {'    }\n'}
              {'}'}
            </pre>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-green-50 dark:bg-green-900/10">
            <span className="text-green-600 dark:text-green-400 font-mono text-sm font-semibold">Test Cases Passed</span>
          </div>
        </div>

        {/* Powered By Section */}
        {/* TODO: update this section us your technology used in project */}
        <div className="w-full max-w-3xl bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-12 text-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">Powered By</h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2"><Coffee size={18} className="text-red-500" /> Java</div>
            <div className="flex items-center gap-2"><Leaf size={18} className="text-green-500" /> Spring Boot</div>
            <div className="flex items-center gap-2"><Atom size={18} className="text-blue-400" /> React</div>
            <div className="flex items-center gap-2"><Container size={18} className="text-blue-500" /> Docker</div>
            <div className="flex items-center gap-2"><Rabbit size={18} className="text-orange-500" /> RabbitMQ</div>
            <div className="flex items-center gap-2"><Database size={18} className="text-blue-300" /> PostgreSQL</div>
            <div className="flex items-center gap-2"><Wind size={18} className="text-cyan-400" /> TailwindCSS</div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="bg-white dark:bg-[#12141C] p-8 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <Server size={32} className="text-gray-700 dark:text-gray-300 mb-4" />
            <h3 className="text-lg font-bold mb-3">Distributed Execution Engine</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Code submissions are queued and processed asynchronously by isolated worker nodes for zero-downtime execution.
            </p>
          </div>

          <div className="bg-white dark:bg-[#12141C] p-8 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <BrainCircuit size={32} className="text-gray-700 dark:text-gray-300 mb-4" />
            <h3 className="text-lg font-bold mb-3">AI-Powered Contextual Tutor</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Stuck on a minimal cover problem? Our RAG pipeline analyzes your time complexity and provides hints without giving away the answer.
            </p>
          </div>

          <div className="bg-white dark:bg-[#12141C] p-8 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <ShieldCheck size={32} className="text-gray-700 dark:text-gray-300 mb-4" />
            <h3 className="text-lg font-bold mb-3">Secure Docker Sandboxing</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Every code submission runs in an ephemeral, heavily restricted container to prevent malicious operations and infinite loops.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#0B0D14] py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Copyright © 2026 Vishal Chouhan.
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors"><Mail size={16} /> Email</a>
            <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors"><Briefcase size={16} /> Portfolio</a>
            <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors"><i className="fa-brands fa-github fa-lg"></i> GitHub</a>
            <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors"><i className="fa-brands fa-linkedin fa-lg"></i> Linkedin</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;