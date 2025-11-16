import { FileText, Download } from 'lucide-react';

interface PDFResultProps {
  pdf: string;
}

export default function PDFResult({ pdf }: PDFResultProps) {
  const downloadPDF = () => {
    const blob = new Blob(
      [Uint8Array.from(atob(pdf), c => c.charCodeAt(0))],
      { type: 'application/pdf' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center">
      <FileText className="w-16 h-16 text-purple-600 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">PDF generated successfully!</p>
      <button
        onClick={downloadPDF}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 mx-auto"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>
    </div>
  );
}
