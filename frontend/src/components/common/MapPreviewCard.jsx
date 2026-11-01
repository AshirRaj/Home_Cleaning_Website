import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export const MapPreviewCard = ({
  address = 'Plot No. 302/3022, Sisupalgarh, Bhubaneswar, Odisha 751002.',
  googleMapsUrl = 'https://maps.app.goo.gl/A4yFufhvPtiUb4WXA',
  className = '',
  heightClassName = 'h-64 sm:h-80',
}) => {
  return (
    <motion.a
      href={googleMapsUrl}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`block relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group cursor-pointer bg-slate-900 ${className}`}
      title="Click to open location in Google Maps"
    >
      {/* Map Tile Embed Layer */}
      <div className={`relative ${heightClassName} w-full overflow-hidden`}>
        <iframe
          title="SAGARIKA ODICARE SERVICES Google Map"
          src="https://maps.google.com/maps?q=Plot%20No.%20124,%20Jayadev%20Vihar,%20Bhubaneswar,%20Odisha%20751013&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0 pointer-events-none opacity-90 group-hover:opacity-100 transition-all duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for Sleek Look */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Animated Map Pin Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="relative">
            <span className="w-10 h-10 rounded-full bg-teal-500/40 animate-ping absolute -top-1 -left-1" />
            <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
          </div>
          <span className="bg-slate-900/95 text-teal-300 text-xs font-extrabold px-3 py-1 rounded-full border border-teal-500/50 mt-1 shadow-xl whitespace-nowrap">
            SAGARIKA ODICARE SERVICES
          </span>
        </div>

        {/* Top Floating Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1.5 bg-slate-900/95 group-hover:bg-teal-500 group-hover:text-slate-950 text-teal-300 text-xs font-extrabold px-3 py-1.5 rounded-full border border-teal-500/50 shadow-xl transition-all">
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Bottom Banner Overlay on Hover */}
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-semibold text-white">Sisupalgarh, Bhubaneswar</span>
            </div>
            <span className="text-[11px] font-extrabold text-teal-400 underline">Click to Navigate 📍</span>
          </div>
        </div>
      </div>

      {/* Footer Address Info Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300 min-w-0">
          <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="truncate font-medium text-xs text-slate-300 group-hover:text-teal-300 transition-colors">
            {address}
          </span>
        </div>
        <span className="text-xs font-extrabold text-teal-400 shrink-0 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
          Odisha 751013
        </span>
      </div>
    </motion.a>
  );
};
