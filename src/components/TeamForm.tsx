interface TeamFormProps {
  form: string;
}

export default function TeamForm({ form }: TeamFormProps) {
  const chars = form.split('').slice(0, 5);

  const getColor = (char: string) => {
    switch (char.toUpperCase()) {
      case 'W': return 'bg-win text-white';
      case 'D': return 'bg-draw text-gray-900';
      case 'L': return 'bg-loss text-white';
      default: return 'bg-gray-300 text-gray-500';
    }
  };

  return (
    <div className="flex gap-0.5">
      {chars.map((char, i) => (
        <span
          key={i}
          className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-sm ${getColor(char)}`}
        >
          {char.toUpperCase()}
        </span>
      ))}
    </div>
  );
}
