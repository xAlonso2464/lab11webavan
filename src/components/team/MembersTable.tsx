"use client";
import { useDashboard } from "@/lib/dashboard-store";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import MemberForm from "./MemberForm";

export default function MembersTable() {
  const { state, dispatch } = useDashboard();
  return (
    <>
      <MemberForm /> {/* botón Nuevo miembro */}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.members.map(m => (
            <TableRow key={m.userId}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell>{state.projects.find(p => p.id === m.projectId)?.name || "-"}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <MemberForm initial={m} />
                <Button variant="destructive" size="sm" onClick={() => dispatch({ type: "member/delete", payload: m.userId })}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
