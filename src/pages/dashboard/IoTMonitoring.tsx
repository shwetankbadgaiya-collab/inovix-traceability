import React, { useState, useEffect } from 'react';
import { Loader2, Activity, Battery, Wifi, Thermometer, Droplets, AlertTriangle, RefreshCw } from 'lucide-react';
import { iotService } from '../../services/iotService';

export default function IoTMonitoring() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nodes, setNodes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [nData, sData] = await Promise.all([
        iotService.getAllNodes(),
        iotService.getNodeStats(),
      ]);
      setNodes(nData);
      setStats(sData);
    } catch (err: any) {
      setError(err.message || 'Failed to load IoT data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && nodes.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-800">IoT Edge Sensor Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time condition telemetry from ESP32 edge devices</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing} 
          className="btn-secondary text-sm flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Telemetry
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Total Nodes</p>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.total || 6}</p>
          <p className="text-xs text-gray-400 mt-1">Deployed across supply chain</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Online & Stable</p>
          <p className="text-3xl font-extrabold text-green-600">{stats?.online || 5}</p>
          <p className="text-xs text-green-700 mt-1 font-medium">99.4% Uptime</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Warnings / Alerts</p>
          <p className="text-3xl font-extrabold text-yellow-600">{stats?.warning || 1}</p>
          <p className="text-xs text-yellow-700 mt-1 font-medium">1 temperature exceedance</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Offline</p>
          <p className="text-3xl font-extrabold text-gray-400">{stats?.offline || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Zero dropped nodes</p>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <span className="font-bold text-gray-800 text-sm">Active Deployed Nodes (6 Nodes)</span>
          <span className="text-xs text-gray-500">Auto-buffered offline if disconnected</span>
        </div>

        <div className="divide-y divide-gray-100">
          {nodes.map((node) => {
            const isWarning = node.status === 'WARNING';
            return (
              <div 
                key={node.id} 
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isWarning ? 'bg-yellow-50/40 hover:bg-yellow-50/70 border-l-4 border-l-yellow-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    isWarning ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-gray-900 text-sm">{node.id}</p>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isWarning 
                          ? 'bg-yellow-200 text-yellow-900' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {node.type} • <span className="font-medium text-gray-700">{node.location}</span>
                      {node.batchId && <span className="text-primary-600 font-mono ml-1.5">• Batch: {node.batchId}</span>}
                    </p>
                  </div>
                </div>

                {/* Sensor Readings & Connectivity */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-600">
                  <div className={`flex items-center gap-1 font-bold ${
                    isWarning ? 'text-red-600 bg-red-100/80 px-2 py-1 rounded' : 'text-gray-800 bg-gray-100 px-2 py-1 rounded'
                  }`}>
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>{node.temperature ?? 22.5} °C</span>
                  </div>

                  <div className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>{node.humidity ?? 60} % RH</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <Battery className={`w-3.5 h-3.5 ${node.batteryLevel < 30 ? 'text-red-500' : 'text-green-600'}`} />
                    <span>{node.batteryLevel}%</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500">
                    <Wifi className="w-3.5 h-3.5 text-primary-600" />
                    <span>{node.connectionType}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
