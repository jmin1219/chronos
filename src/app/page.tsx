import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TasksPage from "./(features)/tasks/page";
import HabitsPage from "./(features)/habits/page";
import DeepWorkPage from "./(features)/deepwork/page";

export default function Home() {
  return (
    <main className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Chronos Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your AI-powered personal productivity tracker!</p>
          <Button>Start Deep Work Session</Button>
        </CardContent>
      </Card>

      {/* TASKS */}
      <section>
        <TasksPage />
      </section>

      {/* HABITS */}
      <section>
        <HabitsPage />
      </section>

      {/* DEEP WORK */}
      <section>
        <DeepWorkPage />
      </section>
    </main>
  );
}
