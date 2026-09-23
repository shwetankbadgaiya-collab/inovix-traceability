import React, { useState, useEffect } from 'react';
import { Loader2, Link as LinkIcon, CheckCircle, Clock } from 'lucide-react';
import { blockchainService } from '../../services/blockchainService';

export default function Blockchain() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eData, sData] = await Promise.all([
          blockchainService.getAllEvents(),
          blockchainService.getStats()
        ]);
        setEvents(eData);
        setStats(sData);
      } catch (err: any) {
        setError(err.message || 'Failed to load blockchain data');
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
      <h1 className="text-2xl font-bold text-gray-800">Blockchain Ledger</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><LinkIcon className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Total Transactions</p><p className="text-2xl font-bold">{stats?.totalTransactions || events.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Verified</p><p className="text-2xl font-bold">{stats?.verifiedCount || events.filter((e:any)=>e.status==='VERIFIED').length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{stats?.pendingCount || events.filter((e:any)=>e.status==='PENDING').length}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">Recent Ledger Events</div>
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No blockchain events found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Tx Hash</th>
                <th className="p-4">Batch ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 font-mono">
                  <td className="p-4 text-primary-600 truncate max-w-[200px]">{e.transactionHash}</td>
                  <td className="p-4 text-gray-800">{e.batchId}</td>
                  <td className="p-4 text-gray-500">{new Date(e.timestamp).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${e.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
