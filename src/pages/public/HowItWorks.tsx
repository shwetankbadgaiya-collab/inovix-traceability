import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Cpu, QrCode, Wifi, Shield, Map, ScanLine, ChevronDown, ChevronUp
} from 'lucide-react';

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const steps = [
    {
      title: "Sense at the Source",
      icon: <Cpu size={32} />,
      desc: "IoT sensors capture critical environmental data right at the farm or collection centre.",
      details: "Low-cost ESP32-based sensor nodes are attached to batches. They continuously monitor temperature, humidity, and location, providing high-resolution ground truth data without requiring expensive enterprise hardware.",
      color: "text-blue-600 bg-blue-100 border-blue-200"
    },
    {
      title: "Identify",
      icon: <QrCode size={32} />,
      desc: "Each physical consignment is assigned a unique digital identity.",
      details: "A unique Batch ID is generated and printed as a QR code label. This label travels with the physical product, serving as the bridge between the physical consignment and its digital twin in the cloud.",
      color: "text-gray-800 bg-gray-100 border-gray-300"
    },
    {
      title: "Connect",
      icon: <Wifi size={32} />,
      desc: "Sensor data and events are transmitted securely to the backend infrastructure.",
      details: "Our edge nodes feature offline-first capabilities. If connectivity (Wi-Fi, Cellular, LoRa) is lost during transport, data is buffered locally and automatically synchronized once a connection is re-established, ensuring zero data loss.",
      color: "text-green-600 bg-green-100 border-green-200"
    },
    {
      title: "Verify & Record",
      icon: <Shield size={32} />,
      desc: "Key milestone events are permanently anchored to a permissioned blockchain.",
      details: "When ownership transfers or processing occurs, the event is recorded on a tamper-evident blockchain ledger. While the blockchain ensures record integrity, device authentication algorithms verify that sensor data originated from verified INOVIX nodes.",
      color: "text-purple-600 bg-purple-100 border-purple-200"
    },
    {
      title: "Track",
      icon: <Map size={32} />,
      desc: "Stakeholders monitor the batch journey through role-specific dashboards.",
      details: "Farmers, processors, and retailers log into their portals to view active shipments. Automated alerts notify relevant parties if a batch experiences temperature excursions or delays, enabling proactive intervention.",
      color: "text-orange-600 bg-orange-100 border-orange-200"
    },
    {
      title: "Scan & Verify",
      icon: <ScanLine size={32} />,
      desc: "End consumers scan the QR code to verify the complete product journey.",
      details: "By scanning the QR code on the final retail packaging, consumers access a mobile-optimized public verification page. They can trace the product back to its origin farm and verify that storage conditions were maintained throughout its journey.",
      color: "text-primary-600 bg-primary-100 border-primary-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">How INOVIX Works</h1>
          <p className="text-xl text-gray-600">From field sensors to consumer verification in six connected steps</p>
        </div>

        <div className="relative border-l-4 border-gray-200 ml-8 md:ml-16 py-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-12 relative"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[42px] top-4 w-20 h-20 rounded-full border-4 border-white ${step.color} flex items-center justify-center shadow-lg z-10 transition-transform ${expandedStep === index ? 'scale-110' : ''}`}>
                {step.icon}
              </div>

              {/* Content Card */}
              <div 
                className={`ml-20 bg-white rounded-2xl shadow-sm border ${expandedStep === index ? 'border-primary-300 ring-2 ring-primary-100' : 'border-gray-100 hover:border-gray-300'} overflow-hidden cursor-pointer transition-all`}
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      <span className="text-gray-400 mr-2">{index + 1}.</span> 
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600">{step.desc}</p>
                  </div>
                  <div className="text-gray-400 ml-4">
                    {expandedStep === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedStep === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gray-50 px-6 py-4 border-t border-gray-100"
                    >
                      <p className="text-gray-700 leading-relaxed">{step.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/technology" className="btn-primary bg-primary-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-700 transition shadow-lg inline-flex items-center gap-2">
            <Cpu size={20} />
            See the Technology
          </Link>
        </div>
      </div>
    </div>
  );
}
