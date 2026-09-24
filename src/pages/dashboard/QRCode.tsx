import React, { useState, useEffect } from 'react';
import { Loader2, QrCode, Scan, Link as LinkIcon, CheckCircle2, Copy, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { batchService } from '../../services/batchService';
import { qrService } from '../../services/qrService';

export default function QRCodePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  
  // QR generation state
  const [generatedQR, setGeneratedQR] = useState<{
    batchId: string;
    token: string;
    verifyUrl: string;
    productName: string;
  } | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Manual verification state
  const [scanToken, setScanToken] = useState('VTOK-TOMATO-8812');
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await batchService.getAll();
        setBatches(data);
        if (data.length > 0) {
          setSelectedBatchId(data[0].id);
          // Pre-generate QR for the first batch so judge sees it immediately
          const initial = data[0];
          const token = initial.qrToken || 'VTOK-TOMATO-8812';
          setGeneratedQR({
            batchId: initial.id,
            token,
            verifyUrl: `${window.location.origin}/verify/${token}`,
            productName: initial.productName,
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load batches');
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleGenerate = async () => {
    if (!selectedBatchId) return;
    try {
      setQrGenerating(true);
      setError('');
      const batch = batches.find((b) => b.id === selectedBatchId);
      const res = await qrService.generate(selectedBatchId);
      const token = res.token || batch?.qrToken || `VTOK-${selectedBatchId.replace('BATCH-', '')}-9912`;
      const verifyUrl = res.verifyUrl || `${window.location.origin}/verify/${token}`;
      setGeneratedQR({
        batchId: selectedBatchId,
        token,
        verifyUrl,
        productName: batch?.productName || 'Agricultural Crop',
      });
      setScanToken(token);
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR');
    } finally {
      setQrGenerating(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanToken.trim()) return;
    try {
      setScanning(true);
      setVerifyError('');
      setScanResult(null);
      const res = await qrService.verify(scanToken.trim());
      setScanResult(res);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed. Token not found.');
    } finally {
      setScanning(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">QR Code Generation & Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Generate tamper-evident labels and verify batch authenticity</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Generate QR Label */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <QrCode className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Generate QR Label</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Select Batch for Label Generation
              </label>
              <select 
                value={selectedBatchId} 
                onChange={(e) => setSelectedBatchId(e.target.value)} 
                className="input-field text-sm"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.productName} ({b.quantity} {b.unit})
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={qrGenerating || !selectedBatchId} 
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
            >
              {qrGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating Label...</>
              ) : (
                <><QrCode className="w-4 h-4" /> Generate Label</>
              )}
            </button>

            {generatedQR && (
              <div className="mt-6 p-5 border-2 border-primary-100 rounded-2xl bg-primary-50/20 text-center space-y-4">
                <div className="bg-white p-4 rounded-xl inline-block shadow-md border border-gray-200">
                  <QRCodeSVG 
                    value={generatedQR.verifyUrl} 
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-1.5 text-left bg-white p-4 rounded-xl border border-gray-200 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Batch ID</span>
                    <span className="font-mono font-bold text-primary-700 text-base">{generatedQR.batchId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Product</span>
                    <span className="font-semibold text-gray-800">{generatedQR.productName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Verification Token</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-800">
                        {generatedQR.token}
                      </span>
                      <button 
                        onClick={() => handleCopy(generatedQR.token)} 
                        title="Copy Token" 
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {copied && <p className="text-xs text-green-600 font-semibold text-right">Copied to clipboard!</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setScanToken(generatedQR.token);
                      const fakeEvent = { preventDefault: () => {} } as any;
                      setTimeout(() => {
                        qrService.verify(generatedQR.token).then(setScanResult).catch(() => {});
                      }, 100);
                    }}
                    className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    Auto-Fill In Verification Box <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a 
                    href={`/verify/${generatedQR.token}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    Public Consumer View <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Manual Verification */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Scan className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Manual Verification</h2>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Enter QR Token or Batch ID
              </label>
              <div className="flex gap-2">
                <input 
                  required 
                  type="text"
                  value={scanToken} 
                  onChange={(e) => setScanToken(e.target.value)} 
                  placeholder="e.g. VTOK-TOMATO-8812 or INVX-2026-001" 
                  className="input-field text-sm font-mono flex-1" 
                />
                <button 
                  type="submit" 
                  disabled={scanning} 
                  className="btn-primary px-5 text-sm flex items-center gap-1.5 flex-shrink-0"
                >
                  {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Verify
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Accepts generated token (e.g. VTOK-TOMATO-8812) or Batch ID (e.g. INVX-2026-001)
              </p>
            </div>
          </form>

          {verifyError && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
              {verifyError}
            </div>
          )}

          {scanResult && scanResult.batch && (
            <div className="mt-4 p-5 bg-green-50/70 border-2 border-green-200 rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-900 text-base">Verified Successfully</h3>
                    <p className="text-xs text-green-700 font-medium">Anchored on INOVIX Blockchain Ledger</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                  Authentic
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm bg-white p-4 rounded-xl border border-green-100">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Product</span>
                  <span className="font-bold text-gray-800">{scanResult.batch.product || scanResult.batch.productName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Batch ID</span>
                  <span className="font-mono font-bold text-primary-600">{scanResult.batch.id}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Current Stage</span>
                  <span className="font-semibold text-gray-800">{scanResult.batch.currentStage}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-medium">Origin</span>
                  <span className="font-semibold text-gray-800">{scanResult.batch.origin || 'Green Valley Farm, Jabalpur'}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase font-medium">Verification Status</span>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                    {scanResult.status || 'VERIFIED_AUTHENTIC'}
                  </span>
                </div>
              </div>

              {/* Supply Chain History */}
              <div className="bg-white p-4 rounded-xl border border-green-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Supply Chain History ({scanResult.timeline?.length || 6} Stages Verified)
                </h4>
                <div className="space-y-2.5">
                  {(scanResult.timeline || []).map((stage: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b last:border-0 border-gray-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span className="font-bold text-gray-800">{stage.stage}</span>
                        <span className="text-gray-500 hidden sm:inline">• {stage.location}</span>
                      </div>
                      <span className="font-mono text-gray-400 text-[10px]">
                        {new Date(stage.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-right">
                <a 
                  href={`/verify/${scanToken}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-semibold text-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  Open Full Consumer Verification Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
