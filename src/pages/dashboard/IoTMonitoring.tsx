import React, { useState, useEffect } from 'react';
import { Loader2, Activity, Battery, Wifi } from 'lucide-react';
import { iotService } from '../../services/iotService';

export default function IoTMonitoring() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nodes, setNodes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [nData, sData] = await Promise.all([
          iotService.getAllNodes(),
          iotService.getNodeStats()
        ]);
        setNodes(nData);
        setStats(sData);
      } catch (err: any) {
        setError(err.message || 'Failed to load IoT data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">IoT Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Nodes</p>
          <p className="text-3xl font-bold text-gray-800">{stats?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Online</p>
          <p className="text-3xl font-bold text-green-600">{stats?.online || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Offline</p>
          <p className="text-3xl font-bold text-red-600">{stats?.offline || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Warnings</p>
          <p className="text-3xl font-bold text-yellow-600">{stats?.warning || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">Deployed Nodes</div>
        {nodes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No nodes deployed.</div>
        ) : (
          <div className="divide-y">
            {nodes.map(node => (
              <div key={node.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Activity className={`w-8 h-8 ${node.status === 'ONLINE' ? 'text-green-500' : node.status === 'WARNING' ? 'text-yellow-500' : 'text-red-500'}`} />
                  <div>
                    <p className="font-bold text-gray-800">{node.id}</p>
                    <p className="text-xs text-gray-500">Type: {node.type} | Loc: {node.location}</p>
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><Battery className="w-4 h-4"/> {node.batteryLevel}%</div>
                  <div className="flex items-center gap-1"><Wifi className="w-4 h-4"/> {node.connectionType}</div>
                  <div className={`font-medium ${node.status === 'ONLINE' ? 'text-green-600' : node.status === 'WARNING' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {node.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
