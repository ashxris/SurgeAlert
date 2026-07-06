import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { getRelativeTime } from '../utils/time';

export default function Landing() {
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await api.getReports();
        const formatted = data.slice(0, 3).map(r => ({
          id: r.id,
          title: r.type === 'ACCIDENT' ? 'Collision' : 'Traffic Issue',
          description: r.description,
          severity: r.type === 'ACCIDENT' ? 'CRITICAL' : 'CAUTION',
          distance: r.location?.address || 'Unknown location',
          time: getRelativeTime(r.created_at),
          badgeClass: r.type === 'ACCIDENT' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container',
          barColor: r.type === 'ACCIDENT' ? 'bg-primary' : 'bg-secondary',
        }));
        setRecentReports(formatted);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  useEffect(() => {
    if (loading || recentReports.length === 0) return;
    const interval = setInterval(() => {
      const cards = document.querySelectorAll('.report-card');
      if (cards.length === 0) return;
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      randomCard.classList.add('ring-2', 'ring-primary/20');
      setTimeout(() => {
        randomCard.classList.remove('ring-2', 'ring-primary/20');
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, recentReports]);

  return (
    <main className="pt-24 md:pt-8 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pb-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12 md:py-20 space-y-8">
        <div className="relative">
          {/* Background glow */}
          <div className="absolute -inset-4 bg-primary-container/10 rounded-full blur-3xl"></div>
          {/* Massive Report Button */}
          <Link
            to="/report"
            className="relative group emergency-pulse w-64 h-64 md:w-80 md:h-80 bg-primary-container text-on-primary-container rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:rotate-1 active:scale-90 hard-shadow border-4 border-on-primary-container"
          >
            <span className="material-symbols-outlined mb-2 filled-icon" style={{ fontSize: '64px' }}>
              emergency
            </span>
            <span className="font-sans uppercase tracking-tighter" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Report
            </span>
            <span className="font-sans uppercase opacity-90" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
              Incident
            </span>
          </Link>
        </div>
        <div className="max-w-md space-y-4">
          <p className="font-sans text-on-surface-variant leading-relaxed" style={{ fontSize: '18px', lineHeight: '28px' }}>
            Help authorities respond faster by reporting what you see. Your immediate input saves lives and streamlines emergency logistics.
          </p>
        </div>
      </section>

      {/* Recent Reports Nearby */}
      <section className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-on-surface flex items-center gap-2" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>
            <span className="material-symbols-outlined text-secondary">near_me</span>
            Recent Reports Nearby
          </h2>
          <Link to="#" className="text-primary font-sans hover:underline" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>View Map</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading && <p className="text-on-surface-variant font-sans col-span-full">Loading nearby reports...</p>}
          {!loading && recentReports.length === 0 && <p className="text-on-surface-variant font-sans col-span-full">No active reports nearby.</p>}
          {!loading && recentReports.map((report) => (
            <div
              key={report.id}
              className="report-card bg-surface-container-lowest border-2 border-outline-variant p-4 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start relative z-10">
                <span className={`${report.badgeClass} font-sans px-2 py-1 uppercase rounded-sm`} style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.05em', fontWeight: 800 }}>
                  {report.severity}
                </span>
                <span className="text-on-surface-variant font-sans" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>{report.distance}</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-sans text-on-surface" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>{report.title}</h3>
                <p className="text-on-surface-variant font-sans truncate" style={{ fontSize: '16px', lineHeight: '24px' }}>{report.description}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 relative z-10">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                <span className="font-sans" style={{ fontSize: '12px', fontWeight: 700 }}>{report.time}</span>
              </div>
              {/* Left Color Bar */}
              <div className={`absolute left-0 top-0 w-1 h-full ${report.barColor}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter py-8">
        <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-xl flex flex-col justify-end min-h-[200px] relative overflow-hidden group">
          <span className="material-symbols-outlined absolute top-4 right-4 opacity-20 transition-transform group-hover:scale-110" style={{ fontSize: '64px' }}>
            verified_user
          </span>
          <h4 className="font-sans mb-2" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}>Secure Verification</h4>
          <p className="font-sans" style={{ fontSize: '16px', lineHeight: '24px' }}>
            Reports are cross-referenced with local data feeds to ensure accuracy and reduce false alarms.
          </p>
        </div>
        <div className="bg-secondary-container text-on-secondary-container p-6 rounded-xl flex flex-col justify-end min-h-[200px] relative overflow-hidden group">
          <span className="material-symbols-outlined absolute top-4 right-4 opacity-20 transition-transform group-hover:scale-110" style={{ fontSize: '64px' }}>
            speed
          </span>
          <h4 className="font-sans mb-2" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}>Real-time Updates</h4>
          <p className="font-sans" style={{ fontSize: '16px', lineHeight: '24px' }}>
            Stay informed with millisecond-latency push notifications for alerts in your immediate radius.
          </p>
        </div>
      </section>
    </main>
  );
}
