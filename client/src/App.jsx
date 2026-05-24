import React, { useState } from 'react';

// Import Modular Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AsymmetricStack from './components/AsymmetricStack';
import Showcase from './components/Showcase';
import Footer from './components/Footer';

function App() {
  // Live Simulator States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Running, 2: Done

  // Run the visual E2E simulation sequence
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
      setIsSimulating(false);
    }, 3500); // 3.5 seconds total simulation time
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md overflow-x-hidden grid-bg">
      
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow flex flex-col pt-32 pb-20 px-4 md:px-16 w-full max-w-7xl mx-auto relative gap-32">
        
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-12 gap-6 px-4 md:px-16 opacity-20 z-0">
          <div className="border-x border-[#0F172A]/10"></div>
          <div className="border-x border-[#0F172A]/10"></div>
          <div className="border-x border-[#0F172A]/10"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
          <div className="border-x border-[#0F172A]/10 hidden md:block"></div>
        </div>

        {/* Hero & Stack Section */}
        <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Left Column: Hero Typography */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-12 pt-6 relative">
            {/* Decorative Top Border for alignment */}
            <div className="absolute top-0 left-0 w-16 h-px bg-[#0F172A] hidden md:block -mt-1"></div>
            
            <Hero 
              isSimulating={isSimulating}
              startSimulation={startSimulation}
            />
          </div>

          {/* Right Column: Code review illustrations stack */}
          <AsymmetricStack 
            simulationStep={simulationStep}
            isSimulating={isSimulating}
          />
        </section>

        {/* Features Showcase Section */}
        <Showcase />

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
