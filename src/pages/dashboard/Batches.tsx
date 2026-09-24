import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Search, Filter, CheckCircle2, QrCode, ArrowRight, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { batchService } from '../../services/batchService';

interface BatchesProps {
  initialCreate?: boolean;
}

export default function Batches({ initialCreate = false }: BatchesProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  
  // Open create form if initialCreate is true or path is /dashboard/create-batch
  const [isCreating, setIsCreating] = useState(
    initialCreate || location.pathname.includes('create-batch')
  );

  const [newBatch, setNewBatch] = useState({
    productName: '',
    farmer: 'Rajesh Kumar',
    origin: 'Green Valley Farm',
    quantity: 500,
    unit: 'kg',
  });

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

  useEffect(() => {
    if (location.pathname.includes('create-batch')) {
      setIsCreating(true);
    }
  }, [location.pathname]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.productName.trim()) {
      setError('Please enter a product name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const created = await batchService.create(newBatch);
      setIsCreating(false);
      setNewBatch({ productName: '', farmer: 'Rajesh Kumar', origin: 'Green Valley Farm', quantity: 500, unit: 'kg' });
      setSuccessMsg(`Batch ${created.id} (${created.productName}) registered successfully!`);
      setTimeout(() => setSuccessMsg(''), 6000);
      await fetchBatches();
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Batches</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track farm-to-fork crop batches</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/qr')} 
            className="btn-secondary text-sm flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" /> Generate QR
          </button>
          <button 
            onClick={() => setIsCreating(true)} 
            className="btn-primary text-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Batch
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Create Batch Modal / Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary-200 mb-6 transition-all">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create New Traceability Batch</h2>
              <p className="text-xs text-gray-500">Record a new harvested crop lot at source</p>
            </div>
            <button 
              onClick={() => setIsCreating(false)} 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Product / Crop Name *
                </label>
                <input 
                  required 
                  type="text"
                  placeholder="e.g. Organic Tomatoes, Fresh Mangoes, Basmati Rice" 
                  value={newBatch.productName} 
                  onChange={e => setNewBatch({ ...newBatch, productName: e.target.value })} 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Origin / Farm Location
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Jabalpur Farm, Polyhouse #2" 
                  value={newBatch.origin} 
                  onChange={e => setNewBatch({ ...newBatch, origin: e.target.value })} 
                  className="input-field" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Quantity *
                </label>
                <input 
                  required 
                  type="number" 
                  min="1"
                  value={newBatch.quantity} 
                  onChange={e => setNewBatch({ ...newBatch, quantity: Math.max(1, +e.target.value) })} 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Unit
                </label>
                <select 
                  value={newBatch.unit} 
                  onChange={e => setNewBatch({ ...newBatch, unit: e.target.value })} 
                  className="input-field"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="tons">Tons</option>
                  <option value="crates">Crates</option>
                  <option value="L">L (Liters)</option>
                  <option value="units">Units</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Farmer / Producer
                </label>
                <input 
                  type="text" 
                  value={newBatch.farmer} 
                  onChange={e => setNewBatch({ ...newBatch, farmer: e.target.value })} 
                  className="input-field" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)} 
                className="btn-secondary text-sm px-4"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary text-sm px-6 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Register Batch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search batches by ID or product (e.g. Tomatoes, INVX-2026-001)..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="input-field pl-10 text-sm" 
          />
        </div>
        <div className="sm:w-56 relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            value={stageFilter} 
            onChange={e => setStageFilter(e.target.value)} 
            className="input-field pl-10 text-sm"
          >
            <option value="">All Supply Chain Stages</option>
            <option value="FARM">Farm</option>
            <option value="COLLECTION">Collection</option>
            <option value="PROCESSING">Processing</option>
            <option value="WAREHOUSE">Warehouse</option>
            <option value="TRANSPORT">Transport</option>
            <option value="RETAIL">Retail</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      {loading && batches.length === 0 ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
      ) : batches.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-base font-semibold text-gray-700">No batches match your filter.</p>
          <button onClick={() => { setSearch(''); setStageFilter(''); }} className="mt-3 text-primary-600 text-sm hover:underline">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Batch ID</th>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Farmer / Origin</th>
                  <th className="p-4 font-semibold">Quantity</th>
                  <th className="p-4 font-semibold">Current Stage</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {batches.map(b => (
                  <tr 
                    key={b.id} 
                    onClick={() => navigate(`/dashboard/batches/${b.id}`)} 
                    className="hover:bg-primary-50/40 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-primary-600">
                      {b.id}
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      {b.productName}
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>{b.farmer || 'Rajesh Kumar'}</div>
                      <div className="text-xs text-gray-400">{b.origin || 'Green Valley Farm'}</div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {b.quantity} {b.unit}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {b.currentStage}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'Delivered' 
                          ? 'bg-blue-100 text-blue-800' 
                          : b.status === 'In Transit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-primary-600 hover:text-primary-800 text-xs font-semibold inline-flex items-center gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
