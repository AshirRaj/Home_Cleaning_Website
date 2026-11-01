import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { MapPreviewCard } from './MapPreviewCard';

export const LocationMapBanner = () => {
  const googleMapsUrl = 'https://maps.app.goo.gl/A4yFufhvPtiUb4WXA';

  return (
    <section className="bg-slate-950 text-white py-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left Info & Action */}
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Head Office Location • Odisha</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Visit Us in Sisupalgarh, Bhubaneswar
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plot No. 302/3022, Sisupalgarh, Bhubaneswar, Odisha 751002. Specialist home cleaning teams serving Bhubaneswar, Cuttack, Puri & Khorda.
            </p>
            <div className="pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Location in Google Maps 📍</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Wide Map Preview Card */}
          <div className="w-full lg:w-1/2">
            <MapPreviewCard
              googleMapsUrl={googleMapsUrl}
              heightClassName="h-36 sm:h-44"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
