import { KalptaruLoader } from '@/components';

export default function AdminLoading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-[#170617] text-ivory py-16">
      <KalptaruLoader
        message="Loading Admin Management Sanctuary..."
        subMessage="Kalptaruu Yoga Vidhyalaya"
        size={130}
      />
    </div>
  );
}
