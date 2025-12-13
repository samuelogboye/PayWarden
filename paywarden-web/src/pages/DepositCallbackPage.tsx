import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DepositStatus } from '@/components/deposit/DepositStatus';

export default function DepositCallbackPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <DepositStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}
