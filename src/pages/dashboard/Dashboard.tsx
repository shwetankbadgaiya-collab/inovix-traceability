import React, { useState, useEffect } from 'react';
import { Loader2, Activity, Package, AlertTriangle, ShieldCheck } from 'lucide-react';
import { batchService } from '../../services/batchService';
import { iotService } from '../../services/iotService';
import { analyticsService } from '../../services/analyticsService';
import { alertService } from '../../services/alertService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

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
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Active Batches</p><p className="text-2xl font-bold">{data.batches.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mr-4"><Activity className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Active IoT Nodes</p><p className="text-2xl font-bold">{data.nodes.filter((n:any)=>n.status==='ONLINE').length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg mr-4"><AlertTriangle className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Active Alerts</p><p className="text-2xl font-bold">{data.alerts.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4"><ShieldCheck className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Verified Events</p><p className="text-2xl font-bold">{data.overview?.verifiedEvents || 0}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Recent Batches</h2>
          {data.batches.slice(0, 5).map((b:any) => (
            <div key={b.id} className="py-3 border-b last:border-0 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">{b.id}</p>
                <p className="text-sm text-gray-500">{b.productName} - {b.currentStage}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${b.status === 'GOOD' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
          {data.alerts.length === 0 ? <p className="text-gray-500 text-sm">No active alerts.</p> : data.alerts.slice(0,5).map((a:any) => (
            <div key={a.id} className="py-3 border-b last:border-0 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">{a.type}</p>
                <p className="text-sm text-gray-500">{a.message}</p>
              </div>
              <span className="text-xs text-red-600 font-medium">{a.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
