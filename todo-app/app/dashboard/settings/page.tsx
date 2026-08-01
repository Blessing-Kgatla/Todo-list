import { getSettings } from "@/lib/data";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Customize the look of your dashboard.
      </p>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Theme</h2>
        <ThemeSwitcher current={settings.theme} />
      </div>
    </div>
  );
}