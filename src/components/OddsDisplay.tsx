interface OddsDisplayProps {
  value: string;
  highlighted?: boolean;
}

export default function OddsDisplay({ value, highlighted = false }: OddsDisplayProps) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded min-w-[40px] text-center ${
        highlighted
          ? 'bg-yellow-300 text-gray-900'
          : 'bg-odds-bg text-gray-800'
      }`}
    >
      {value}
    </span>
  );
}
