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
    <div className="flex justify-center gap-2 flex-wrap py-4">
      {dates.map((date) => {
        const dateStr = formatDate(date);
        const isSelected = dateStr === selectedDate;
        const today = isToday(date);

        return (
          <button
            key={dateStr}
            onClick={() => handleDateClick(date)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all min-w-[80px] ${
              isSelected
                ? 'bg-red-500 border-red-500 text-white shadow-lg scale-105'
                : today
                ? 'bg-yellow-400 border-yellow-400 text-gray-900 hover:bg-yellow-300'
                : 'bg-green-600 border-green-600 text-white hover:bg-green-500'
            }`}
          >
            <span className="text-xs font-semibold">
              {getMonthName(date, locale).slice(0, 3)}
            </span>
            <span className="text-2xl font-bold">{date.getDate()}</span>
            <span className="text-xs">{getLabel(date)}</span>
          </button>
        );
      })}
    </div>
  );
}
