import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Cpu, Wifi, Cloud, Link2, Monitor, ArrowDown } from 'lucide-react';

export default function Technology() {
  const layers = [
    {
      name: "SENSING LAYER",
      icon: <Thermometer size={28} />,
      items: ["Temperature Sensors", "Humidity Sensors", "GPS/Location", "Crop-Specific Sensors"],
      color: "bg-primary-50 border-primary-200 text-primary-900",
      iconBg: "bg-primary-100 text-primary-600"
    },
    {
      name: "EDGE NODE LAYER",
      icon: <Cpu size={28} />,
      items: ["ESP32 Microcontroller", "Local Data Storage", "Power Management", "Offline Buffering"],
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
      iconBg: "bg-emerald-100 text-emerald-600"
    },
    {
      name: "CONNECTIVITY LAYER",
      icon: <Wifi size={28} />,
      items: ["Wi-Fi", "Cellular (4G/5G)", "LoRa/LoRaWAN", "Bluetooth"],
      color: "bg-amber-50 border-amber-200 text-amber-900",
      iconBg: "bg-amber-100 text-amber-600"
    },
    {
      name: "CLOUD / BACKEND LAYER",
      icon: <Cloud size={28} />,
      items: ["REST API", "Time-Series Database", "Authentication", "Data Processing Pipeline"],
      color: "bg-blue-50 border-blue-200 text-blue-900",
      iconBg: "bg-blue-100 text-blue-600"
    },
    {
      name: "BLOCKCHAIN LAYER",
      icon: <Link2 size={28} />,
      items: ["Permissioned Network", "Event Logging", "Tamper-Evident Records", "Smart Contracts"],
      color: "bg-purple-50 border-purple-200 text-purple-900",
      iconBg: "bg-purple-100 text-purple-600",
      note: "Blockchain protects record integrity. Sensor accuracy depends on calibration and device authentication."
    },
    {
      name: "INTERFACE LAYER",
      icon: <Monitor size={28} />,
      items: ["Web Dashboard", "Mobile Interface", "QR Verification Portal", "Analytics"],
      color: "bg-gray-50 border-gray-200 text-gray-900",
      iconBg: "bg-gray-200 text-gray-700"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Technology Architecture</h1>
          <p className="text-xl text-gray-600">Purpose-built for affordable, connected traceability</p>
        </div>

        <div className="space-y-4 relative">
          {layers.map((layer, index) => (
            <React.Fragment key={index}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`p-6 rounded-2xl border-2 ${layer.color} shadow-sm flex flex-col md:flex-row items-center gap-6`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${layer.iconBg}`}>
                  {layer.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold tracking-wide mb-3">{layer.name}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {layer.items.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium border border-white/40">
                        {item}
                      </span>
                    ))}
                  </div>
                  {layer.note && (
                    <p className="mt-4 text-sm font-medium opacity-80 italic border-l-2 pl-3 border-current">
                      Note: {layer.note}
                    </p>
                  )}
                </div>
              </motion.div>
              
              {index < layers.length - 1 && (
                <div className="flex justify-center -my-2 relative z-10">
                  <ArrowDown className="text-gray-300 animate-pulse bg-white rounded-full" size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Key Technical Differentiators</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Cpu className="text-primary-600"/> Low-Cost Hardware</h3>
              <p className="text-gray-600">By utilizing ESP32-class microcontrollers rather than expensive enterprise gateways, we drastically reduce the barrier to entry for smallholder farmers and MSMEs.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Wifi className="text-blue-600"/> Offline-First Design</h3>
              <p className="text-gray-600">Nodes buffer data locally in persistent storage during connectivity drops (common in rural areas or during transport), synchronizing seamlessly when connection is restored.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Monitor className="text-emerald-600"/> Multi-Connectivity</h3>
              <p className="text-gray-600">Modular design supports Wi-Fi, Cellular, or LoRa depending on deployment environment, ensuring flexibility across different supply chain segments.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Link2 className="text-purple-600"/> Permissioned Blockchain</h3>
              <p className="text-gray-600">Critical events are anchored to a permissioned ledger, providing cryptographically verifiable audit trails while protecting sensitive commercial data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
