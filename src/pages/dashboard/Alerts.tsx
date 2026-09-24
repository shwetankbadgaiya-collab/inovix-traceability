import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, Check, XCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { alertService } from '../../services/alertService';
import { useNavigate } from 'react-router-dom';

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const navigate = useNavigate();

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

  if (loading && alerts.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Alerts & Breaches</h1>
          <p className="text-sm text-gray-500 mt-1">Automated environmental threshold monitoring and notifications</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}

      <div className="space-y-4">
        {alerts.map((a) => {
          const isCritical = a.severity === 'CRITICAL';
          const isResolved = a.status === 'RESOLVED';

          return (
            <div 
              key={a.id} 
              className={`p-5 rounded-2xl border transition-all bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isResolved 
                  ? 'border-gray-200 bg-gray-50/50' 
                  : isCritical 
                  ? 'border-l-4 border-l-red-500 border-red-200 bg-red-50/20' 
                  : 'border-l-4 border-l-yellow-500 border-yellow-200'
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  isResolved 
                    ? 'bg-green-100 text-green-700' 
                    : isCritical 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {isResolved ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{a.type}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isResolved 
                        ? 'bg-gray-200 text-gray-700' 
                        : isCritical 
                        ? 'bg-red-100 text-red-700 font-extrabold' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {a.severity}
                    </span>
                    {a.acknowledged && !isResolved && (
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Acknowledged
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm font-medium">{a.message}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-1 font-mono">
                    <span>{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {a.batchId && (
                      <span 
                        onClick={() => navigate(`/dashboard/batches/${a.batchId}`)}
                        className="text-primary-600 hover:underline cursor-pointer font-bold"
                      >
                        Batch: {a.batchId}
                      </span>
                    )}
                    {a.iotNodeId && (
                      <span 
                        onClick={() => navigate('/dashboard/iot')}
                        className="text-gray-600 hover:underline cursor-pointer"
                      >
                        Node: {a.iotNodeId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                {!a.acknowledged && !isResolved && (
                  <button 
                    onClick={() => handleAcknowledge(a.id)} 
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Acknowledge
                  </button>
                )}
                {!isResolved && (
                  <button 
                    onClick={() => handleResolve(a.id)} 
                    className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 bg-green-600 hover:bg-green-700"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Resolve Alert
                  </button>
                )}
                {isResolved && (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Resolved
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
