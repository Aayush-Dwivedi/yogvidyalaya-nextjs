import { KalptaruLoader } from '@/components';

export default function PublicLoading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-[#170617] text-ivory py-16">
      <KalptaruLoader
        message="Harmonizing breath & consciousness..."
        subMessage="Kalptaruu Yoga Vidhyalaya"
        size={140}
      />
    </div>
  );
}
