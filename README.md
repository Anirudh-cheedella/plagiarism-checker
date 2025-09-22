deployed link - https://plagiarism-checker-gilt.vercel.app/

# Professional Plagiarism Checker

A modern, professional plagiarism detection tool built with Next.js, TypeScript, and Tailwind CSS. Features advanced document analysis with real-time similarity detection using sophisticated k-gram algorithms.

## Features

- **Advanced Algorithm**: Uses k-gram analysis for accurate plagiarism detection
- **Real-time Analysis**: Fast document processing with instant results
- **Professional UI**: Modern, responsive design with animated background
- **Type Safety**: Built with TypeScript for robust code
- **Mobile Friendly**: Optimized for all device sizes
- **File Support**: Supports various document formats (.txt, .doc, .docx, .pdf)

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Animations**: CSS animations and Canvas API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd plagiarism-checker
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How It Works

1. **Upload Documents**: Select two documents to compare
2. **Analysis**: The system tokenizes text and uses k-gram analysis
3. **Results**: View highlighted similarities and percentage match
4. **Visual Feedback**: Professional results display with charts and metrics

## Algorithm Details

The plagiarism detection uses:

- Text normalization and tokenization
- K-gram phrase matching (configurable length)
- Interval merging for overlapping matches
- Similarity percentage calculation
- Highlighting of matched content

## Project Structure

```
plagiarism-checker/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BackgroundCanvas.tsx
│   ├── ResultsDisplay.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
├── utils/
│   └── plagiarismChecker.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Future Enhancements

- [ ] Support for more file formats
- [ ] Advanced similarity algorithms
- [ ] Batch document processing
- [ ] Export functionality for reports
- [ ] Integration with cloud storage
- [ ] Multi-language support
