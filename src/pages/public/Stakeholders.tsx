import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, Building2, Factory, Warehouse, Truck, Store, Users, ShieldCheck
} from 'lucide-react';

export default function Stakeholders() {
  const roles = [
    {
      title: "Farmers",
      icon: <Sprout size={28} />,
      color: "bg-green-100 text-green-600 border-green-200",
      desc: "Create batches, attach IoT nodes, generate QR codes, monitor conditions at source.",
      features: ["Create Batch", "IoT Status", "Generate QR", "View My Batches"]
    },
    {
      title: "Collection Centres",
      icon: <Building2 size={28} />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
      desc: "Receive produce from farms, verify quality, aggregate batches for processing.",
      features: ["Incoming Batches", "Quality Verification", "Transfer Records"]
    },
    {
      title: "Food Processors",
      icon: <Factory size={28} />,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      desc: "Track processing events, manage batch transformations, anchor blockchain records.",
      features: ["Processing Events", "Batch Transformation", "Blockchain Records"]
    },
    {
      title: "Warehouses",
      icon: <Warehouse size={28} />,
      color: "bg-amber-100 text-amber-600 border-amber-200",
      desc: "Monitor storage conditions, manage inventory, ensure cold chain compliance.",
      features: ["Storage Monitoring", "IoT Alerts", "Inventory Management"]
    },
    {
      title: "Logistics Providers",
      icon: <Truck size={28} />,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      desc: "Track shipments, monitor temperature/humidity in transit, manage route data.",
      features: ["Active Shipments", "Condition Monitoring", "Location Tracking"]
    },
    {
      title: "Retailers",
      icon: <Store size={28} />,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      desc: "Verify received batches, access product history, offer QR verification to customers.",
      features: ["Batch Verification", "Product History", "Customer QR Access"]
    },
    {
      title: "Consumers",
      icon: <Users size={28} />,
      color: "bg-pink-100 text-pink-600 border-pink-200",
      desc: "Scan QR codes to view complete product journey from farm to shelf.",
      features: ["QR Scan", "Product Journey", "Verification Status"]
    },
    {
      title: "Regulators & Quality Teams",
      icon: <ShieldCheck size={28} />,
      color: "bg-red-100 text-red-600 border-red-200",
      desc: "Access traceability records, conduct audits, review compliance evidence.",
      features: ["Audit History", "Compliance Evidence", "Traceability Records"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Built for Every Stakeholder</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">One shared batch record — each stakeholder sees exactly what their role requires to ensure transparency and trust.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full group"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${role.color} group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow text-sm">{role.desc}</p>
              
              <div className="mt-auto">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {role.features.map((feat, j) => (
                    <span key={j} className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-primary-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Role-Based Access Control</h2>
              <p className="text-primary-100 mb-6 leading-relaxed">
                INOVIX employs strict Role-Based Access Control (RBAC). While the blockchain ensures the integrity of the overall batch history, sensitive commercial data is protected. 
              </p>
              <p className="text-primary-100 leading-relaxed">
                A warehouse operator sees detailed temperature logs while a batch is in their care, but cannot view processor pricing. Consumers see the macro-journey and verification flags, without exposing private stakeholder contact information.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-800/50 p-6 rounded-2xl border border-primary-700/50">
                <ShieldCheck className="text-primary-300 mb-3" size={32} />
                <h4 className="font-bold text-lg mb-1">Data Privacy</h4>
                <p className="text-sm text-primary-200">Commercial secrets remain secure.</p>
              </div>
              <div className="bg-primary-800/50 p-6 rounded-2xl border border-primary-700/50">
                <Users className="text-primary-300 mb-3" size={32} />
                <h4 className="font-bold text-lg mb-1">Tailored UX</h4>
                <p className="text-sm text-primary-200">Simplified interfaces for each specific role.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
