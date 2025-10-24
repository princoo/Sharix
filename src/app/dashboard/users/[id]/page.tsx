import { ContributionTrendChart } from "@/components/userDetails/contribution-trend-chart";
import { MonthlyPaymentTracker } from "@/components/userDetails/monthly-payment-tracker";
import { TransactionHistory } from "@/components/userDetails/transaction-history";
// import { UserActions } from "@/components/userDetails/user-actions";
import { UserSummaryHeader } from "@/components/userDetails/user-summary-header";

export default async function UserDetailsPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        <UserSummaryHeader userId={id} />
        <MonthlyPaymentTracker userId={id} />
        <ContributionTrendChart userId={id} />
        <TransactionHistory userId={id} />
        {/* <UserActions userId={id} /> */}
      </div>
    </div>
  );
}
