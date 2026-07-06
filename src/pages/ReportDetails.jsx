import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ReportDetails() {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [safeChecks, setSafeChecks] = useState({ safe: false, witness: false });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitReport({
        type: 'ACCIDENT', // Assume Accident based on UI
        description: remarks || 'No description provided',
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'Broadway & Chambers St, New York, NY',
        images: []
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
    <main className="pt-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pb-24">
      {/* Critical Badge */}
      <div className="mt-4 mb-6">
        <div className="bg-primary-container text-on-primary-container flex items-center gap-3 p-4 rounded-xl border-l-4 border-primary">
          <span className="material-symbols-outlined filled-icon" style={{ fontSize: '32px' }}>emergency_share</span>
          <div>
            <span className="font-sans uppercase tracking-widest block opacity-90" style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.05em', fontWeight: 800 }}>
              Priority Level: 0
            </span>
            <p className="font-sans" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>POLICE &amp; AMBULANCE REQUIRED</p>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column: GPS & Remarks */}
        <section className="md:col-span-7 lg:col-span-8 flex flex-col gap-gutter">
          {/* Map Card */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary filled-icon">location_on</span>
                <h2 className="font-sans text-on-surface" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>GPS Location</h2>
              </div>
              <button className="text-tertiary-container font-sans hover:underline" style={{ fontSize: '14px', fontWeight: 700 }}>Change Location</button>
            </div>
            <div className="relative h-64 w-full bg-surface-container overflow-hidden">
              <div className="w-full h-full bg-surface-dim"></div>
              {/* Map Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant p-3 rounded-lg shadow-sm">
                <p className="font-sans text-on-surface-variant uppercase mb-1" style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.05em', fontWeight: 800 }}>Current Coordinates</p>
                <p className="font-sans text-on-surface font-semibold" style={{ fontSize: '16px', lineHeight: '24px' }}>40.7128° N, 74.0060° W</p>
                <p className="text-on-surface-variant" style={{ fontSize: '14px' }}>Broadway &amp; Chambers St, New York, NY</p>
              </div>
              {/* Pulse Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="map-pulse absolute inset-0"></div>
                  <span className="material-symbols-outlined text-primary relative z-10 filled-icon" style={{ fontSize: '40px' }}>location_pin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-4">
            <label className="flex items-center gap-2 mb-3" htmlFor="remarks">
              <span className="material-symbols-outlined text-on-surface-variant">edit_note</span>
              <span className="font-sans text-on-surface" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>Additional Remarks</span>
            </label>
            <textarea
              id="remarks"
              className="w-full bg-background border-2 border-outline-variant rounded-lg p-4 font-sans focus:border-primary focus:outline-none transition-colors resize-none placeholder:text-on-surface-variant/40"
              style={{ fontSize: '16px', lineHeight: '24px' }}
              placeholder="Describe the situation, number of persons involved, or specific hazards..."
              rows={6}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              maxLength={1000}
            />
            <div className="flex justify-between mt-2">
              <span className="text-on-surface-variant" style={{ fontSize: '12px' }}>Min. 20 characters recommended</span>
              <span className={`${remarks.length > 900 ? 'text-primary font-bold' : 'text-on-surface-variant'}`} style={{ fontSize: '12px' }}>
                {remarks.length} / 1000
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Media & Safety */}
        <section className="md:col-span-5 lg:col-span-4 flex flex-col gap-gutter">
          {/* Upload Media */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-tertiary-container transition-colors min-h-[280px]">
            <div className="w-16 h-16 bg-tertiary-container/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary-container filled-icon" style={{ fontSize: '40px' }}>add_a_photo</span>
            </div>
            <h3 className="font-sans text-on-surface mb-2" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}>Upload Photo/Video</h3>
            <p className="text-on-surface-variant font-sans mb-6 px-4" style={{ fontSize: '14px' }}>Provide visual evidence to help responders prepare.</p>
            <button className="bg-surface border-2 border-tertiary-container text-tertiary-container font-sans py-3 px-8 rounded-full hover:bg-tertiary-container hover:text-on-tertiary transition-all active:scale-95" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
              Select Files
            </button>
          </div>

          {/* Safety Checklist */}
          <div className="bg-secondary-container/10 border-2 border-secondary-container rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary">security</span>
              <h4 className="font-sans text-on-secondary-fixed-variant" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>Safety Check</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="safe"
                  className="mt-1 rounded border-secondary-container accent-secondary"
                  checked={safeChecks.safe}
                  onChange={(e) => setSafeChecks({ ...safeChecks, safe: e.target.checked })}
                />
                <label className="font-sans text-on-surface" htmlFor="safe" style={{ fontSize: '14px' }}>I am in a safe location</label>
              </li>
              <li className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="witness"
                  className="mt-1 rounded border-secondary-container accent-secondary"
                  checked={safeChecks.witness}
                  onChange={(e) => setSafeChecks({ ...safeChecks, witness: e.target.checked })}
                />
                <label className="font-sans text-on-surface" htmlFor="witness" style={{ fontSize: '14px' }}>I am an active witness</label>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Submit Button */}
      <div className="mt-10 md:mt-12 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isSubmitted}
          className={`w-full md:max-w-2xl font-sans py-6 px-8 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-4 group ${
            isSubmitted
              ? 'bg-tertiary-container text-on-tertiary-container'
              : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
          }`}
          style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 700 }}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
              <span>Sending Emergency Report...</span>
            </>
          ) : isSubmitted ? (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>check_circle</span>
              <span>Report Submitted</span>
            </>
          ) : (
            <>
              <span>Submit Report</span>
              <span className="material-symbols-outlined filled-icon group-hover:translate-x-1 transition-transform" style={{ fontSize: '32px' }}>send</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
