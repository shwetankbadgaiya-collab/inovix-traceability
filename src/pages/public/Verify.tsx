import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, ShieldCheck, MapPin, Calendar, Box, Activity } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { qrService } from '../../services/qrService';

export default function Verify() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        if (!token) throw new Error('No token provided');
        const res = await qrService.verify(token);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Invalid or expired QR token. Verification failed.');
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Logo size="lg" className="mb-8" />
        <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
        <p className="text-gray-600">Verifying authenticity on blockchain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <Logo size="lg" className="mb-8" />
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary w-full block">Return Home</Link>
        </div>
      </div>
    );
  }

  const { batch, timeline } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-700 text-white p-6 pb-24">
        <div className="max-w-md mx-auto">
          <Logo size="md" variant="dark" />
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Authentic Product</h1>
            <p className="text-primary-100 mt-2">Verified on INOVIX Blockchain</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-16 pb-12 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Box className="w-5 h-5 text-primary-500"/> Product Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Product</span><span className="font-semibold">{batch.productName}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Batch ID</span><span className="font-mono">{batch.id}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Quantity</span><span>{batch.quantity} {batch.unit}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Producer</span><span>{batch.producer?.name || 'N/A'}</span></div>
            <div className="flex justify-between pb-2"><span className="text-gray-500">Status</span><span className="text-green-600 font-bold">{batch.status}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500"/> Journey Timeline</h2>
          <div className="space-y-6">
            {timeline.length === 0 ? <p className="text-gray-500">No events recorded.</p> : timeline.map((evt:any, idx:number) => (
              <div key={evt.id} className="flex gap-4 relative">
                {idx !== timeline.length - 1 && <div className="absolute top-8 left-[11px] w-0.5 h-full bg-gray-200"></div>}
                <div className="z-10 mt-1 bg-white"><CheckCircle className="w-6 h-6 text-green-500" /></div>
                <div>
                  <p className="font-bold text-gray-800">{evt.stage}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3"/> {new Date(evt.timestamp).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">{evt.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">Secured by INOVIX Farm-to-Fork Traceability Platform</p>
        </div>
      </div>
    </div>
  );
}
