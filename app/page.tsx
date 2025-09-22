'use client'

import { useState } from 'react'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import ResultsDisplay from '@/components/ResultsDisplay'
import { checkPlagiarism, readTextFile, PlagiarismResult } from '@/utils/plagiarismChecker'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setShowResults(false)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const doc1File = formData.get('doc1') as File
    const doc2File = formData.get('doc2') as File

    if (!doc1File || !doc2File) {
      setError('Please upload both documents.')
      setIsLoading(false)
      return
    }

    try {
      const [doc1Text, doc2Text] = await Promise.all([
        readTextFile(doc1File),
        readTextFile(doc2File)
      ])

      const plagiarismResult = checkPlagiarism(doc1Text, doc2Text)
      setResult(plagiarismResult)
      setShowResults(true)
    } catch (err) {
      setError('Error reading files. Please ensure they are valid text files.')
      console.error('File reading error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setResult(null)
    setShowResults(false)
    setError(null)
  }

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative">
      <BackgroundCanvas />
      
      {/* Header */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
            Plagiarism
          </span>{' '}
          <span className="text-white">Checker</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Advanced document analysis with real-time similarity detection using sophisticated algorithms
        </p>
      </div>

      {!showResults ? (
        /* Upload Form */
        <div className="glass-effect rounded-2xl p-8 w-full max-w-lg z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document 1 Upload */}
            <div className="space-y-2">
              <label htmlFor="doc1" className="block text-sm font-medium text-gray-300">
                Document 1
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="doc1"
                  name="doc1"
                  accept=".txt,.doc,.docx,.pdf"
                  required
                  className="file-input w-full p-3 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 transition-all duration-200 hover:border-violet-400 focus:border-violet-400 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Document 2 Upload */}
            <div className="space-y-2">
              <label htmlFor="doc2" className="block text-sm font-medium text-gray-300">
                Document 2
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="doc2"
                  name="doc2"
                  accept=".txt,.doc,.docx,.pdf"
                  required
                  className="file-input w-full p-3 rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 transition-all duration-200 hover:border-pink-400 focus:border-pink-400 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing Documents...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Check Plagiarism</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Results Section */
        <div className="w-full flex flex-col items-center space-y-6">
          <button
            onClick={resetForm}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 z-10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>New Analysis</span>
          </button>
          
          <ResultsDisplay result={result} isVisible={showResults} />
        </div>
      )}
    </main>
  )
}