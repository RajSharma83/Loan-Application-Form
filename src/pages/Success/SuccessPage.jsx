import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import AppShell from "../../layouts/AppShell";
import PageContainer from "../../layouts/PageContainer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function SuccessPage() {
  return (
    <AppShell>
      <PageContainer>
        <div className="mx-auto max-w-xl py-16">
          <Card className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Application Submitted
            </h1>

            <p className="mt-3 text-slate-500">
              Thank you. Your loan application has been received and is
              pending pre-approval review. You will be notified of the
              outcome by email and SMS.
            </p>

            <div className="mt-8">
              <Link to="/dashboard">
                <Button className="min-w-[200px]">Go to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}

export default SuccessPage;
