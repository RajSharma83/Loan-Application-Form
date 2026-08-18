import AppShell from "../../layouts/AppShell";
import AppHeader from "../../layouts/AppHeader";
import PageContainer from "../../layouts/PageContainer";
import Card from "../../components/ui/Card";

function Dashboard() {
  return (
    <AppShell>
      <PageContainer>
        <AppHeader
          title="Dashboard"
          subtitle="An overview of your loan applications will appear here."
          showSaveDraft={false}
        />

        <Card className="text-center text-slate-500">
          Dashboard content is not part of this build yet.
        </Card>
      </PageContainer>
    </AppShell>
  );
}

export default Dashboard;
