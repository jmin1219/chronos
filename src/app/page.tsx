"use client";

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
        </CardContent>
      </Card>
    </main>
  );
}
