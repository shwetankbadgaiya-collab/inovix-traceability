import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { batchService } from '../../services/batchService';

export default function Batches() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newBatch, setNewBatch] = useState({ productName: '', quantity: 0, unit: 'kg' });
  const navigate = useNavigate();

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await batchService.getAll({ search, stage: stageFilter });
      setBatches(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [search, stageFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await batchService.create(newBatch);
      setIsCreating(false);
      setNewBatch({ productName: '', quantity: 0, unit: 'kg' });
      fetchBatches();
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Batches</h1>
        <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Batch
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Batch</h2>
          <form onSubmit={handleCreate} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Product Name</label>
              <input required value={newBatch.productName} onChange={e=>setNewBatch({...newBatch, productName: e.target.value})} className="input-field" />
            </div>
            <div className="w-32">
              <label className="block text-sm text-gray-600 mb-1">Quantity</label>
              <input required type="number" value={newBatch.quantity} onChange={e=>setNewBatch({...newBatch, quantity: +e.target.value})} className="input-field" />
            </div>
            <div className="w-32">
              <label className="block text-sm text-gray-600 mb-1">Unit</label>
              <select value={newBatch.unit} onChange={e=>setNewBatch({...newBatch, unit: e.target.value})} className="input-field">
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="units">units</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary">Cancel</button>
          </form>
        </div>
      )}

      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search batches..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="w-48 relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="input-field pl-10">
            <option value="">All Stages</option>
            <option value="FARM">Farm</option>
            <option value="COLLECTION">Collection</option>
            <option value="PROCESSING">Processing</option>
            <option value="WAREHOUSE">Warehouse</option>
            <option value="TRANSPORT">Transport</option>
            <option value="RETAIL">Retail</option>
          </select>
        </div>
      </div>

      {loading && batches.length === 0 ? (
        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : batches.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl">No batches found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-medium">Batch ID</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Quantity</th>
                <th className="p-4 font-medium">Stage</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map(b => (
                <tr key={b.id} onClick={() => navigate(`/dashboard/batches/${b.id}`)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="p-4 font-medium text-primary-600">{b.id}</td>
                  <td className="p-4 text-gray-800">{b.productName}</td>
                  <td className="p-4 text-gray-600">{b.quantity} {b.unit}</td>
                  <td className="p-4 text-gray-600">{b.currentStage}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${b.status === 'GOOD' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
