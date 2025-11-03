"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDashboard } from "@/lib/dashboard-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  category: z.string().optional(),
  memberIds: z.array(z.string()).default([]),
});

export default function ProjectForm() {
  const { state, dispatch } = useDashboard();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", category: "", memberIds: [] },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // simula backend
    dispatch({
      type: "project/add",
      payload: {
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description,
        category: values.category,
        memberIds: values.memberIds,
        createdAt: new Date(),
      },
    });
    setSaving(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Nuevo Proyecto</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Crear proyecto</DialogTitle></DialogHeader>

        {state.error && (
          <Alert variant="destructive" className="mb-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Descripción</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="category" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Categoría</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField name="memberIds" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Miembros</FormLabel>
                <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg">
                  {state.members.length === 0 && (
                    <div className="text-xs text-muted-foreground col-span-2">Aún no hay miembros. Crea algunos en “Equipo”.</div>
                  )}
                  {state.members.map(m => {
                    const checked = field.value?.includes(m.userId);
                    return (
                      <label key={m.userId} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const next = new Set(field.value ?? []);
                            v ? next.add(m.userId) : next.delete(m.userId);
                            field.onChange(Array.from(next));
                          }}
                        />
                        {m.name}
                      </label>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}/>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? <Spinner className="h-4 w-4" /> : "Crear"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
