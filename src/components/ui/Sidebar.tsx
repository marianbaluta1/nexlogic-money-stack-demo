type AppTab =
  | "dashboard"
  | "tranzactii"
  | "conturi"
  | "bugete"
  | "facturi"
  | "rapoarte"
  | "obiective"
  | "setari";

type SidebarProps = {
  activeTab?: AppTab;
  onTabChange?: (tab: AppTab) => void;
};

const sidebarItems: Array<{
  id: AppTab;
  label: string;
  description: string;
}> = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Privire generala",
  },
  {
    id: "tranzactii",
    label: "Tranzactii",
    description: "Venituri si cheltuieli",
  },
  {
    id: "conturi",
    label: "Conturi & Carduri",
    description: "Solduri separate",
  },
  {
    id: "bugete",
    label: "Bugete",
    description: "Limite lunare",
  },
  {
    id: "facturi",
    label: "Facturi & Abonamente",
    description: "Scadente si recurente",
  },
  {
    id: "rapoarte",
    label: "Rapoarte",
    description: "Analiza lunara",
  },
  {
    id: "obiective",
    label: "Obiective",
    description: "Economii si tinte",
  },
  {
    id: "setari",
    label: "Setari / Backup",
    description: "Siguranta datelor",
  },
];

export function Sidebar({
  activeTab = "dashboard",
  onTabChange = () => {},
}: SidebarProps) {
  return (
    <div className="w-64 shrink-0 border-r border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <div className="text-xl font-bold text-white">Nexlogic Money</div>

        <div className="mt-3 w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Mod privat demo
        </div>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={
                isActive
                  ? "w-full rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-left text-emerald-200 shadow-lg shadow-emerald-500/10 transition"
                  : "w-full rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left text-white/70 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
              }
            >
              <div className="text-sm font-semibold">{item.label}</div>

              <div className="mt-1 text-xs text-white/40">
                {item.description}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}