import { useState } from 'react';
import Header from './components/common/Header';
import TabNavigation from './components/common/TabNavigation';
import URLInput from './components/common/URLInput';
import ActionButton from './components/common/ActionButton';
import ErrorDisplay from './components/common/ErrorDisplay';
import SetupInstructions from './components/common/SetupInstructions';
import ResultsContainer from './components/results/ResultsContainer';
import api from './services/api';
import type { TabType, APIResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('screenshot');
  const [url, setUrl] = useState<string>('https://example.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<APIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callAPI = async (apiFunction: () => Promise<APIResult>) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiFunction();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = () => {
    setResult(null);
    setError(null);
  };

  const handleScreenshot = () => callAPI(() => api.screenshot(url, true));
  const handleGeneratePDF = () => callAPI(() => api.generatePDF(url));
  const handleScrape = () => callAPI(() => api.scrapeData(url));
  const handlePageInfo = () => callAPI(() => api.getPageInfo(url));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <Header />

          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabChange={handleTabChange}
          />

          <div className="p-8">
            <URLInput url={url} setUrl={setUrl} />

            <div className="mb-6">
              {activeTab === 'screenshot' && (
                <ActionButton onClick={handleScreenshot} loading={loading} color="blue">
                  {loading ? 'Capturing...' : 'Take Screenshot'}
                </ActionButton>
              )}

              {activeTab === 'pdf' && (
                <ActionButton onClick={handleGeneratePDF} loading={loading} color="purple">
                  {loading ? 'Generating...' : 'Generate PDF'}
                </ActionButton>
              )}

              {activeTab === 'scrape' && (
                <ActionButton onClick={handleScrape} loading={loading} color="green">
                  {loading ? 'Scraping...' : 'Scrape Data'}
                </ActionButton>
              )}

              {activeTab === 'info' && (
                <ActionButton onClick={handlePageInfo} loading={loading} color="orange">
                  {loading ? 'Loading...' : 'Get Page Info'}
                </ActionButton>
              )}
            </div>

            <ErrorDisplay error={error} />
            <ResultsContainer result={result} activeTab={activeTab} />
          </div>
        </div>

        <SetupInstructions />
      </div>
    </div>
  );
}
