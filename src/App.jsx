import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import ReportSelector from './components/ReportSelector';
import InvoiceReport from './components/InvoiceReport';
import BulkExport from './components/BulkExport';
import { getReportData } from './utils/dataProcessing';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function App() {
  const [accounts, setAccounts] = useState(null);
  const [reportConfig, setReportConfig] = useState(null);

  // State for bulk export rendering
  const [exportConfig, setExportConfig] = useState(null);
  const exportContainerRef = useRef(null);

  const handleDataLoaded = (data) => {
    setAccounts(data);
    setReportConfig(null);
  };

  const handleGenerateReport = (config) => {
    setReportConfig(config);
  };

  // Ref for the currently visible report
  const mainReportRef = useRef(null);

  const generatePDF = async (element, fileName) => {
    if (!element) {
      console.error("generatePDF: Element not found");
      return null;
    }
    console.log(`Generating PDF for ${fileName}...`);
    try {
      // Wait a bit to ensure styles are applied (especially for hidden container)
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging to see html2canvas errors
        windowWidth: 1200,
        allowTaint: true,
        backgroundColor: '#ffffff' // Ensure white background
      });

      console.log("Canvas created:", canvas.width, canvas.height);

      // Use JPEG with 0.75 quality to reduce file size significantly
      const imgData = canvas.toDataURL('image/jpeg', 0.75);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      console.log("PDF created successfully");
      return pdf;
    } catch (err) {
      console.error("PDF Generation Error:", err);
      return null;
    }
  };

  const handleSingleExport = async () => {
    if (!reportConfig || !mainReportRef.current) {
      alert("Please generate a report first.");
      return;
    }

    const { accountId, month, year } = reportConfig;
    const fileName = `${accountId}_${year}-${String(month + 1).padStart(2, '0')}.pdf`;

    const pdf = await generatePDF(mainReportRef.current, fileName);
    if (pdf) {
      pdf.save(fileName);
    }
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleBulkExport = async (selectedAccountIds, monthsToExport) => {
    const zip = new JSZip();

    for (const accountId of selectedAccountIds) {
      const accountFolder = zip.folder(accountId);

      for (const { month, year } of monthsToExport) {
        // Set state to render the report in the hidden container
        setExportConfig({ accountId, month, year });

        // Wait for React to render
        // Increased wait time to ensure charts render and DOM is stable
        await wait(250);

        if (exportContainerRef.current) {
          const fileName = `${accountId}_${year}-${String(month + 1).padStart(2, '0')}.pdf`;
          const pdf = await generatePDF(exportContainerRef.current, fileName);

          if (pdf) {
            accountFolder.file(fileName, pdf.output('blob'));
          }
        }
      }
    }

    // Clear export config to hide the container
    setExportConfig(null);

    // Generate and save zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "utility_reports.zip");
  };

  const renderContent = () => {
    if (!accounts) {
      return (
        <div className="max-w-xl mx-auto mt-20">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Utility Report Generator</h1>
          <FileUpload onDataLoaded={handleDataLoaded} />
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Utility Report Generator</h1>
          <button
            onClick={() => setAccounts(null)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Upload different file
          </button>
        </div>

        <BulkExport accounts={accounts} onExport={handleBulkExport} />

        <ReportSelector
          accounts={accounts}
          onGenerate={handleGenerateReport}
          onExportPDF={handleSingleExport}
        />

        {reportConfig && (
          <div className="mt-8" ref={mainReportRef}>
            <InvoiceReport
              data={getReportData(accounts[reportConfig.accountId], reportConfig.month - 1, reportConfig.year)}
              accountInfo={accounts[reportConfig.accountId]}
              reportDate={new Date(reportConfig.year, reportConfig.month, 1)}
            />
          </div>
        )}

        {/* Hidden Export Container */}
        {/* Changed positioning to be fixed but visible to html2canvas (opacity 0) */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '1000px', opacity: 0, zIndex: -100, pointerEvents: 'none' }}>
          {exportConfig && (
            <div ref={exportContainerRef}>
              <InvoiceReport
                data={getReportData(accounts[exportConfig.accountId], exportConfig.month - 1, exportConfig.year)}
                accountInfo={accounts[exportConfig.accountId]}
                reportDate={new Date(exportConfig.year, exportConfig.month, 1)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      {renderContent()}
    </div>
  );
}

export default App;
