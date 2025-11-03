"use client";
import { useDashboard } from "@/lib/dashboard-store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProjectList() {
  const { state, dispatch } = useDashboard();

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {state.projects.map(p => {
        const members = state.members.filter(m => p.memberIds.includes(m.userId));
        return (
          <Card key={p.id} className="flex flex-col">
            <CardHeader><CardTitle>{p.name}</CardTitle></CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{p.description || "Sin descripción"}</p>
              <div className="mt-2 text-xs">Categoría: {p.category || "-"}</div>
              <div className="mt-2 text-xs">Miembros: {members.map(m => m.name).join(", ") || "Ninguno"}</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild><Button variant="secondary">Ver detalles</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Detalles de {p.name}</DialogTitle></DialogHeader>
                  <div className="space-y-1 text-sm">
                    <div><b>ID:</b> {p.id}</div>
                    <div><b>Creado:</b> {p.createdAt.toLocaleString()}</div>
                    <div><b>Miembros:</b> {members.map(m => m.name).join(", ") || "Ninguno"}</div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={() => dispatch({ type: "project/delete", payload: p.id })}>
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
