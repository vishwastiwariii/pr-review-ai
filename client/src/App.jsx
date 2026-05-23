import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import Modular Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SandboxForm from './components/SandboxForm';
import AsymmetricStack from './components/AsymmetricStack';
import Showcase from './components/Showcase';
import Footer from './components/Footer';

function App() {
  // Live Simulator States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Running, 2: Done

  // Backend Health Diagnostics
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [backendUptime, setBackendUptime] = useState(0);

  // Manual CLI Trigger Form State
  const [owner, setOwner] = useState('vishwastiwariii');
  const [repo, setRepo] = useState('multivendor-marketplace-backend');
  const [prNumber, setPrNumber] = useState('2');
  const [triggerStatus, setTriggerStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [triggerMessage, setTriggerMessage] = useState('');

  // Auto-run health diagnostics on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5001/health');
        if (response.data && response.data.status === 'OK') {
          setBackendStatus('online');
          setBackendUptime(response.data.uptime || 0);
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

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

  // Trigger manual PR review via Webhook / Server REST
  const handleManualTrigger = async (e) => {
    e.preventDefault();
    if (!prNumber || isNaN(parseInt(prNumber, 10))) {
      setTriggerStatus('error');
      setTriggerMessage('PR Number must be a positive integer.');
      return;
    }

    setTriggerStatus('submitting');
    setTriggerMessage('');

    try {
      const payload = {
        action: 'opened',
        number: parseInt(prNumber, 10),
        repository: {
          full_name: `${owner}/${repo}`,
          name: repo,
          owner: { login: owner },
          private: false,
          default_branch: 'main',
          html_url: `https://github.com/${owner}/${repo}`,
        },
        pull_request: {
          title: 'Manual Web UI Review Trigger',
          body: 'Triggered from the CodeFitsPR Landing Page.',
          state: 'open',
          draft: false,
          html_url: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
          diff_url: `https://github.com/${owner}/${repo}/pull/${prNumber}.diff`,
          head: { ref: 'feat/manual-trigger', sha: 'abc1234' },
          base: { ref: 'main', sha: 'def5678' },
          user: { login: owner },
        },
        sender: {
          login: owner
        }
      };

      const response = await axios.post('http://localhost:5001/webhooks/github', payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-github-event': 'pull_request',
          'x-github-delivery': 'web-ui-manual-trigger-' + Date.now(),
        }
      });

      if (response.status === 202) {
        setTriggerStatus('success');
        setTriggerMessage(`🎉 Review pipeline accepted for PR #${prNumber}! AI is reviewing in the background.`);
      } else {
        setTriggerStatus('error');
        setTriggerMessage(`Server returned status ${response.status}: ${response.data.message || 'Error triggering review.'}`);
      }
    } catch (err) {
      setTriggerStatus('error');
      const errorMsg = err.response?.data?.error?.message || err.message;
      setTriggerMessage(`❌ Trigger Failed: ${errorMsg}. Make sure your local Express server (port 5001) is running!`);
    }
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
          {/* Left Column: Hero Typography & API Manual Trigger sandbox */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-12 pt-6 relative">
            {/* Decorative Top Border for alignment */}
            <div className="absolute top-0 left-0 w-16 h-px bg-[#0F172A] hidden md:block -mt-1"></div>
            
            <Hero 
              isSimulating={isSimulating}
              startSimulation={startSimulation}
            />

            <SandboxForm 
              owner={owner}
              setOwner={setOwner}
              repo={repo}
              setRepo={setRepo}
              prNumber={prNumber}
              setPrNumber={setPrNumber}
              triggerStatus={triggerStatus}
              triggerMessage={triggerMessage}
              handleManualTrigger={handleManualTrigger}
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
