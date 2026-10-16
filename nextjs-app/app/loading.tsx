import { KalptaruLoader } from '@/components';

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#170617] text-ivory">
      <KalptaruLoader
        message="Harmonizing breath & consciousness..."
        subMessage="Kalptaruu Yoga Vidhyalaya"
        size={140}
      />
    </div>
  );
}
