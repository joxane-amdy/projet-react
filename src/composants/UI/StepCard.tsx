type Props = {
  num: number;
  title: string;
  desc: string;
  isLast: boolean;
};

export default function StepCard({ num, title, desc, isLast }: Props) {
  return (
    <div className="relative flex flex-col items-center text-center">
      
      {!isLast && (
        <div className="hidden md:block absolute top-6 left-[calc(50%+2.5rem)] right-0 h-px border-t-2 border-dashed border-emerald-200" />
      )}

      <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
        {num}
      </div>

      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}