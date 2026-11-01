import { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { useBookingAvailability } from '../../hooks/useBooking';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const SchedulePicker = ({ onNext, onBack }) => {
  const { bookingState, updateSchedule } = useBookingStore();
  const { data: availableDates, isLoading } = useBookingAvailability();

  const [selectedDate, setSelectedDate] = useState(bookingState.schedule.date || '');
  const [selectedSlot, setSelectedSlot] = useState(bookingState.schedule.timeSlot || '');
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveDate = selectedDate || (availableDates && availableDates.length > 0 ? availableDates[0].dateStr : '');

  const activeDateObj = availableDates?.find((d) => d.dateStr === effectiveDate);

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedSlot('');
    setErrorMsg('');
  };

  const handleSelectSlot = (slotLabel) => {
    setSelectedSlot(slotLabel);
    setErrorMsg('');
  };

  const handleContinue = () => {
    if (!effectiveDate) {
      setErrorMsg('Please select a preferred cleaning date');
      return;
    }
    if (!selectedSlot) {
      setErrorMsg('Please select a preferred time slot');
      return;
    }
    updateSchedule({ date: effectiveDate, timeSlot: selectedSlot });
    onNext();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Select Date & Time Slot</h2>
        <p className="text-xs text-slate-500">
          Pick your preferred day and time for our cleaners to arrive at your address.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Date Picker Scrollable List (Compact) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Select Cleaning Date</span>
              </label>
              {effectiveDate && (
                <span className="text-xs text-teal-700 font-bold">
                  Selected: {formatDate(effectiveDate)}
                </span>
              )}
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {availableDates?.map((item) => {
                const isSelected = effectiveDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => handleSelectDate(item.dateStr)}
                    className={`shrink-0 w-20 p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs font-bold'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block font-semibold opacity-80">
                      {item.dayName}
                    </span>
                    <span className="text-xl font-extrabold block my-0.5">{item.dayNumber}</span>
                    <span className="text-[10px] block font-medium opacity-90">{item.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker (Compact 5 Columns) */}
          {selectedDate ? (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Available Time Slots</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {activeDateObj?.slots.map((slot) => {
                  const isSlotSelected = selectedSlot === slot.label;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => slot.available && handleSelectSlot(slot.label)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        !slot.available
                          ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                          : isSlotSelected
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-2xs ring-1 ring-teal-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 cursor-pointer'
                      }`}
                    >
                      <span className="text-xs font-semibold block leading-tight">{slot.label}</span>
                      {slot.badge && (
                        <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-full inline-block mt-1">
                          {slot.badge}
                        </span>
                      )}
                      {!slot.available && (
                        <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full inline-block mt-1">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-center text-amber-800 text-xs">
              Please choose a cleaning date above to view available arrival time slots.
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="md" type="button" onClick={onBack}>
          ← Back
        </Button>
        <Button variant="primary" size="md" type="button" onClick={handleContinue}>
          Continue to Contact Details →
        </Button>
      </div>
    </div>
  );
};
