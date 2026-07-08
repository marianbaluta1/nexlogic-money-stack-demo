type Props = {
  label: string;
  value: number;
  color?: string;
};

export function GlassCard({ label, value, color }: Props) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:shadow-lg transition">
      
      <div className="text-white/60 text-sm">{label}</div>

      <div className={`text-2xl font-semibold mt-2 ${color}`}>
        {value.toLocaleString()} RON
      </div>

    </div>
  );
}