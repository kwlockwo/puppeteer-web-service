
type ColorType = 'blue' | 'purple' | 'green' | 'orange';

interface ActionButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  color: ColorType;
  children: React.ReactNode;
}

export default function ActionButton({ onClick, loading, disabled, color, children }: ActionButtonProps) {
  const colorClasses: Record<ColorType, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full ${colorClasses[color]} text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
    >
      {children}
    </button>
  );
}
