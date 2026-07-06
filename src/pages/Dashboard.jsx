import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { getRelativeTime } from '../utils/time';

export default function Dashboard() {
  const cardsRef = useRef([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await api.getReports();
        // Map API data to UI format
        const formatted = data.map(r => ({
          id: r.id,
          title: r.type === 'ACCIDENT' ? 'Collision' : 'Traffic Issue',
          description: r.description,
          severity: r.type === 'ACCIDENT' ? 'Critical' : 'Caution', // Assume all traffic are caution for now
          distance: r.location?.address || 'Unknown location',
          time: getRelativeTime(r.created_at),
          badgeClass: r.type === 'ACCIDENT' ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container',
          barColor: r.type === 'ACCIDENT' ? 'bg-primary' : 'bg-secondary-container',
          hoverBorder: r.type === 'ACCIDENT' ? 'hover:border-primary' : 'hover:border-secondary',
        }));
        setRecentReports(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  useEffect(() => {
    if (loading) return;
    const cards = cardsRef.current;
    cards.forEach((card) => {
      if (!card) return;
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 10px 20px -10px rgba(0,0,0,0.1)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      });
    });
  }, [loading, recentReports]);

  return (
    <div className="flex-grow flex flex-col min-w-0">
      {/* Mobile Header */}
      <header className="h-20 px-margin-mobile md:px-margin-desktop w-full max-w-max-width mx-auto flex justify-between items-center bg-surface sticky top-0 z-40 md:hidden">
        <h1 className="font-sans font-black text-primary" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}>SurgeAlert</h1>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary">notifications</span>
          <span className="material-symbols-outlined text-primary">settings</span>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-grow p-4 lg:p-margin-desktop max-w-max-width mx-auto w-full">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full w-fit mb-4">
              <span className="material-symbols-outlined filled-icon" style={{ fontSize: '14px' }}>gpp_maybe</span>
              <span className="font-sans uppercase" style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.05em', fontWeight: 800 }}>Immediate Action Required</span>
            </div>
            <h2 className="font-sans mb-4 leading-tight" style={{ fontSize: '48px', lineHeight: '56px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Critical incidents detected in your <span className="text-primary underline decoration-4 underline-offset-8">vicinity</span>.
            </h2>
            <p className="font-sans text-on-surface-variant max-w-2xl mb-6" style={{ fontSize: '18px', lineHeight: '28px' }}>
              SurgeAlert connects real-time citizen reporting with emergency dispatch. All reports are encrypted and support 100% anonymity for public safety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/report"
                className="bg-primary text-on-primary px-10 py-6 rounded-lg font-sans flex items-center justify-center gap-4 pulse-critical"
                style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600, boxShadow: '0 8px 0 0 #93000b' }}
              >
                <span className="material-symbols-outlined filled-icon" style={{ fontSize: '32px' }}>report_problem</span>
                REPORT INCIDENT
              </Link>
              <button className="bg-secondary-container text-on-secondary-container px-10 py-6 rounded-lg font-sans border-2 border-secondary hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-4" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>contact_support</span>
                VIEW GUIDELINES
              </button>
            </div>
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-4 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary-fixed-dim rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-surface-container-high rounded-xl border-2 border-outline-variant overflow-hidden h-full min-h-[300px]">
              <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur-sm p-2 rounded border border-outline-variant font-sans" style={{ fontSize: '12px', fontWeight: 700 }}>
                LIVE INCIDENT MAP
              </div>
              <div className="w-full h-full bg-surface-dim"></div>
              {/* Decorative pins */}
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary rounded-full border-2 border-white pulse-critical"></div>
              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-secondary-fixed-dim rounded-full border-2 border-white"></div>
              <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="font-sans text-on-surface" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}>Recent Reports Nearby</h3>
              <p className="text-on-surface-variant">Last updated: 2 minutes ago</p>
            </div>
            <Link to="#" className="text-primary font-sans flex items-center gap-1 hover:underline" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
              View All Reports
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading && <p className="text-on-surface-variant font-sans col-span-full">Loading live reports...</p>}
            {error && <p className="text-error font-sans col-span-full">Error: {error}</p>}
            {!loading && !error && recentReports.length === 0 && (
              <p className="text-on-surface-variant font-sans col-span-full">No recent reports found.</p>
            )}
            {!loading && !error && recentReports.map((report, i) => (
              <div
                key={report.id}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden flex transition-all ${report.hoverBorder} ${report.opacity || ''}`}
              >
                <div className={`w-3 ${report.barColor}`}></div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`${report.badgeClass} font-sans px-2 py-[2px] rounded uppercase`} style={{ fontSize: '10px', fontWeight: 800 }}>
                      {report.severity}
                    </span>
                    <span className="text-on-surface-variant font-sans" style={{ fontSize: '12px', fontWeight: 700 }}>{report.distance}</span>
                  </div>
                  <h4 className="font-sans mb-1" style={{ fontSize: '18px', fontWeight: 700 }}>{report.title}</h4>
                  <p className="text-on-surface-variant mb-4" style={{ fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-outline font-sans flex items-center gap-1" style={{ fontSize: '12px', fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span> {report.time}
                    </span>
                    <button className={`font-sans hover:underline ${report.severity === 'Resolved' ? 'text-on-surface-variant cursor-default' : 'text-primary'}`} style={{ fontSize: '12px', fontWeight: 700 }}>
                      {report.severity === 'Resolved' ? 'Closed' : 'Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 h-fit">
          <div className="md:col-span-2 bg-inverse-surface text-surface rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-grow">
              <h4 className="font-sans mb-2" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>Advanced Anonymous Verification</h4>
              <p className="text-surface-variant mb-4 max-w-lg" style={{ fontSize: '16px', lineHeight: '24px' }}>
                Our proprietary SurgeLink technology verifies reports using multispectral sensor data while purging all PII from the blockchain ledger.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed-dim filled-icon">verified_user</span>
                  <span className="font-sans" style={{ fontSize: '12px', fontWeight: 700 }}>Zero-Knowledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-fixed-dim filled-icon">security</span>
                  <span className="font-sans" style={{ fontSize: '12px', fontWeight: 700 }}>AES-256 Encrypted</span>
                </div>
              </div>
            </div>
            <div className="w-48 h-48 bg-surface-container-high/10 rounded-full flex items-center justify-center border border-surface/20">
              <span className="material-symbols-outlined text-primary-fixed-dim filled-icon" style={{ fontSize: '64px' }}>privacy_tip</span>
            </div>
          </div>
          <div className="bg-primary text-on-primary rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-sans mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>Volunteer Dispatch</h4>
              <p className="text-on-primary-container" style={{ fontSize: '14px' }}>Join 12,000+ local responders who help triage reports before they reach 911 services.</p>
            </div>
            <button className="bg-on-primary text-primary w-full py-4 rounded font-sans mt-4 hover:bg-primary-container hover:text-on-primary-container transition-all" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
              BECOME A VOLUNTEER
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
