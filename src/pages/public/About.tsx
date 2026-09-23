import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Info } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          >
            About INOVIX
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl text-primary-600 font-medium"
          >
            Making Every Food Journey Visible, Verifiable & Affordable
          </motion.p>
        </div>

        {/* Mission & Problem */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To democratize food supply chain traceability. We believe that verifiable, safe, and transparent food systems shouldn't be a luxury reserved for massive enterprises. Our goal is to make end-to-end traceability accessible to smallholder farmers and MSMEs globally.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Food supply chains are deeply fragmented. Critical data regarding storage conditions, origin, and processing is siloed. Existing enterprise traceability solutions rely on expensive hardware and high monthly fees, putting them out of reach for the majority of the world's food producers.
            </p>
          </div>
        </div>

        {/* Approach */}
        <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Approach</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-xl font-semibold text-gray-800">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">IoT Sensors</div>
            <div className="text-primary-500">+</div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">Permissioned Blockchain</div>
            <div className="text-primary-500">+</div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">QR Transparency</div>
            <div className="text-primary-500">=</div>
            <div className="bg-primary-600 text-white p-6 rounded-2xl shadow-md">Affordable Traceability</div>
          </div>
        </div>

        {/* Principles */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Principles</h2>
          <div className="space-y-6">
            {[
              { title: "Affordability", desc: "We utilize low-cost ESP32-class microcontrollers and commoditized sensors to keep hardware costs minimal." },
              { title: "Transparency", desc: "Consumers can verify the entire product journey simply by scanning a QR code with their standard smartphone camera." },
              { title: "Integrity", desc: "Key events and handovers are logged to a tamper-evident permissioned blockchain, establishing a single source of truth." },
              { title: "Accessibility", desc: "Offline-first buffering ensures the system works reliably even in remote agricultural regions with intermittent connectivity." },
              { title: "Scalability", desc: "Our cloud-native backend and modular edge nodes are designed to scale from localized pilots to national deployments." }
            ].map((principle, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle className="text-primary-500 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{principle.title}</h3>
                  <p className="text-gray-600 text-lg">{principle.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
          <Info className="text-amber-500 shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Prototype Notice</h4>
            <p className="text-amber-800">
              INOVIX is currently a prototype/demo platform developed for hackathon evaluation. The capabilities demonstrated in this application simulate a production environment. Performance metrics, exact hardware cost savings, and sensor accuracy figures require comprehensive pilot measurement and field validation before commercial deployment.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link to="/login" className="btn-primary bg-primary-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-700 transition shadow-lg inline-block">
            Explore the Platform
          </Link>
        </div>

      </div>
    </div>
  );
}
