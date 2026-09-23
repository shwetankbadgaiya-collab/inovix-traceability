import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, Check, XCircle } from 'lucide-react';
import { alertService } from '../../services/alertService';

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAll();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (id: string) => {
    try {
      await alertService.acknowledge(id);
      fetchAlerts();
    } catch (err: any) {
      setError(err.message || 'Failed to acknowledge alert');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await alertService.resolve(id);
      fetchAlerts();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve alert');
    }
  };

  if (loading && alerts.length === 0) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">System Alerts</h1>

      {alerts.length === 0 ? (
        <div className="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100">No alerts found.</div>
      ) : (
        <div className="space-y-4">
          {alerts.map(a => (
            <div key={a.id} className={`p-4 rounded-xl border flex justify-between items-center bg-white shadow-sm ${!a.acknowledged ? 'border-l-4 border-l-red-500' : 'border-gray-200'}`}>
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-full ${a.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{a.type}</h3>
                  <p className="text-gray-600 text-sm">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()} {a.batchId && `| Batch: ${a.batchId}`} {a.iotNodeId && `| Node: ${a.iotNodeId}`}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!a.acknowledged && (
                  <button onClick={() => handleAcknowledge(a.id)} className="btn-secondary flex items-center gap-1 text-sm py-1.5"><Check className="w-4 h-4"/> Ack</button>
                )}
                {a.acknowledged && a.status !== 'RESOLVED' && (
                  <button onClick={() => handleResolve(a.id)} className="btn-secondary flex items-center gap-1 text-sm py-1.5 text-green-600 border-green-200 hover:bg-green-50"><XCircle className="w-4 h-4"/> Resolve</button>
                )}
                {a.status === 'RESOLVED' && <span className="text-sm font-medium text-green-600 px-3 py-1 bg-green-50 rounded">Resolved</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
