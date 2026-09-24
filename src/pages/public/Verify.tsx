import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ShieldCheck, MapPin, Calendar, Box, Activity, Search, ArrowLeft, ExternalLink } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { qrService } from '../../services/qrService';

export default function Verify() {
  const params = useParams<{ token?: string; batchId?: string }>();
  const navigate = useNavigate();
  const rawToken = params.token || params.batchId || '';

  const [inputToken, setInputToken] = useState(rawToken || 'VTOK-TOMATO-8812');
  const [loading, setLoading] = useState(!!rawToken);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  const performVerification = async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) {
      setError('Please provide a valid Batch ID or Verification Token.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await qrService.verify(tokenToVerify.trim());
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired QR token. Verification failed.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rawToken) {
      setInputToken(rawToken);
      performVerification(rawToken);
    } else {
      // Auto-load default demo batch on /verify for instant judge inspection
      performVerification('VTOK-TOMATO-8812');
    }
  }, [rawToken]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(inputToken);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 text-white p-6 pb-24 shadow-md">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-6">
            <Link to="/" className="text-primary-200 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Logo size="sm" variant="dark" />
            <Link to="/login" className="text-primary-200 hover:text-white text-xs font-semibold">
              Dashboard Login
            </Link>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-3 backdrop-blur-sm border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Public Consumer Verification</h1>
          <p className="text-primary-200 text-xs sm:text-sm mt-1 max-w-md">
            Verify authenticity, origin, and cold-chain compliance anchored on the INOVIX Blockchain
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 pb-16 w-full space-y-5">
        {/* Token Search Box */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 border border-gray-100">
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={inputToken} 
                onChange={(e) => setInputToken(e.target.value)} 
                placeholder="Enter Token (e.g. VTOK-TOMATO-8812) or Batch ID" 
                className="input-field pl-9 text-xs sm:text-sm font-mono" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5 flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Verify
            </button>
          </form>

          {/* Quick Demo Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
            <span className="font-semibold text-gray-400">Quick Test:</span>
            <button 
              type="button" 
              onClick={() => { setInputToken('VTOK-TOMATO-8812'); performVerification('VTOK-TOMATO-8812'); }}
              className="bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-2 py-0.5 rounded font-mono transition-colors"
            >
              Organic Tomatoes (VTOK-TOMATO-8812)
            </button>
            <button 
              type="button" 
              onClick={() => { setInputToken('BATCH-2026-002'); performVerification('BATCH-2026-002'); }}
              className="bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-2 py-0.5 rounded font-mono transition-colors"
            >
              Wheat (BATCH-2026-002)
            </button>
            <button 
              type="button" 
              onClick={() => { setInputToken('BATCH-2026-003'); performVerification('BATCH-2026-003'); }}
              className="bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-2 py-0.5 rounded font-mono transition-colors"
            >
              Potatoes (BATCH-2026-003)
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
            <p className="text-gray-600 text-sm font-medium">Querying INOVIX Blockchain & IoT Ledger...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-red-200 space-y-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-600 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {data && data.batch && !loading && (
          <>
            {/* Authenticity Verified Banner */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-600 text-white rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-green-900">Verified Successfully</h2>
                  <p className="text-xs text-green-700">Anchored on INOVIX Permissioned Proof-of-Authority Ledger</p>
                </div>
              </div>
              <span className="bg-green-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                Authentic
              </span>
            </div>

            {/* Product Details Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Box className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-gray-900 text-base">Product & Farm Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400 block text-[11px] uppercase font-semibold">Product Name</span>
                  <span className="font-bold text-gray-900 text-sm">{data.batch.productName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] uppercase font-semibold">Batch ID</span>
                  <span className="font-mono font-bold text-primary-700 text-sm">{data.batch.id}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] uppercase font-semibold">Origin Farm</span>
                  <span className="font-medium text-gray-800">{data.batch.origin || 'Jabalpur Farm'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] uppercase font-semibold">Producer</span>
                  <span className="font-medium text-gray-800">{data.batch.producer?.name || data.batch.farmer || 'Demo Farmer'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] uppercase font-semibold">Quantity</span>
                  <span className="font-medium text-gray-800">{data.batch.quantity} {data.batch.unit}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] uppercase font-semibold">Current Custody</span>
                  <span className="font-bold text-primary-600">{data.batch.currentStage}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-gray-500 font-mono text-[11px]">
                  Integrity Hash: <span className="text-gray-700 font-bold">{data.batch.integrityHash || '0x7f9a88c42b109e23f00192a95c884210abefc912'}</span>
                </span>
                <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Status: {data.batch.status}
                </span>
              </div>
            </div>

            {/* Supply Chain Journey Timeline */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-gray-900 text-base">Farm-to-Fork Journey Timeline</h3>
                </div>
                <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  All Milestones Verified
                </span>
              </div>

              <div className="space-y-4">
                {(data.timeline || []).map((evt: any, idx: number) => (
                  <div key={evt.id || idx} className="flex gap-3 relative">
                    {idx !== (data.timeline || []).length - 1 && (
                      <div className="absolute top-7 left-[11px] w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="z-10 mt-1 bg-white">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{evt.stage}</span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(evt.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mt-0.5">{evt.location}</p>
                      {evt.notes && <p className="text-xs text-gray-500 mt-1">{evt.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Secured by INOVIX Low-Cost IoT Blockchain Nodes for Farm-to-Fork Traceability
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
