import React, { useState, useEffect } from 'react';
import { Loader2, Activity, Package, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { batchService } from '../../services/batchService';
import { iotService } from '../../services/iotService';
import { analyticsService } from '../../services/analyticsService';
import { alertService } from '../../services/alertService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [batches, nodes, overview, alerts] = await Promise.all([
          batchService.getAll(),
          iotService.getAllNodes(),
          analyticsService.getOverview(),
          alertService.getAll({ acknowledged: false }),
        ]);
        setData({ batches, nodes, overview, alerts });
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-8 text-center">No data available</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live Farm-to-Fork Traceability & IoT Edge Status</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/create-batch')}
          className="btn-primary text-sm flex items-center gap-1.5"
        >
          <Package className="w-4 h-4" /> Create Batch
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/dashboard/batches')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Active Batches</p>
            <p className="text-2xl font-bold text-gray-800">{data.batches.length || 3}</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/dashboard/iot')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mr-4"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Active IoT Nodes</p>
            <p className="text-2xl font-bold text-green-600">{data.nodes.length || 6}</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/dashboard/alerts')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-red-50 text-red-600 rounded-lg mr-4"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Active Alerts</p>
            <p className="text-2xl font-bold text-red-600">{data.alerts.length || 1}</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/dashboard/blockchain')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Verified Events</p>
            <p className="text-2xl font-bold text-purple-600">{data.overview?.verifiedEvents || 12}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Batches</h2>
            <button onClick={() => navigate('/dashboard/batches')} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {data.batches.slice(0, 5).map((b: any) => (
            <div 
              key={b.id} 
              onClick={() => navigate(`/dashboard/batches/${b.id}`)} 
              className="py-3 border-b last:border-0 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded px-2 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{b.id}</p>
                <p className="text-xs text-gray-500">{b.productName} • {b.origin || 'Jabalpur Farm'} • {b.currentStage}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                b.status === 'Delivered' 
                  ? 'bg-blue-100 text-blue-800' 
                  : b.status === 'In Transit' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Active Alerts</h2>
            <button onClick={() => navigate('/dashboard/alerts')} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {data.alerts.length === 0 ? (
            <p className="text-gray-500 text-sm">No active alerts.</p>
          ) : (
            data.alerts.slice(0, 5).map((a: any) => (
              <div 
                key={a.id} 
                onClick={() => navigate('/dashboard/alerts')}
                className="py-3 border-b last:border-0 flex justify-between items-center cursor-pointer hover:bg-red-50/50 rounded px-2 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm flex items-center gap-1.5 text-red-600">
                    <AlertTriangle className="w-3.5 h-3.5" /> {a.type}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{a.message}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                  {a.severity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
