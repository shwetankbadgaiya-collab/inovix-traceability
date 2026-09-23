import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Building2, Factory, Warehouse, Truck, Store, Users, 
  Layers, ClipboardList, EyeOff, DollarSign, Clock,
  Cpu, QrCode, Wifi, Shield, Map, ScanLine, CheckCircle, Smartphone
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden" animate="visible" variants={containerVariants}
            className="space-y-8"
          >
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              From Farm to Fork, <br/>
              <span className="text-primary-600">Every Journey Verified.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-lg">
              Low-cost IoT, blockchain integrity and QR transparency for affordable farm-to-fork traceability.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary bg-primary-600 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-700 transition shadow-lg flex items-center">
                Explore Traceability
              </Link>
              <Link to="/verify" className="btn-secondary bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-full font-medium hover:border-gray-300 transition flex items-center gap-2 shadow-sm">
                <ScanLine size={20} />
                Scan a Batch
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Cpu className="text-blue-500" size={24} />, label: "IoT Enabled" },
                { icon: <Shield className="text-purple-500" size={24} />, label: "Blockchain Anchored" },
                { icon: <QrCode className="text-gray-800" size={24} />, label: "QR Verified" },
                { icon: <Wifi className="text-primary-500" size={24} />, label: "Offline First" },
              ].map((trust, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                    {trust.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{trust.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Supply Chain Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="badge-success bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>24°C</span>
              <span className="badge-info bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">61% RH</span>
            </div>
            
            <div className="space-y-6 relative mt-8">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 border-l-2 border-dashed border-gray-300"></div>
              
              {[
                { name: "FARM", icon: <Sprout size={20} />, color: "bg-green-100 text-green-600" },
                { name: "COLLECTION", icon: <Building2 size={20} />, color: "bg-emerald-100 text-emerald-600" },
                { name: "PROCESSING", icon: <Factory size={20} />, color: "bg-blue-100 text-blue-600" },
                { name: "WAREHOUSE", icon: <Warehouse size={20} />, color: "bg-amber-100 text-amber-600" },
                { name: "TRANSPORT", icon: <Truck size={20} />, color: "bg-orange-100 text-orange-600" },
                { name: "RETAIL", icon: <Store size={20} />, color: "bg-purple-100 text-purple-600" },
                { name: "CONSUMER", icon: <Users size={20} />, color: "bg-pink-100 text-pink-600" },
              ].map((stage, i) => (
                <div key={i} className="relative flex items-center gap-4 group">
                  <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-110`}>
                    {stage.icon}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm">{stage.name}</p>
                    <p className="text-xs text-gray-500">Verified Step</p>
                  </div>
                </div>
              ))}
              
              {/* Moving dot animation */}
              <motion.div 
                className="absolute left-5 w-4 h-4 bg-primary-500 rounded-full z-20 shadow-md"
                animate={{ top: ["5%", "95%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 lg:px-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">The Traceability Gap in the Food Supply Chain</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Traditional food supply chains suffer from critical blindspots, leading to waste, fraud, and a lack of consumer trust.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Layers />, title: "Data Fragmentation", desc: "Siloed data across disconnected stakeholders prevents end-to-end visibility." },
              { icon: <ClipboardList />, title: "Manual Records", desc: "Paper-based tracking is prone to errors, delays, and tampering." },
              { icon: <EyeOff />, title: "Limited Visibility", desc: "No real-time view into storage conditions or location during transit." },
              { icon: <DollarSign />, title: "High Cost", desc: "Existing solutions rely on expensive enterprise software and high-end sensors." },
              { icon: <Clock />, title: "Slow Identification", desc: "Identifying the source of a contaminated batch can take days or weeks." },
              { icon: <Users />, title: "Consumer Blindspot", desc: "Consumers are forced to rely solely on easily-falsified packaging labels." }
            ].map((problem, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <blockquote className="text-2xl font-medium text-gray-800 italic max-w-4xl mx-auto">
              "The challenge is not only traceability — it is affordable and trustworthy traceability."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Affordable Farm-to-Fork Traceability</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our hardware-software ecosystem bridges the physical and digital gap in six connected steps.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Cpu />, title: "Sense at the Source", desc: "Low-cost IoT nodes capture temperature, humidity, and location continuously." },
              { icon: <QrCode />, title: "Identify", desc: "Each consignment receives a unique Batch ID and scannable QR code." },
              { icon: <Wifi />, title: "Connect", desc: "Readings transmitted securely via available Wi-Fi, Cellular, or LoRa connectivity." },
              { icon: <Shield />, title: "Verify & Record", desc: "Key milestone events are validated and permanently anchored to the blockchain." },
              { icon: <Map />, title: "Track", desc: "Authorized stakeholders monitor batch journey and conditions in real-time." },
              { icon: <ScanLine />, title: "Scan & Verify", desc: "Buyers and consumers scan the QR code to verify the complete batch history." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 text-center relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-12 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Designed to Enable</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: "7", label: "Supply Chain Stages" },
              { val: "Real-Time", label: "Monitoring Alerts" },
              { val: "QR-Based", label: "Verification Access" },
              { val: "Offline-First", label: "Edge Operation" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl lg:text-5xl font-extrabold text-primary-400 mb-2">{stat.val}</p>
                <p className="text-lg text-primary-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Trace Your First Batch?</h2>
          <p className="text-xl text-gray-600 mb-10">Experience the complete farm-to-fork traceability journey with our interactive demo environment.</p>
          <Link to="/login" className="inline-block bg-primary-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-700 transition shadow-lg">
            Launch Demo Dashboard
          </Link>
        </div>
      </section>
      
    </div>
  );
}
