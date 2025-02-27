"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    </main>
  );
}
