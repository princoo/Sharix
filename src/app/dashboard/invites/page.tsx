import { InvitesSummary } from "@/components/custom/invites/invites-summary";
import { InvitesTable } from "@/components/custom/invites/invites-table";
import { SendInviteForm } from "@/components/custom/invites/send-invite-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invites Management | Manager Dashboard",
  description: "Manage and track all invitations",
};

export default function InvitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Invites Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Send, track, and manage all user invitations
        </p>
      </div>

      <InvitesSummary />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InvitesTable />
        </div>
        <div>
          <SendInviteForm />
        </div>
      </div>
    </div>
  );
}
