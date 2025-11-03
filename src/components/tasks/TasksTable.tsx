"use client";
import { useMemo, useState } from "react";
import { useDashboard } from "@/lib/dashboard-store";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import TaskForm from "./TaskForm";

const PAGE_SIZE = 5;

export default function TasksTable() {
  const { state, dispatch } = useDashboard();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(state.tasks.length / PAGE_SIZE));
  const tasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return state.tasks.slice(start, start + PAGE_SIZE);
  }, [state.tasks, page]);

  return (
    <div className="space-y-4">
      <TaskForm /> {/* crear */}
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Asignado</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.description}</TableCell>
              <TableCell>{state.projects.find(p => p.id === t.projectId)?.name}</TableCell>
              <TableCell>{state.members.find(m => m.userId === t.userId)?.name}</TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>{t.priority}</TableCell>
              <TableCell>{t.dateline.toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <TaskForm initial={t} />
                <Button size="sm" variant="destructive" onClick={() => dispatch({ type: "task/delete", payload: t.id })}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} /></PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem><PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
