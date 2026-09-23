import React, { useState, useEffect } from 'react';
import { Loader2, QrCode, Scan, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { batchService } from '../../services/batchService';
import { qrService } from '../../services/qrService';

export default function QRCodePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrGenerating, setQrGenerating] = useState(false);
  const [scanToken, setScanToken] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await batchService.getAll();
        setBatches(data);
        if (data.length > 0) setSelectedBatch(data[0].id);
      } catch (err: any) {
        setError(err.message || 'Failed to load batches');
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleGenerate = async () => {
    if (!selectedBatch) return;
    try {
      setQrGenerating(true);
      const res = await qrService.generate(selectedBatch);
      setQrDataUrl(res.qrDataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR');
    } finally {
      setQrGenerating(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanToken) return;
    try {
      setScanning(true);
      setScanResult(null);
      const res = await qrService.verify(scanToken);
      setScanResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to verify token');
    } finally {
      setScanning(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">QR Code & Verification</h1>
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><QrCode className="w-5 h-5"/> Generate QR Label</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Batch</label>
              <select value={selectedBatch} onChange={e=>setSelectedBatch(e.target.value)} className="input-field">
                {batches.map(b => <option key={b.id} value={b.id}>{b.id} - {b.productName}</option>)}
              </select>
            </div>
            <button onClick={handleGenerate} disabled={qrGenerating} className="btn-primary w-full">
              {qrGenerating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Generate Label'}
            </button>
            {qrDataUrl && (
              <div className="mt-6 text-center border p-4 rounded-xl bg-gray-50">
                <img src={qrDataUrl} alt="QR Code" className="mx-auto w-48 h-48 bg-white p-2 rounded shadow" />
                <p className="text-xs text-gray-500 mt-2">Scan to verify authenticity</p>
                <a href={`/verify/${qrDataUrl.substring(qrDataUrl.length - 10)}`} className="text-primary-600 text-sm hover:underline mt-2 inline-block">Simulate Scan (Demo)</a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Scan className="w-5 h-5"/> Manual Verification</h2>
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">QR Token / Batch ID</label>
              <input required value={scanToken} onChange={e=>setScanToken(e.target.value)} placeholder="Enter token from label" className="input-field" />
            </div>
            <button type="submit" disabled={scanning} className="btn-secondary w-full">
              {scanning ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify Token'}
            </button>
          </form>

          {scanResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
              <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5"/> Verified Authentic</h3>
              <p className="text-sm text-gray-700"><strong>Product:</strong> {scanResult.batch.product || scanResult.batch.productName}</p>
              <p className="text-sm text-gray-700"><strong>Origin / Farm:</strong> {scanResult.batch.origin || scanResult.batch.farmName || 'N/A'}</p>
              <p className="text-sm text-gray-700"><strong>Current Stage:</strong> {scanResult.batch.currentStage}</p>
              <a href={`/verify/${scanToken}`} target="_blank" rel="noreferrer" className="text-primary-600 text-sm hover:underline mt-2 inline-flex items-center gap-1"><LinkIcon className="w-4 h-4"/> View Consumer Page</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
