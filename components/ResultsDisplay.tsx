'use client'

import { PlagiarismResult, highlightText } from '@/utils/plagiarismChecker'

interface ResultsDisplayProps {
  result: PlagiarismResult | null
  isVisible: boolean
}

export default function ResultsDisplay({ result, isVisible }: ResultsDisplayProps) {
  if (!isVisible || !result) return null

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Summary Card */}
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
          <p className="text-gray-300">Document similarity assessment</p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              {result.similarity}%
            </div>
            <p className="text-gray-400 text-sm mt-2">Overall Similarity</p>
          </div>
          
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray={`${result.similarity}, 100`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center space-x-8 text-sm">
          <div className="text-center">
            <span className="block text-gray-400">Matched Characters</span>
            <span className="text-white font-semibold">
              {result.doc1Matches.reduce((sum, m) => sum + (m.end - m.start), 0)} / {result.doc1Text.length}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-gray-400">Detection Algorithm</span>
            <span className="text-white font-semibold">K-gram Analysis</span>
          </div>
        </div>
      </div>

      {/* Documents Comparison */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Document 1 */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
              Document 1
            </h3>
            <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              {result.doc1Text.length} characters
            </span>
          </div>
          
          <div className="document-container bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-700">
            <div 
              className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: highlightText(result.doc1Text, result.doc1Matches) 
              }}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>
              {result.doc1Matches.length} highlighted sections
            </span>
            <span>
              {((result.doc1Matches.reduce((sum, m) => sum + (m.end - m.start), 0) / result.doc1Text.length) * 100).toFixed(1)}% similarity
            </span>
          </div>
        </div>

        {/* Document 2 */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="w-3 h-3 bg-pink-400 rounded-full mr-3"></span>
              Document 2
            </h3>
            <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              {result.doc2Text.length} characters
            </span>
          </div>
          
          <div className="document-container bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-700">
            <div 
              className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: highlightText(result.doc2Text, result.doc2Matches) 
              }}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>
              {result.doc2Matches.length} highlighted sections
            </span>
            <span>
              {((result.doc2Matches.reduce((sum, m) => sum + (m.end - m.start), 0) / result.doc2Text.length) * 100).toFixed(1)}% similarity
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Analysis Details</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-violet-400 mb-2">
              {Math.max(result.doc1Matches.length, result.doc2Matches.length)}
            </div>
            <p className="text-gray-400">Matching Phrases</p>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-pink-400 mb-2">
              {result.similarity > 30 ? 'High' : result.similarity > 15 ? 'Medium' : 'Low'}
            </div>
            <p className="text-gray-400">Similarity Level</p>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400 mb-2">
              {result.similarity > 50 ? '⚠️' : result.similarity > 25 ? '⚡' : '✅'}
            </div>
            <p className="text-gray-400">Detection Status</p>
          </div>
        </div>
      </div>
    </div>
  )
}