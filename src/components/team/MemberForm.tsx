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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import type { Member } from "@/lib/types";

const schema = z.object({
  userId: z.string().min(1),
  role: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  position: z.string().min(1),
  birthdate: z.date(),
  phone: z.string().min(6),
  projectId: z.string().optional(),
  isActive: z.boolean(),
});

export default function MemberForm({ initial }: { initial?: Member }) {
  const { state, dispatch } = useDashboard();
  const [open, setOpen] = useState(false);
  const isEdit = !!initial;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? {
      userId: "", role: "dev", name: "", email: "", position: "",
      birthdate: new Date(), phone: "", projectId: state.projects[0]?.id, isActive: true,
    },
  });

  function submit(v: z.infer<typeof schema>) {
    if (isEdit) dispatch({ type: "member/update", payload: v as Member });
    else dispatch({ type: "member/add", payload: v as Member });
    setOpen(false); form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant={isEdit ? "secondary" : "default"} size="sm">{isEdit ? "Editar" : "Nuevo miembro"}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isEdit ? "Editar miembro" : "Miembro del equipo"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="grid gap-3">
            <FormField name="userId" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>User ID</FormLabel><FormControl><Input {...field} disabled={isEdit}/></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field}/></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="position" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Puesto</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="role" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Rol</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="dev">Dev</SelectItem><SelectItem value="pm">PM</SelectItem><SelectItem value="qa">QA</SelectItem></SelectContent>
                </Select>
                <FormMessage/></FormItem>
            )}/>
            
            <FormField
  name="projectId"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Proyecto</FormLabel>
      <Select
        // si el valor es undefined, mostramos "none" solo para el control visual
        value={field.value ?? "none"}
        // al elegir "none", guardamos undefined en el form (no "")
        onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sin proyecto" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {/* ⬇️ ANTES: <SelectItem value="">Ninguno</SelectItem>  ❌ */}
          <SelectItem value="none">Ninguno</SelectItem> {/* ✅ */}
          {state.projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


            
            <FormField name="phone" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="birthdate" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Fecha de nacimiento</FormLabel>
                <Calendar mode="single" selected={field.value} onSelect={(d)=>d && field.onChange(d)} className="rounded-md border"/>
                <FormMessage/></FormItem>
            )}/>
            <FormField name="isActive" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Activo</FormLabel>
                <div className="flex items-center gap-2">
                  <Checkbox checked={field.value} onCheckedChange={(v)=>field.onChange(Boolean(v))}/>
                  <span className="text-sm text-muted-foreground">Miembro activo</span>
                </div>
                <FormMessage/></FormItem>
            )}/>
            <Button type="submit">{isEdit ? "Guardar cambios" : "Guardar"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
