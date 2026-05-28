import { useState, useMemo } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CULTURES = ["Пшеница", "Ячмень", "Кукуруза", "Рожь"];
const ELEVATORS = ["Алматинский ЭКП", "Астанинский ЭКП", "Шымкентский ЭКП", "Павлодарский ЭКП"];
const COUNTRIES = ["Таджикистан", "Узбекистан"];

const initSuppliers = [
  { id: 1, name: "КХ Агро-Степь", type: "КХ", region: "Акмолинская" },
  { id: 2, name: "ФХ Жайлау", type: "ФХ", region: "Костанайская" },
  { id: 3, name: "ТОО КазАгро", type: "ТОО", region: "Алматинская" },
];

const initContracts = [
  { id: 1, supplierId: 1, culture: "Пшеница", elevator: "Алматинский ЭКП", volume: 1500, delivered: 900, price: 85000, deadline: "2025-03-31", status: "active" },
  { id: 2, supplierId: 2, culture: "Ячмень", elevator: "Астанинский ЭКП", volume: 800, delivered: 800, price: 72000, deadline: "2025-02-28", status: "closed" },
  { id: 3, supplierId: 3, culture: "Пшеница", elevator: "Шымкентский ЭКП", volume: 2000, delivered: 400, price: 84000, deadline: "2025-04-30", status: "active" },
];

const initStock = [
  { id: 1, elevator: "Алматинский ЭКП", culture: "Пшеница", amount: 650 },
  { id: 2, elevator: "Алматинский ЭКП", culture: "Ячмень", amount: 200 },
  { id: 3, elevator: "Астанинский ЭКП", culture: "Пшеница", amount: 1100 },
  { id: 4, elevator: "Шымкентский ЭКП", culture: "Пшеница", amount: 380 },
  { id: 5, elevator: "Павлодарский ЭКП", culture: "Кукуруза", amount: 420 },
];

const initMovements = [
  { id: 1, date: "2025-01-10", culture: "Пшеница", elevator: "Алматинский ЭКП", amount: 900, type: "приход", doc: "Договор #1" },
  { id: 2, date: "2025-01-15", culture: "Пшеница", elevator: "Алматинский ЭКП", amount: 250, type: "расход", doc: "Вагон №85432" },
  { id: 3, date: "2025-01-20", culture: "Ячмень", elevator: "Астанинский ЭКП", amount: 800, type: "приход", doc: "Договор #2" },
  { id: 4, date: "2025-02-01", culture: "Пшеница", elevator: "Астанинский ЭКП", amount: 1100, type: "приход", doc: "Договор #3" },
];

const initOrders = [
  { id: 1, country: "Таджикистан", buyer: "Душанбе-Трейд", culture: "Пшеница", amount: 3000, period: "2025-02", status: "active" },
  { id: 2, country: "Узбекистан", buyer: "УзЗерноТрейд", culture: "Пшеница", amount: 2000, period: "2025-02", status: "active" },
  { id: 3, country: "Таджикистан", buyer: "АгроТадж", culture: "Ячмень", amount: 500, period: "2025-03", status: "active" },
];

const initExportContracts = [
  { id: 1, number: "EXP-2025-001", buyer: "Душанбе-Трейд", country: "Таджикистан", culture: "Пшеница", volume: 3000, shipped: 1200, price: 195, currency: "USD", date: "2025-01-05" },
  { id: 2, number: "EXP-2025-002", buyer: "УзЗерноТрейд", country: "Узбекистан", culture: "Пшеница", volume: 2000, shipped: 600, price: 192, currency: "USD", date: "2025-01-12" },
];

const initWagons = [
  { id: 1, number: "85432-КЗ", date: "2025-01-18", culture: "Пшеница", amount: 60, elevator: "Алматинский ЭКП", country: "Таджикистан", buyer: "Душанбе-Трейд", contractId: 1, status: "прибыл" },
  { id: 2, number: "85433-КЗ", date: "2025-01-20", culture: "Пшеница", amount: 58, elevator: "Алматинский ЭКП", country: "Таджикистан", buyer: "Душанбе-Трейд", contractId: 1, status: "в пути" },
  { id: 3, number: "91201-КЗ", date: "2025-01-22", culture: "Пшеница", amount: 62, elevator: "Астанинский ЭКП", country: "Узбекистан", buyer: "УзЗерноТрейд", contractId: 2, status: "отгружен" },
  { id: 4, number: "91202-КЗ", date: "2025-01-25", culture: "Пшеница", amount: 60, elevator: "Астанинский ЭКП", country: "Узбекистан", buyer: "УзЗерноТрейд", contractId: 2, status: "в пути" },
  { id: 5, number: "85440-КЗ", date: "2025-02-01", culture: "Пшеница", amount: 61, elevator: "Алматинский ЭКП", country: "Таджикистан", buyer: "Душанбе-Трейд", contractId: 1, status: "отгружен" },
];

// ─── PALETTE & STYLES ─────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700&family=Golos+Text:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --surface2: #1e2530;
    --border: #2a3240;
    --accent: #d4a843;
    --accent2: #e8c66a;
    --green: #3fb950;
    --red: #f85149;
    --blue: #58a6ff;
    --purple: #a371f7;
    --text: #e6edf3;
    --muted: #8b949e;
    --sidebar-w: 240px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Golos Text', sans-serif; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
  }
  .sidebar-logo {
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--border);
  }
  .logo-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: 0.5px; }
  .logo-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .sidebar-nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
  .nav-section { margin-bottom: 20px; }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; padding: 0 8px 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px;
    cursor: pointer; font-size: 13px; color: var(--muted); transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(212,168,67,0.12); color: var(--accent); }
  .nav-item .icon { width: 18px; text-align: center; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: var(--accent); color: #000; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 6px; }

  /* MAIN */
  .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .topbar {
    height: 56px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
    position: sticky; top: 0; z-index: 50;
  }
  .topbar-title { font-family: 'Unbounded', sans-serif; font-size: 14px; font-weight: 600; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .user-chip {
    display: flex; align-items: center; gap: 8px; background: var(--surface2);
    padding: 6px 12px; border-radius: 20px; font-size: 13px; cursor: pointer;
  }
  .user-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #000; }

  .content { padding: 24px; flex: 1; }

  /* CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 16px 20px; position: relative; overflow: hidden;
  }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.gold::before { background: var(--accent); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.blue::before { background: var(--blue); }
  .stat-card.red::before { background: var(--red); }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .stat-value { font-family: 'Unbounded', sans-serif; font-size: 22px; font-weight: 700; }
  .stat-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }

  /* TABLE */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
  .table-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .table-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  thead th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02); }
  tbody tr { border-bottom: 1px solid rgba(42,50,64,0.5); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.03); }
  tbody td { padding: 10px 16px; font-size: 13px; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .badge-green { background: rgba(63,185,80,0.12); color: var(--green); }
  .badge-blue { background: rgba(88,166,255,0.12); color: var(--blue); }
  .badge-gold { background: rgba(212,168,67,0.15); color: var(--accent2); }
  .badge-red { background: rgba(248,81,73,0.12); color: var(--red); }
  .badge-purple { background: rgba(163,113,247,0.12); color: var(--purple); }

  /* PROGRESS */
  .progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: 'Golos Text', sans-serif; }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Unbounded', sans-serif; font-size: 14px; font-weight: 600; }
  .modal-close { background: none; border: none; color: var(--muted); font-size: 20px; cursor: pointer; line-height: 1; }
  .modal-body { padding: 20px 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 9px 12px; color: var(--text); font-size: 13px; font-family: 'Golos Text', sans-serif;
    transition: border-color 0.15s;
  }
  .form-input:focus { outline: none; border-color: var(--accent); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* WAGON STATUS */
  .wagon-status { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: var(--surface2); padding: 4px; border-radius: 10px; margin-bottom: 20px; width: fit-content; }
  .tab { padding: 7px 16px; border-radius: 7px; font-size: 13px; cursor: pointer; color: var(--muted); transition: all 0.15s; font-weight: 500; }
  .tab.active { background: var(--accent); color: #000; font-weight: 600; }

  /* FILTER ROW */
  .filter-row { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
  .filter-input { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; color: var(--text); font-size: 13px; font-family: 'Golos Text', sans-serif; }
  .filter-input:focus { outline: none; border-color: var(--accent); }

  /* SECTION TITLE */
  .section-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* EMPTY */
  .empty { text-align: center; padding: 48px; color: var(--muted); font-size: 14px; }

  /* STOCK CARD */
  .stock-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stock-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
  .stock-elevator { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .stock-culture { font-family: 'Unbounded', sans-serif; font-size: 11px; color: var(--accent); margin-bottom: 4px; }
  .stock-amount { font-size: 28px; font-weight: 700; }
  .stock-unit { font-size: 12px; color: var(--muted); }

  @media (max-width: 768px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .main { margin-left: 0; }
    .form-row { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString("ru-RU");

function StatusBadge({ status }) {
  const map = {
    "в пути": ["badge-blue", "🚂"],
    "отгружен": ["badge-gold", "📦"],
    "прибыл": ["badge-green", "✅"],
    active: ["badge-green", ""],
    closed: ["badge-purple", ""],
    "приход": ["badge-green", "▲"],
    "расход": ["badge-red", "▼"],
  };
  const [cls, icon] = map[status] || ["badge-blue", ""];
  return <span className={`badge ${cls}`}>{icon && icon + " "}{status}</span>;
}

function ProgressRow({ label, value, total, color = "#d4a843" }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "var(--muted)" }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{fmt(value)} / {fmt(total)} т ({pct}%)</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ stock, wagons, contracts, exportContracts, orders }) {
  const totalStock = stock.reduce((s, x) => s + x.amount, 0);
  const inTransit = wagons.filter(w => w.status === "в пути").reduce((s, w) => s + w.amount, 0);
  const activeContracts = contracts.filter(c => c.status === "active").length;
  const pendingOrders = orders.reduce((s, o) => s + o.amount, 0);

  const byElevator = ELEVATORS.map(el => ({
    name: el,
    total: stock.filter(s => s.elevator === el).reduce((a, b) => a + b.amount, 0),
  })).filter(e => e.total > 0);

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card gold">
          <div className="stat-label">Остатки зерна</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>{fmt(totalStock)}</div>
          <div className="stat-sub">тонн на элеваторах</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">В пути (вагоны)</div>
          <div className="stat-value" style={{ color: "var(--blue)" }}>{fmt(inTransit)}</div>
          <div className="stat-sub">{wagons.filter(w => w.status === "в пути").length} вагонов</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Активных договоров</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>{activeContracts}</div>
          <div className="stat-sub">закупочных</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Заявки к отгрузке</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>{fmt(pendingOrders)}</div>
          <div className="stat-sub">тонн от клиентов</div>
        </div>
      </div>

      <div className="section-title">Остатки по элеваторам</div>
      <div className="stock-grid">
        {byElevator.map(el => (
          <div className="stock-card" key={el.name}>
            <div className="stock-elevator">📍 {el.name}</div>
            {stock.filter(s => s.elevator === el.name).map(s => (
              <div key={s.id} style={{ marginBottom: 12 }}>
                <div className="stock-culture">{s.culture.toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span className="stock-amount">{fmt(s.amount)}</span>
                  <span className="stock-unit">тонн</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="section-title">Выполнение экспортных контрактов</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Контракт</th><th>Покупатель</th><th>Страна</th><th>Культура</th><th>Выполнение</th>
            </tr>
          </thead>
          <tbody>
            {exportContracts.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.number}</td>
                <td>{c.buyer}</td>
                <td>{c.country}</td>
                <td>{c.culture}</td>
                <td style={{ width: 200 }}>
                  <ProgressRow value={c.shipped} total={c.volume} label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── STOCK MODULE ─────────────────────────────────────────────────────────────
function StockModule({ stock, movements, setMovements, setStock }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: "", culture: CULTURES[0], elevator: ELEVATORS[0], amount: "", type: "приход", doc: "" });
  const [filter, setFilter] = useState("");

  const handleAdd = () => {
    if (!form.date || !form.amount) return;
    const amt = parseFloat(form.amount);
    const newMov = { id: Date.now(), ...form, amount: amt };
    setMovements(prev => [newMov, ...prev]);
    setStock(prev => {
      const idx = prev.findIndex(s => s.elevator === form.elevator && s.culture === form.culture);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], amount: updated[idx].amount + (form.type === "приход" ? amt : -amt) };
        return updated;
      }
      return [...prev, { id: Date.now(), elevator: form.elevator, culture: form.culture, amount: amt }];
    });
    setShowAdd(false);
    setForm({ date: "", culture: CULTURES[0], elevator: ELEVATORS[0], amount: "", type: "приход", doc: "" });
  };

  const filtered = movements.filter(m =>
    !filter || m.culture.toLowerCase().includes(filter.toLowerCase()) ||
    m.elevator.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="stat-grid">
        {ELEVATORS.map(el => {
          const total = stock.filter(s => s.elevator === el).reduce((a, b) => a + b.amount, 0);
          if (!total) return null;
          return (
            <div className="stat-card gold" key={el}>
              <div className="stat-label">{el.replace(" ЭКП", "")}</div>
              <div className="stat-value" style={{ color: "var(--accent)", fontSize: 18 }}>{fmt(total)}</div>
              <div className="stat-sub">тонн</div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Движение зерна</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="filter-input" placeholder="Поиск..." value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 180 }} />
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Добавить</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Дата</th><th>Культура</th><th>Элеватор</th><th>Тонн</th><th>Тип</th><th>Документ</th></tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td style={{ color: "var(--muted)" }}>{m.date}</td>
                <td style={{ fontWeight: 600 }}>{m.culture}</td>
                <td>{m.elevator}</td>
                <td style={{ fontWeight: 700 }}>{fmt(m.amount)}</td>
                <td><StatusBadge status={m.type} /></td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.doc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Добавить движение зерна" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd}>Сохранить</button></>}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Дата</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Тип</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>приход</option><option>расход</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Культура</label>
              <select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>
                {CULTURES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Элеватор</label>
              <select className="form-input" value={form.elevator} onChange={e => setForm({ ...form, elevator: e.target.value })}>
                {ELEVATORS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Количество (тонн)</label>
              <input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Документ</label>
              <input className="form-input" value={form.doc} onChange={e => setForm({ ...form, doc: e.target.value })} placeholder="Договор / вагон..." />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── CONTRACTS MODULE ─────────────────────────────────────────────────────────
function ContractsModule({ contracts, setContracts, suppliers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ supplierId: 1, culture: CULTURES[0], elevator: ELEVATORS[0], volume: "", delivered: "", price: "", deadline: "", status: "active" });

  const handleAdd = () => {
    if (!form.volume) return;
    setContracts(prev => [...prev, { id: Date.now(), ...form, volume: +form.volume, delivered: +form.delivered || 0, price: +form.price || 0 }]);
    setShowAdd(false);
  };

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Договоры закупа</span>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Договор</button>
        </div>
        <table>
          <thead>
            <tr><th>Поставщик</th><th>Культура</th><th>Элеватор</th><th>Объём</th><th>Поставлено</th><th>Выполнение</th><th>Цена</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {contracts.map(c => {
              const sup = suppliers.find(s => s.id === c.supplierId);
              const pct = Math.round((c.delivered / c.volume) * 100);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{sup?.name}</td>
                  <td>{c.culture}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{c.elevator}</td>
                  <td>{fmt(c.volume)} т</td>
                  <td>{fmt(c.delivered)} т</td>
                  <td style={{ width: 150 }}>
                    <div style={{ fontSize: 12, marginBottom: 4, color: pct === 100 ? "var(--green)" : "var(--accent)" }}>{pct}%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--accent)" }} /></div>
                  </td>
                  <td style={{ color: "var(--blue)" }}>{fmt(c.price)} ₸</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Новый договор закупа" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd}>Сохранить</button></>}>
          <div className="form-group">
            <label className="form-label">Поставщик</label>
            <select className="form-input" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: +e.target.value })}>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Культура</label>
              <select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>
                {CULTURES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Элеватор</label>
              <select className="form-input" value={form.elevator} onChange={e => setForm({ ...form, elevator: e.target.value })}>
                {ELEVATORS.map(el => <option key={el}>{el}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Объём (тонн)</label>
              <input type="number" className="form-input" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Цена (₸/т)</label>
              <input type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Срок</label>
              <input type="date" className="form-input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Статус</label>
              <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Активный</option><option value="closed">Закрыт</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ORDERS MODULE ────────────────────────────────────────────────────────────
function OrdersModule({ orders, setOrders, wagons, stock }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ country: COUNTRIES[0], buyer: "", culture: CULTURES[0], amount: "", period: "2025-02" });
  const [activeTab, setActiveTab] = useState("orders");

  const handleAdd = () => {
    if (!form.buyer || !form.amount) return;
    setOrders(prev => [...prev, { id: Date.now(), ...form, amount: +form.amount, status: "active" }]);
    setShowAdd(false);
  };

  const planByMonth = useMemo(() => {
    const months = {};
    orders.forEach(o => {
      const key = o.period;
      if (!months[key]) months[key] = {};
      if (!months[key][o.culture]) months[key][o.culture] = 0;
      months[key][o.culture] += o.amount;
    });
    return months;
  }, [orders]);

  const shipped = wagons.reduce((acc, w) => {
    const k = w.culture;
    acc[k] = (acc[k] || 0) + w.amount;
    return acc;
  }, {});

  const totalStock = stock.reduce((acc, s) => {
    acc[s.culture] = (acc[s.culture] || 0) + s.amount;
    return acc;
  }, {});

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>Заявки</div>
        <div className={`tab ${activeTab === "plan" ? "active" : ""}`} onClick={() => setActiveTab("plan")}>План продаж</div>
        <div className={`tab ${activeTab === "balance" ? "active" : ""}`} onClick={() => setActiveTab("balance")}>Баланс зерна</div>
      </div>

      {activeTab === "orders" && (
        <div className="table-wrap">
          <div className="table-head">
            <span className="table-title">Заявки от клиентов</span>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Заявка</button>
          </div>
          <table>
            <thead>
              <tr><th>Страна</th><th>Покупатель</th><th>Культура</th><th>Тонн</th><th>Период</th><th>Статус</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"} {o.country}</td>
                  <td style={{ fontWeight: 600 }}>{o.buyer}</td>
                  <td>{o.culture}</td>
                  <td style={{ fontWeight: 700 }}>{fmt(o.amount)}</td>
                  <td style={{ color: "var(--muted)" }}>{o.period}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "plan" && (
        <div>
          {Object.entries(planByMonth).map(([month, cultures]) => (
            <div className="table-wrap" key={month} style={{ marginBottom: 16 }}>
              <div className="table-head">
                <span className="table-title">📅 {month}</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  Вагонов ~{Math.ceil(Object.values(cultures).reduce((a, b) => a + b, 0) / 60)}
                </span>
              </div>
              <table>
                <thead>
                  <tr><th>Культура</th><th>Потребность</th><th>Вагонов</th></tr>
                </thead>
                <tbody>
                  {Object.entries(cultures).map(([cult, amt]) => (
                    <tr key={cult}>
                      <td style={{ fontWeight: 600 }}>{cult}</td>
                      <td>{fmt(amt)} т</td>
                      <td style={{ color: "var(--blue)" }}>~{Math.ceil(amt / 60)} ваг.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {activeTab === "balance" && (
        <div>
          <div className="section-title">Баланс по культурам</div>
          {CULTURES.filter(c => totalStock[c] || shipped[c]).map(cult => {
            const need = orders.filter(o => o.culture === cult).reduce((a, b) => a + b.amount, 0);
            const avail = totalStock[cult] || 0;
            const diff = avail - need;
            return (
              <div className="stat-card" key={cult} style={{ marginBottom: 12 }}>
                <div className="stat-label">{cult}</div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>На элеваторах</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{fmt(avail)} т</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Заявок к отгрузке</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--blue)" }}>{fmt(need)} т</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Остаток / дефицит</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: diff >= 0 ? "var(--green)" : "var(--red)" }}>
                      {diff >= 0 ? "+" : ""}{fmt(diff)} т
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Новая заявка" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd}>Сохранить</button></>}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Страна</label>
              <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Покупатель</label>
              <input className="form-input" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} placeholder="Название компании" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Культура</label>
              <select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>
                {CULTURES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Количество (тонн)</label>
              <input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Период (ГГГГ-ММ)</label>
            <input className="form-input" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="2025-02" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── EXPORT CONTRACTS ─────────────────────────────────────────────────────────
function ExportModule({ exportContracts, setExportContracts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ number: "", buyer: "", country: COUNTRIES[0], culture: CULTURES[0], volume: "", shipped: "", price: "", currency: "USD", date: "" });

  const handleAdd = () => {
    if (!form.number || !form.volume) return;
    setExportContracts(prev => [...prev, { id: Date.now(), ...form, volume: +form.volume, shipped: +form.shipped || 0, price: +form.price || 0 }]);
    setShowAdd(false);
  };

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Экспортные контракты</span>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Контракт</button>
        </div>
        <table>
          <thead>
            <tr><th>Номер</th><th>Покупатель</th><th>Страна</th><th>Культура</th><th>Объём</th><th>Отгружено</th><th>Выполнение</th><th>Цена</th></tr>
          </thead>
          <tbody>
            {exportContracts.map(c => {
              const pct = Math.round((c.shipped / c.volume) * 100);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: "var(--accent)" }}>{c.number}</td>
                  <td>{c.buyer}</td>
                  <td>{c.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"} {c.country}</td>
                  <td>{c.culture}</td>
                  <td>{fmt(c.volume)} т</td>
                  <td>{fmt(c.shipped)} т</td>
                  <td style={{ width: 160 }}>
                    <div style={{ fontSize: 12, color: pct === 100 ? "var(--green)" : "var(--blue)", marginBottom: 3 }}>{pct}%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--blue)" }} /></div>
                  </td>
                  <td style={{ color: "var(--blue)" }}>{c.price} {c.currency}/т</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Новый экспортный контракт" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd}>Сохранить</button></>}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Номер контракта</label>
              <input className="form-input" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="EXP-2025-003" />
            </div>
            <div className="form-group">
              <label className="form-label">Дата</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Покупатель</label>
              <input className="form-input" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Страна</label>
              <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Культура</label>
              <select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>
                {CULTURES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Объём (тонн)</label>
              <input type="number" className="form-input" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Цена</label>
              <input type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Валюта</label>
              <select className="form-input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option>USD</option><option>EUR</option><option>KZT</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── WAGONS MODULE ────────────────────────────────────────────────────────────
function WagonsModule({ wagons, setWagons, exportContracts, setStock }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ number: "", date: "", culture: CULTURES[0], amount: "", elevator: ELEVATORS[0], country: COUNTRIES[0], buyer: "", contractId: exportContracts[0]?.id || 1, status: "отгружен" });

  const handleAdd = () => {
    if (!form.number || !form.amount) return;
    const wagon = { id: Date.now(), ...form, amount: +form.amount, contractId: +form.contractId };
    setWagons(prev => [wagon, ...prev]);
    setStock(prev => {
      const idx = prev.findIndex(s => s.elevator === form.elevator && s.culture === form.culture);
      if (idx >= 0) {
        const upd = [...prev];
        upd[idx] = { ...upd[idx], amount: Math.max(0, upd[idx].amount - wagon.amount) };
        return upd;
      }
      return prev;
    });
    setShowAdd(false);
  };

  const filtered = filter === "all" ? wagons : wagons.filter(w => w.status === filter);

  const statusColor = { "в пути": "var(--blue)", "отгружен": "var(--accent)", "прибыл": "var(--green)" };

  return (
    <div>
      <div className="stat-grid">
        {["в пути", "отгружен", "прибыл"].map(s => (
          <div className="stat-card" key={s} style={{ borderTop: `2px solid ${statusColor[s]}` }}>
            <div className="stat-label">{s}</div>
            <div className="stat-value" style={{ color: statusColor[s], fontSize: 20 }}>
              {wagons.filter(w => w.status === s).length} ваг.
            </div>
            <div className="stat-sub">{fmt(wagons.filter(w => w.status === s).reduce((a, b) => a + b.amount, 0))} т</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Вагоны (ЖД логистика)</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select className="filter-input" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">Все статусы</option>
              <option value="в пути">В пути</option>
              <option value="отгружен">Отгружены</option>
              <option value="прибыл">Прибыли</option>
            </select>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Вагон</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Номер</th><th>Дата</th><th>Культура</th><th>Тонн</th><th>Элеватор</th><th>Страна</th><th>Покупатель</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.id}>
                <td style={{ fontWeight: 700, fontFamily: "monospace", color: "var(--accent2)" }}>{w.number}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{w.date}</td>
                <td>{w.culture}</td>
                <td style={{ fontWeight: 600 }}>{w.amount}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{w.elevator.replace(" ЭКП", "")}</td>
                <td>{w.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"}</td>
                <td style={{ fontSize: 12 }}>{w.buyer}</td>
                <td>
                  <div className="wagon-status">
                    <div className="status-dot" style={{ background: statusColor[w.status] }} />
                    <span style={{ color: statusColor[w.status] }}>{w.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Добавить вагон" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd}>Сохранить</button></>}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Номер вагона</label>
              <input className="form-input" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="85441-КЗ" />
            </div>
            <div className="form-group">
              <label className="form-label">Дата погрузки</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Культура</label>
              <select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>
                {CULTURES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Тонн</label>
              <input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Элеватор</label>
              <select className="form-input" value={form.elevator} onChange={e => setForm({ ...form, elevator: e.target.value })}>
                {ELEVATORS.map(el => <option key={el}>{el}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Страна</label>
              <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Покупатель</label>
              <input className="form-input" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Статус</label>
              <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>отгружен</option><option>в пути</option><option>прибыл</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Контракт</label>
            <select className="form-input" value={form.contractId} onChange={e => setForm({ ...form, contractId: e.target.value })}>
              {exportContracts.map(c => <option key={c.id} value={c.id}>{c.number} — {c.buyer}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SUPPLIERS MODULE ─────────────────────────────────────────────────────────
function SuppliersModule({ suppliers, setSuppliers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", type: "КХ", region: "" });

  const handleAdd = () => {
    if (!form.name) return;
    setSuppliers(prev => [...prev, { id: Date.now(), ...form }]);
    setShowAdd(false);
    setForm({ name: "", type: "КХ", region: "" });
  };

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Справочник поставщиков</span>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Поставщик</button>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Название</th><th>Тип</th><th>Регион</th></tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id}>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{s.id}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td><span className={`badge ${s.type === "ТОО" ? "badge-blue" : s.type === "КХ" ? "badge-gold" : "badge-purple"}`}>{s.type}</span></td>
                <td style={{ color: "var(--muted)" }}>{s.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Добавить поставщика" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd}>Сохранить</button></>}>
          <div className="form-group">
            <label className="form-label">Название</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="КХ Иванов" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Тип</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>КХ</option><option>ФХ</option><option>ТОО</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Регион</label>
              <input className="form-input" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} placeholder="Акмолинская" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const PAGES = [
  { id: "dashboard", label: "Дашборд", icon: "📊", section: "Обзор" },
  { id: "stock", label: "Зерно и остатки", icon: "🌾", section: "Закуп" },
  { id: "contracts", label: "Договоры закупа", icon: "📋", section: "Закуп" },
  { id: "suppliers", label: "Поставщики", icon: "🏭", section: "Закуп" },
  { id: "orders", label: "Заявки клиентов", icon: "📬", section: "Продажи" },
  { id: "export", label: "Экспортные контракты", icon: "🌐", section: "Продажи" },
  { id: "wagons", label: "Вагоны (ЖД)", icon: "🚂", section: "Логистика" },
];

const PAGE_TITLES = {
  dashboard: "Главный дашборд",
  stock: "Зерно и остатки на элеваторах",
  contracts: "Договоры закупа",
  suppliers: "Поставщики",
  orders: "Заявки и планы продаж",
  export: "Экспортные контракты",
  wagons: "ЖД вагоны и логистика",
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [stock, setStock] = useState(initStock);
  const [movements, setMovements] = useState(initMovements);
  const [contracts, setContracts] = useState(initContracts);
  const [suppliers, setSuppliers] = useState(initSuppliers);
  const [orders, setOrders] = useState(initOrders);
  const [exportContracts, setExportContracts] = useState(initExportContracts);
  const [wagons, setWagons] = useState(initWagons);

  const sections = [...new Set(PAGES.map(p => p.section))];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-title">🌾 GRAIN CRM</div>
            <div className="logo-sub">Казахстан → Таджикистан / Узбекистан</div>
          </div>
          <nav className="sidebar-nav">
            {sections.map(sec => (
              <div className="nav-section" key={sec}>
                <div className="nav-label">{sec}</div>
                {PAGES.filter(p => p.section === sec).map(p => (
                  <div key={p.id} className={`nav-item ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>
                    <span className="icon">{p.icon}</span>
                    <span>{p.label}</span>
                    {p.id === "wagons" && wagons.filter(w => w.status === "в пути").length > 0 && (
                      <span className="nav-badge">{wagons.filter(w => w.status === "в пути").length}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <span className="topbar-title">{PAGE_TITLES[page]}</span>
            <div className="topbar-right">
              <div style={{ fontSize: 12, color: "var(--green)", background: "rgba(63,185,80,0.1)", padding: "4px 10px", borderRadius: 6 }}>
                ● Онлайн
              </div>
              <div className="user-chip">
                <div className="user-avatar">Р</div>
                <span>Руководитель</span>
              </div>
            </div>
          </div>

          <div className="content">
            {page === "dashboard" && <Dashboard stock={stock} wagons={wagons} contracts={contracts} exportContracts={exportContracts} orders={orders} />}
            {page === "stock" && <StockModule stock={stock} movements={movements} setMovements={setMovements} setStock={setStock} />}
            {page === "contracts" && <ContractsModule contracts={contracts} setContracts={setContracts} suppliers={suppliers} />}
            {page === "suppliers" && <SuppliersModule suppliers={suppliers} setSuppliers={setSuppliers} />}
            {page === "orders" && <OrdersModule orders={orders} setOrders={setOrders} wagons={wagons} stock={stock} />}
            {page === "export" && <ExportModule exportContracts={exportContracts} setExportContracts={setExportContracts} />}
            {page === "wagons" && <WagonsModule wagons={wagons} setWagons={setWagons} exportContracts={exportContracts} setStock={setStock} />}
          </div>
        </main>
      </div>
    </>
  );
}
