'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { getWeekDates, formatDate, isToday, isTomorrow, getMonthName } from '@/lib/utils';

interface DateSelectorProps {
  selectedDate: string;
}

export default function DateSelector({ selectedDate }: DateSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const dates = getWeekDates();

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    if (isToday(date)) {
      router.push('/');
    } else {
      router.push(`/predictions/${dateStr}`);
    }
  };

  const getLabel = (date: Date): string => {
    if (isToday(date)) return locale === 'tr' ? 'Bugün' : 'Today';
    if (isTomorrow(date)) return locale === 'tr' ? 'Yarın' : 'Tomorrow';
    const days: Record<string, string[]> = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    };
    return (days[locale] || days.en)[date.getDay()];
  };

  return (
    <div className="flex justify-center gap-2 md:gap-3 flex-wrap py-4">
      {dates.map((date) => {
        const dateStr = formatDate(date);
        const isSelected = dateStr === selectedDate;

        return (
          <button
            key={dateStr}
            onClick={() => handleDateClick(date)}
            className={`group flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-200 min-w-[76px] ${
              isSelected
                ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 border border-white/20'
            }`}
          >
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-emerald-100' : 'text-white/70'}`}>
              {getMonthName(date, locale).slice(0, 3)}
            </span>
            <span className="text-2xl font-black leading-tight">{date.getDate()}</span>
            <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-100' : 'text-white/80'}`}>
              {getLabel(date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
