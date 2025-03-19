import React from "react";
import DeepWorkTimer from "./components/deepwork-timer/DeepWorkTimer";
import NotesPanel from "./components/deepwork-notes/NotesPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarPanel from "./components/deepwork-calendar/CalendarPanel";

export default function DeepWorkPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex justify-center items-center p-3 border-r border-gray-700">
        <DeepWorkTimer />
      </div>
      <div className="w-1/2 p-3 flex flex-col">
        <Tabs defaultValue="notes" className="w-full h-full flex flex-col">
          <div className="flex justify-center">
            <TabsList className="w-1/2">
              <TabsTrigger value="notes" className="w-full">
                Notes
              </TabsTrigger>
              <TabsTrigger value="calendar" className="w-full">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="notes" className="flex-1 overflow-hidden">
            <NotesPanel />
          </TabsContent>
          <TabsContent value="calendar" className="flex-1 overflow-hidden">
            <CalendarPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
