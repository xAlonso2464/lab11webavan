"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDashboard } from "@/lib/dashboard-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import type { Priority, TaskStatus, Task } from "@/lib/types";

const schema = z.object({
  id: z.string().optional(),
  description: z.string().min(3),
  projectId: z.string().min(1),
  status: z.custom<TaskStatus>(),
  priority: z.custom<Priority>(),
  userId: z.string().min(1),
  dateline: z.date(),
});

export default function TaskForm({ initial }: { initial?: Task }) {
  const { state, dispatch } = useDashboard();
  const [open, setOpen] = useState(false);
  const isEdit = !!initial;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? {
      description: "",
      projectId: state.projects[0]?.id ?? "",
      status: "todo",
      priority: "medium",
      userId: state.members[0]?.userId ?? "",
      dateline: new Date(),
    },
  });

  function submit(v: z.infer<typeof schema>) {
    if (isEdit) dispatch({ type: "task/update", payload: v as Task });
    else dispatch({ type: "task/add", payload: { id: crypto.randomUUID(), ...v } as Task });
    setOpen(false); form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant={isEdit ? "secondary" : "default"} size={isEdit ? "sm" : "default"}>{isEdit ? "Editar" : "Nueva Tarea"}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isEdit ? "Editar tarea" : "Crear tarea"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="grid gap-3">
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Descripción</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="projectId" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Proyecto</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{state.projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage/></FormItem>
            )}/>
            <FormField name="userId" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Asignado a</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{state.members.map(m => <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage/></FormItem>
            )}/>
            <FormField name="status" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="todo">Por hacer</SelectItem>
                    <SelectItem value="in_progress">En progreso</SelectItem>
                    <SelectItem value="done">Hecha</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/></FormItem>
            )}/>
            <FormField name="priority" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Prioridad</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/></FormItem>
            )}/>
            <FormField name="dateline" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Fecha límite</FormLabel>
                <Calendar mode="single" selected={field.value} onSelect={(d)=>d && field.onChange(d)} className="rounded-md border"/>
                <FormMessage/></FormItem>
            )}/>
            <Button type="submit">{isEdit ? "Guardar cambios" : "Guardar"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
