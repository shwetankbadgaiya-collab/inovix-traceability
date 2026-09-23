import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('7days');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [batches, iot, alerts] = await Promise.all([
          analyticsService.getBatchAnalytics(period),
          analyticsService.getIoTAnalytics(period),
          analyticsService.getAlertAnalytics(period)
        ]);
        setData({ batches, iot, alerts });
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading && !data) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="input-field w-auto">
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {!data ? <div className="p-8 text-center">No data.</div> : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-blue-600"><TrendingUp className="w-5 h-5"/> <h3 className="font-semibold">Batch Volume</h3></div>
              <p className="text-3xl font-bold text-gray-800">{data.batches?.totalBatches || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Total batches processed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-green-600"><Activity className="w-5 h-5"/> <h3 className="font-semibold">Avg Transit Time</h3></div>
              <p className="text-3xl font-bold text-gray-800">{data.batches?.avgTransitTimeDays || 0} days</p>
              <p className="text-sm text-gray-500 mt-1">Average time farm to retail</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-red-600"><BarChart3 className="w-5 h-5"/> <h3 className="font-semibold">Incident Rate</h3></div>
              <p className="text-3xl font-bold text-gray-800">{data.alerts?.incidentRatePercent || 0}%</p>
              <p className="text-sm text-gray-500 mt-1">Batches with critical alerts</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-semibold text-lg mb-4">API Data Structure Overview</h3>
             <pre className="bg-gray-50 p-4 rounded text-sm text-gray-600 overflow-x-auto">
                {JSON.stringify(data, null, 2)}
             </pre>
          </div>
        </div>
      )}
    </div>
  );
}
