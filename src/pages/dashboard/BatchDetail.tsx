import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { batchService } from '../../services/batchService';
import { blockchainService } from '../../services/blockchainService';

export default function BatchDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batch, setBatch] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [bcEvents, setBcEvents] = useState<any[]>([]);
  const [advanceForm, setAdvanceForm] = useState({ location: '', notes: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('No batch ID provided');
      const [bData, tData, bcData] = await Promise.all([
        batchService.getById(id),
        batchService.getTimeline(id),
        blockchainService.getAllEvents({ batchId: id })
      ]);
      setBatch(bData);
      setTimeline(tData);
      setBcEvents(bcData);
    } catch (err: any) {
      setError(err.message || 'Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setLoading(true);
      await batchService.advanceStage(id, advanceForm);
      setAdvanceForm({ location: '', notes: '' });
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to advance stage');
      setLoading(false);
    }
  };

  if (loading && !batch) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!batch) return <div className="p-8 text-center text-gray-500">Batch not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{batch.id}</h1>
          <p className="text-gray-500">{batch.productName} • {batch.quantity} {batch.unit}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Current Stage</div>
          <div className="font-bold text-primary-600 text-lg">{batch.currentStage}</div>
          <div className="text-xs text-gray-400 mt-1">Status: {batch.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Advance Stage</h2>
          <form onSubmit={handleAdvance} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Location</label>
              <input required value={advanceForm.location} onChange={e=>setAdvanceForm({...advanceForm, location: e.target.value})} className="input-field" placeholder="e.g. Warehouse A, Mumbai" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Notes</label>
              <textarea value={advanceForm.notes} onChange={e=>setAdvanceForm({...advanceForm, notes: e.target.value})} className="input-field" rows={3}></textarea>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Advance to Next Stage'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Timeline</h2>
          <div className="space-y-4">
            {timeline.length === 0 ? <p className="text-gray-500">No events yet.</p> : timeline.map((evt, idx) => (
              <div key={evt.id} className="flex gap-3 relative">
                {idx !== timeline.length - 1 && <div className="absolute top-8 left-[11px] w-0.5 h-full bg-gray-200"></div>}
                <div className="z-10 mt-1 bg-white"><CheckCircle className="w-6 h-6 text-green-500" /></div>
                <div>
                  <p className="font-medium text-gray-800">{evt.stage}</p>
                  <p className="text-sm text-gray-500">{new Date(evt.timestamp).toLocaleString()} • {evt.location}</p>
                  {evt.notes && <p className="text-sm text-gray-600 mt-1">{evt.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
