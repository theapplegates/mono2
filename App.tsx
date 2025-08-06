
import React, { useState, useCallback } from 'react';
import { emojifyReadme } from './services/geminiService';
import { MagicWandIcon, CopyIcon, CheckIcon, SparklesIcon, TableIcon, ListIcon } from './components/icons';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGenerate = useCallback(async (format: 'table' | 'list') => {
    if (!input.trim()) {
      setError('Please enter some README content to enhance.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');
    try {
      const result = await emojifyReadme(input, format);
      setOutput(result);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate content. ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [output]);

  const ResultDisplay: React.FC = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-center">
          <SparklesIcon className="w-12 h-12 text-purple-400 animate-pulse" />
          <p className="text-lg text-gray-400">Performing AI magic...</p>
          <p className="text-sm text-gray-500">This might take a moment.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      );
    }
    if (!output) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-center">
                <div className="p-4 bg-gray-800/50 rounded-full">
                    <MagicWandIcon className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200">Your enhanced README will appear here</h3>
                <p className="text-gray-400">Choose an enhancement style to get started!</p>
            </div>
        );
    }
    return (
      <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono p-6">{output}</pre>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="py-4 px-8 text-center border-b border-gray-700/50 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8"/>
          README Emojifier
        </h1>
        <p className="text-gray-400 mt-1">Transform your README from plain to polished with AI</p>
      </header>
      
      <main className="flex-grow flex flex-col lg:flex-row gap-8 p-4 md:p-8">
        {/* Left Column */}
        <div className="lg:w-1/2 flex flex-col gap-8">
          {/* Input Card */}
          <div className="flex flex-col bg-gray-800/50 rounded-lg shadow-2xl border border-gray-700/50 flex-grow">
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-200">1. Paste Your README Content</h2>
              <p className="text-sm text-gray-400 mt-2">
                Step right up! See your boring README come to life with beautiful emojis. Don't speak emoji? We are fluent in it. Paste your feature list below to get beautiful results.
              </p>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`## My Awesome Project

- Feature A
- Feature B
- Feature C`}
              className="w-full h-full flex-grow bg-transparent p-6 text-sm text-gray-200 font-mono resize-none focus:outline-none placeholder-gray-500"
              style={{minHeight: '300px'}}
            />
          </div>

          {/* Actions Card */}
          <div className="flex flex-col bg-gray-800/50 rounded-lg shadow-2xl border border-gray-700/50">
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-200">2. Choose Enhancement Style</h2>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGenerate('table')}
                disabled={isLoading || !input.trim()}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-800 disabled:opacity-60 disabled:cursor-not-allowed flex-1"
              >
                <span className="relative w-full flex items-center justify-center gap-2 px-5 py-3 transition-all duration-75 ease-in bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  <TableIcon className="w-5 h-5"/>
                  Emoji in table format
                </span>
              </button>
              <button
                onClick={() => handleGenerate('list')}
                disabled={isLoading || !input.trim()}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:text-white dark:focus:ring-green-800 disabled:opacity-60 disabled:cursor-not-allowed flex-1"
              >
                <span className="relative w-full flex items-center justify-center gap-2 px-5 py-3 transition-all duration-75 ease-in bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  <ListIcon className="w-5 h-5"/>
                  Emoji in normal format
                </span>
              </button>
            </div>
          </div>
        </div>


        {/* Output Column */}
        <div className="lg:w-1/2 flex flex-col bg-gray-800/50 rounded-lg shadow-2xl border border-gray-700/50">
           <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-200">3. Your Enhanced README</h2>
              <button
                onClick={handleCopy}
                disabled={!output || isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex-grow overflow-y-auto" style={{minHeight: '400px'}}>
              <ResultDisplay />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
