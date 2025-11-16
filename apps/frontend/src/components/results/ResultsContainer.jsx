import React from 'react';
import ScreenshotResult from './ScreenshotResult';
import PDFResult from './PDFResult';
import ScrapedDataResult from './ScrapedDataResult';
import PageInfoResult from './PageInfoResult';

export default function ResultsContainer({ result, activeTab }) {
  if (!result) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Results</h3>
      
      {activeTab === 'screenshot' && result.screenshot && (
        <ScreenshotResult screenshot={result.screenshot} />
      )}

      {activeTab === 'pdf' && result.pdf && (
        <PDFResult pdf={result.pdf} />
      )}

      {activeTab === 'scrape' && result.data && (
        <ScrapedDataResult data={result.data} />
      )}

      {activeTab === 'info' && result.info && (
        <PageInfoResult info={result.info} />
      )}
    </div>
  );
}
