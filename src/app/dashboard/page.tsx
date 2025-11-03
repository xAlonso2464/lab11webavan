"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Usa los componentes reales que implementan la TAREA
import ProjectForm from "@/components/project/ProjectForm";
import ProjectList from "@/components/project/ProjectList";
import MembersTable from "@/components/team/MembersTable";
import TasksTable from "@/components/tasks/TasksTable";      // si tu archivo exporta “named”, cambia a { TasksTable }
import SettingsForm from "@/components/settings/SettingsForm";
import SummaryCards from "@/components/summary/SummaryCards";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Gestiona proyectos, equipo y tareas</p>
        </header>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* RESUMEN: métricas dinámicas (estado en memoria) */}
          <TabsContent value="overview" className="space-y-6">
            <SummaryCards />
          </TabsContent>

          {/* PROYECTOS: crear + miembros + ver detalles + eliminar */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nuevo Proyecto</CardTitle>
                <CardDescription>Usa el formulario para crear proyectos y asignar miembros.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proyectos</CardTitle>
                <CardDescription>Lista con detalles y acciones.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* EQUIPO: CRUD completo + Calendar (birthdate) */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del equipo</CardTitle>
                <CardDescription>Alta, edición y baja de miembros (con fecha de nacimiento).</CardDescription>
              </CardHeader>
              <CardContent>
                <MembersTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAREAS: CRUD completo + Calendar (dateline) + Pagination */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tareas</CardTitle>
                <CardDescription>Gestiona tareas por proyecto y usuario. Incluye paginación.</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONFIGURACIÓN: formulario con spinner (simula guardado) */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Preferencias del dashboard (tema, notificaciones, densidad).</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
