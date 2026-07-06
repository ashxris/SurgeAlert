import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function IncidentForm() {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checks, setChecks] = useState({ safe: false, emergency: false, anonymous: false });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitReport({
        type: 'ACCIDENT', // Based on the "CRITICAL" UI
        description: remarks || 'No description provided',
        latitude: 40.7128,
        longitude: -74.0060,
        address: '40.7128° N, 74.0060° W',
        images: [] // Future: attach actual files from drag & drop
      });
      setIsSubmitted(true);
      setTimeout(() => navigate('/report/confirmation'), 1500);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Submission failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-6 min-h-screen">
      {/* Header & Priority */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="font-sans text-on-surface mb-1" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Submit Incident Report
          </h1>
          <p className="text-on-surface-variant font-sans" style={{ fontSize: '16px', lineHeight: '24px' }}>Step 3: Final Details &amp; Evidence Submission</p>
        </div>
        <div className="bg-primary-container p-4 rounded-xl flex items-center gap-4 border-2 border-primary animate-pulse">
          <div className="bg-white rounded-full p-1 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary filled-icon" style={{ fontSize: '32px' }}>warning</span>
          </div>
          <div>
            <p className="text-on-primary-container font-sans uppercase tracking-widest opacity-80" style={{ fontSize: '10px', fontWeight: 700 }}>Calculated Priority</p>
            <p className="text-on-primary-container font-sans leading-none" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>CRITICAL LEVEL 4</p>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center w-full max-w-2xl mx-auto mb-10 px-4">
        {[{ n: 1, label: 'Type' }, { n: 2, label: 'Location' }, { n: 3, label: 'Evidence' }].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                s.n === 3
                  ? 'bg-primary text-on-primary outline outline-offset-2 outline-primary'
                  : 'bg-primary text-on-primary'
              }`}>
                {s.n}
              </div>
              <span className={`font-sans text-xs mt-1 ${s.n === 3 ? 'text-primary' : 'text-on-surface'}`} style={{ fontWeight: 700 }}>{s.label}</span>
            </div>
            {i < 2 && <div className="h-1 bg-primary flex-1 -mt-5"></div>}
          </div>
        ))}
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-surface-container border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-surface-container-high border-b-2 border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span className="font-sans" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>Incident Coordinates</span>
              </div>
              <span className="text-on-surface-variant font-mono" style={{ fontSize: '12px' }}>40.7128° N, 74.0060° W</span>
            </div>
            <div className="relative h-[400px] lg:h-[540px] w-full bg-surface-dim">
              {/* Map Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                <div className="bg-white/95 backdrop-blur-sm p-2 rounded border border-outline-variant text-xs flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>my_location</span>
                  <span>Verified via GPS Triangulation</span>
                </div>
              </div>
              {/* Pulse Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="map-pulse absolute inset-0"></div>
                  <span className="material-symbols-outlined text-primary relative z-10 filled-icon" style={{ fontSize: '40px' }}>location_pin</span>
                </div>
              </div>
            </div>
            <button className="w-full p-4 bg-surface-container-lowest text-primary font-sans hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
              <span className="material-symbols-outlined">edit_location</span>
              Re-adjust Location
            </button>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Remarks */}
          <section className="bg-white border-2 border-outline-variant p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary filled-icon">description</span>
              <h2 className="font-sans" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>Additional Remarks</h2>
            </div>
            <label className="block mb-1 text-on-surface-variant font-sans uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 700 }}>
              Detailed Description of Situation
            </label>
            <textarea
              className="w-full h-40 bg-surface-container-low border-2 border-outline p-4 rounded-lg focus:border-primary focus:outline-none transition-colors font-sans placeholder:text-outline"
              style={{ fontSize: '16px', lineHeight: '24px' }}
              placeholder="Provide as much detail as possible. Identify potential hazards, number of people involved, and any immediate threats."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </section>

          {/* Media Upload */}
          <section className="bg-white border-2 border-outline-variant p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary filled-icon">cloud_upload</span>
              <h2 className="font-sans" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>Upload Photo/Video</h2>
            </div>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors mb-4" style={{ fontSize: '48px' }}>add_a_photo</span>
              <p className="font-sans text-on-surface mb-1 text-center" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>Drag &amp; Drop visual evidence</p>
              <p className="text-on-surface-variant font-sans text-center" style={{ fontSize: '16px', lineHeight: '24px' }}>Support for JPG, PNG, MP4 (Max 50MB)</p>
              <button className="mt-6 px-10 py-4 border-2 border-primary text-primary font-sans rounded-lg hover:bg-primary hover:text-on-primary transition-all" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
                Browse Local Files
              </button>
            </div>
          </section>

          {/* Safety Check */}
          <section className="bg-white border-2 border-outline-variant p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary filled-icon">verified_user</span>
              <h2 className="font-sans" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>Safety Check</h2>
            </div>
            <div className="space-y-md">
              {[
                { id: 'safe', label: 'I am in a safe, secure location', desc: 'Confirming you are not in immediate physical danger while reporting.' },
                { id: 'emergency', label: 'Emergency services have been notified via 911', desc: 'This portal does not replace direct emergency service calls.' },
                { id: 'anonymous', label: 'Submit anonymously', desc: 'Your identity will be stripped from the metadata of this report.' },
              ].map((check) => (
                <label key={check.id} className="flex items-start gap-4 p-4 border-2 border-surface-container-high rounded-lg cursor-pointer hover:border-outline transition-colors">
                  <input
                    type="checkbox"
                    className="mt-1 w-6 h-6 accent-primary border-outline-variant rounded"
                    checked={checks[check.id]}
                    onChange={(e) => setChecks({ ...checks, [check.id]: e.target.checked })}
                  />
                  <div>
                    <p className="font-sans text-on-surface" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>{check.label}</p>
                    <p className="text-on-surface-variant" style={{ fontSize: '12px' }}>{check.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-10">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
              className={`w-full sm:flex-1 py-6 rounded-xl border-2 font-sans flex items-center justify-center gap-4 shadow-lg transition-all active:scale-[0.98] ${
                isSubmitted
                  ? 'bg-tertiary-container text-on-tertiary-container border-tertiary'
                  : 'bg-primary-container text-on-primary-container border-primary hover:brightness-110 shadow-primary/20'
              }`}
              style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              {isSubmitting ? (
                <>
                  PROCESSING...
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '32px' }}>sync</span>
                </>
              ) : isSubmitted ? (
                <>
                  REPORT SENT
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>check_circle</span>
                </>
              ) : (
                <>
                  SUBMIT REPORT
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>send</span>
                </>
              )}
            </button>
            <button className="w-full sm:w-auto px-10 py-6 border-2 border-outline text-on-surface-variant font-sans rounded-xl hover:bg-surface-container-high transition-colors" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
