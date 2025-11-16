import { Globe } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
      <div className="flex items-center gap-3 mb-2">
        <Globe className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Puppeteer Web Service</h1>
      </div>
      <p className="text-blue-100">Automate web scraping, screenshots, and data extraction</p>
    </div>
  );
}
