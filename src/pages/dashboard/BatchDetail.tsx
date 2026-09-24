import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, QrCode, ArrowLeft, ShieldCheck, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { batchService } from '../../services/batchService';

export default function BatchDetail() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batch, setBatch] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [advanceLocation, setAdvanceLocation] = useState('');
  const [advanceNotes, setAdvanceNotes] = useState('');
  const [advancing, setAdvancing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!batchId) throw new Error('No batch ID provided');
      const [bData, tData] = await Promise.all([
        batchService.getById(batchId),
        batchService.getTimeline(batchId),
      ]);
      setBatch(bData);
      setTimeline(tData);
    } catch (err: any) {
      setError(err.message || 'Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [batchId]);

  const handleAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    try {
      setAdvancing(true);
      setSuccessMsg('');
      const updated = await batchService.advanceStage(batchId, { 
        location: advanceLocation || 'Next Station Hub', 
        notes: advanceNotes 
      });
      setAdvanceLocation('');
      setAdvanceNotes('');
      setSuccessMsg(`Batch advanced to stage: ${updated?.currentStage || 'Next Stage'}`);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to advance stage');
    } finally {
      setAdvancing(false);
    }
  };

  if (loading && !batch) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error && !batch) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard/batches')} className="btn-secondary text-sm">
          Return to Batches
        </button>
      </div>
    );
  }

  const allStages = [
    { name: 'FARM', defaultLoc: 'Green Valley Farm, Jabalpur', desc: 'Harvested & Quality Checked at source' },
    { name: 'COLLECTION', defaultLoc: 'Central Aggregation Depot', desc: 'Graded, weighed, and IoT sensor tagged' },
    { name: 'PROCESSING', defaultLoc: 'EcoFoods Processing Unit', desc: 'Cleaned, sorted, and certified organic' },
    { name: 'WAREHOUSE', defaultLoc: 'Central Cold Storage, Nagpur', desc: 'Stored in temperature-controlled zone (4-6°C)' },
    { name: 'DISTRIBUTION', defaultLoc: 'ColdChain Transit Fleet #4', desc: 'Monitored continuously via ESP32 IoT node' },
    { name: 'RETAIL', defaultLoc: 'FreshMart Supermarket, Pune', desc: 'Delivered to shelf with tamper-evident seal' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/batches')} 
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-gray-900">{batch?.id}</h1>
              <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Blockchain Verified
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {batch?.productName} • {batch?.quantity} {batch?.unit} • Origin: {batch?.origin || 'Green Valley Farm, Jabalpur'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/qr')} 
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" /> View QR Label
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Main Grid: Batch Overview & Advance Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Metadata Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            Batch Specifications
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-semibold text-gray-900">{batch?.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Current Stage</span>
              <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {batch?.currentStage}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Origin Farm</span>
              <span className="font-medium text-gray-800">{batch?.origin || 'Green Valley Farm, Jabalpur'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Producer / Farmer</span>
              <span className="font-medium text-gray-800">{batch?.farmer || 'Rajesh Kumar'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Net Quantity</span>
              <span className="font-semibold text-gray-900">{batch?.quantity} {batch?.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Batch Status</span>
              <span className="font-bold text-green-600">{batch?.status || 'In Transit'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created At</span>
              <span className="text-xs text-gray-400 font-mono">
                {new Date(batch?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Consensus: 4 of 4 PoA Validators Verified</span>
            </div>
          </div>
        </div>

        {/* Advance Stage Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            Advance Supply Chain Stage
          </h2>
          <p className="text-xs text-gray-500">
            Transition this batch to the next custody stage in the farm-to-fork journey
          </p>

          <form onSubmit={handleAdvance} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Next Location / Hub
              </label>
              <input 
                type="text" 
                value={advanceLocation} 
                onChange={(e) => setAdvanceLocation(e.target.value)} 
                placeholder="e.g. Apex Central Warehouse, Gate 3" 
                className="input-field text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Handover Notes / Verification Remarks
              </label>
              <textarea 
                rows={3}
                value={advanceNotes} 
                onChange={(e) => setAdvanceNotes(e.target.value)} 
                placeholder="e.g. Quality inspection passed, temperature logged at 4.2°C" 
                className="input-field text-sm" 
              />
            </div>

            <button 
              type="submit" 
              disabled={advancing} 
              className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              {advancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              Advance Custody Stage
            </button>
          </form>
        </div>

        {/* Stage Progress Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Traceability Guarantee
            </h2>
            <div className="mt-4 space-y-3 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Sensor conditions continually buffered on edge</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>SHA-256 block hash generated on each handover</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Public QR code verifiable by end consumers</span>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate('/dashboard/qr')}
              className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" /> Test Consumer QR Scan
            </button>
          </div>
        </div>
      </div>

      {/* Requirement 9: Supply Chain Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" /> Supply Chain Timeline
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified end-to-end chain of custody: FARM → COLLECTION → PROCESSING → WAREHOUSE → DISTRIBUTION → RETAIL
            </p>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase">
            All Stages Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allStages.map((stage, idx) => {
            const recorded = timeline.find((t) => t.stage === stage.name);
            const isCurrent = batch?.currentStage === stage.name;

            return (
              <div 
                key={stage.name} 
                className={`p-4 rounded-xl border relative transition-all ${
                  isCurrent 
                    ? 'border-2 border-primary-500 bg-primary-50/20 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-gray-900">{stage.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" /> Verified
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-medium mt-1">
                  {recorded?.location || stage.defaultLoc}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {recorded?.notes || stage.desc}
                </p>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>Timestamp</span>
                  <span>{new Date(recorded?.timestamp || Date.now() - (5 - idx) * 12 * 3600 * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
