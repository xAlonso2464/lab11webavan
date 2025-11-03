"use client";
import { useDashboard } from "@/lib/dashboard-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SummaryCards() {
  const { state } = useDashboard();
  const totalProjects = state.projects.length;
  const totalTasks = state.tasks.length;
  const doneTasks = state.tasks.filter(t => t.status === "done").length;
  const activeMembers = state.members.filter(m => m.isActive).length;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card><CardHeader><CardTitle>Proyectos</CardTitle></CardHeader><CardContent className="text-3xl">{totalProjects}</CardContent></Card>
      <Card><CardHeader><CardTitle>Tareas</CardTitle></CardHeader><CardContent className="text-3xl">{totalTasks}</CardContent></Card>
      <Card><CardHeader><CardTitle>Completadas</CardTitle></CardHeader><CardContent className="text-3xl">{doneTasks}</CardContent></Card>
      <Card><CardHeader><CardTitle>Miembros activos</CardTitle></CardHeader><CardContent className="text-3xl">{activeMembers}</CardContent></Card>
    </div>
  );
}
