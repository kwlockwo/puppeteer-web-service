import ScreenshotResult from './ScreenshotResult';
import PDFResult from './PDFResult';
import ScrapedDataResult from './ScrapedDataResult';
import PageInfoResult from './PageInfoResult';
import type { APIResult, TabType, ScreenshotResponse, PDFResponse, ScrapeResponse, PageInfoResponse } from '../../types';

interface ResultsContainerProps {
  result: APIResult | null;
  activeTab: TabType;
}

export default function ResultsContainer({ result, activeTab }: ResultsContainerProps) {
  if (!result) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Results</h3>

      {activeTab === 'screenshot' && (result as ScreenshotResponse).screenshot && (
        <ScreenshotResult screenshot={(result as ScreenshotResponse).screenshot!} />
      )}

      {activeTab === 'pdf' && (result as PDFResponse).pdf && (
        <PDFResult pdf={(result as PDFResponse).pdf!} />
      )}

      {activeTab === 'scrape' && (result as ScrapeResponse).data && (
        <ScrapedDataResult data={(result as ScrapeResponse).data!} />
      )}

      {activeTab === 'info' && (result as PageInfoResponse).data && (
        <PageInfoResult info={(result as PageInfoResponse).data!} />
      )}
    </div>
  );
}
