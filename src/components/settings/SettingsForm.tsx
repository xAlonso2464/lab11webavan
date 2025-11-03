"use client";
import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function SettingsForm() {
  const { state, dispatch } = useDashboard();
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    dispatch({ type: "settings/save", payload: state.settings });
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch id="dense" checked={state.settings.denseUI}
          onCheckedChange={(v)=>dispatch({ type: "settings/save", payload: { ...state.settings, denseUI: v }})}/>
        <Label htmlFor="dense">Interfaz compacta</Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="email" checked={state.settings.emailNotifications}
          onCheckedChange={(v)=>dispatch({ type: "settings/save", payload: { ...state.settings, emailNotifications: v }})}/>
        <Label htmlFor="email">Notificaciones por email</Label>
      </div>

      <div className="max-w-xs">
        <Label>Tema</Label>
        <Select value={state.settings.themeName} onValueChange={(v)=>dispatch({ type: "settings/save", payload: { ...state.settings, themeName: v as any }})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="emerald">Emerald</SelectItem>
            <SelectItem value="violet">Violet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={save} disabled={saving}>{saving ? <Spinner className="h-4 w-4" /> : "Guardar configuración"}</Button>
    </div>
  );
}
