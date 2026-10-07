import { connectDB } from '@/lib/db/mongoose';
import { InstituteService } from '@/lib/services/institute.service';
import { InstitutePage } from '@/views/InstitutePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialData: any = null;
  try {
    await connectDB();
    const inst = await InstituteService.getInstitute();
    if (inst) {
      initialData = JSON.parse(JSON.stringify(inst));
    }
  } catch (err) {
    console.warn('Could not SSR institute data:', err);
  }

  return <InstitutePage initialData={initialData || undefined} />;
}
