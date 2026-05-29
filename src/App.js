import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://liyaovykdxjlabvlojaq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpeWFvdnlrZHhqbGFidmxvamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MzYyMDMsImV4cCI6MjA5NTUxMjIwM30.i2NdZhA5lzul7Mc6GjpSjlPxUerN5e-nCZTzsXozjEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CULTURES = ["Пшеница", "Ячмень", "Кукуруза", "Рожь"];
const ELEVATORS = ["Алматинский ЭКП", "Астанинский ЭКП", "Шымкентский ЭКП", "Павлодарский ЭКП"];
const COUNTRIES = ["Таджикистан", "Узбекистан"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700&family=Golos+Text:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161b22; --surface2: #1e2530; --border: #2a3240;
    --accent: #d4a843; --accent2: #e8c66a; --green: #3fb950; --red: #f85149;
    --blue: #58a6ff; --purple: #a371f7; --text: #e6edf3; --muted: #8b949e; --sidebar-w: 240px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Golos Text', sans-serif; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
  .sidebar-logo { padding: 20px 16px 16px; border-bottom: 1px solid var(--border); }
  .logo-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: 0.5px; }
  .logo-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .sidebar-nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
  .nav-section { margin-bottom: 20px; }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; padding: 0 8px 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--muted); transition: all 0.15s; margin-bottom: 2px; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(212,168,67,0.12); color: var(--accent); }
  .nav-item .icon { width: 18px; text-align: center; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: var(--accent); color: #000; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 6px; }
  .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .topbar { height: 56px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-family: 'Unbounded', sans-serif; font-size: 14px; font-weight: 600; }
  .user-chip { display: flex; align-items: center; gap: 8px; background: var(--surface2); padding: 6px 12px; border-radius: 20px; font-size: 13px; }
  .user-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #000; }
  .content { padding: 24px; flex: 1; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.gold::before { background: var(--accent); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.blue::before { background: var(--blue); }
  .stat-card.red::before { background: var(--red); }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .stat-value { font-family: 'Unbounded', sans-serif; font-size: 22px; font-weight: 700; }
  .stat-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
  .table-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .table-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  thead th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02); }
  tbody tr { border-bottom: 1px solid rgba(42,50,64,0.5); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.03); }
  tbody td { padding: 10px 16px; font-size: 13px; }
  .badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .badge-green { background: rgba(63,185,80,0.12); color: var(--green); }
  .badge-blue { background: rgba(88,166,255,0.12); color: var(--blue); }
  .badge-gold { background: rgba(212,168,67,0.15); color: var(--accent2); }
  .badge-red { background: rgba(248,81,73,0.12); color: var(--red); }
  .progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; border-radius: 3px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: 'Golos Text', sans-serif; }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: rgba(248,81,73,0.15); color: var(--red); border: none; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Unbounded', sans-serif; font-size: 14px; font-weight: 600; }
  .modal-close { background: none; border: none; color: var(--muted); font-size: 20px; cursor: pointer; }
  .modal-body { padding: 20px 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; color: var(--text); font-size: 13px; font-family: 'Golos Text', sans-serif; transition: border-color 0.15s; }
  .form-input:focus { outline: none; border-color: var(--accent); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tabs { display: flex; gap: 4px; background: var(--surface2); padding: 4px; border-radius: 10px; margin-bottom: 20px; width: fit-content; }
  .tab { padding: 7px 16px; border-radius: 7px; font-size: 13px; cursor: pointer; color: var(--muted); transition: all 0.15s; font-weight: 500; }
  .tab.active { background: var(--accent); color: #000; font-weight: 600; }
  .section-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .stock-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stock-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
  .loading { display: flex; align-items: center; justify-content: center; padding: 48px; color: var(--muted); font-size: 14px; gap: 10px; }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty { text-align: center; padding: 48px; color: var(--muted); font-size: 14px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
  @media (max-width: 768px) { :root { --sidebar-w: 0px; } .sidebar { display: none; } .main { margin-left: 0; } .form-row { grid-template-columns: 1fr; } }
`;

const fmt = (n) => Number(n || 0).toLocaleString("ru-RU");

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

function StatusBadge({ status }) {
  const map = { "в пути": "badge-blue", "отгружен": "badge-gold", "прибыл": "badge-green", "active": "badge-green", "closed": "badge-blue", "приход": "badge-green", "расход": "badge-red" };
  return <span className={`badge ${map[status] || "badge-blue"}`}>{status}</span>;
}

// ── DASHBOARD ──
function Dashboard({ stock, wagons, contracts, exportContracts, orders }) {
  const totalStock = stock.reduce((s, x) => s + Number(x.amount || 0), 0);
  const inTransit = wagons.filter(w => w.status === "в пути").reduce((s, w) => s + Number(w.amount || 0), 0);
  const activeContracts = contracts.filter(c => c.status === "active").length;
  const pendingOrders = orders.reduce((s, o) => s + Number(o.amount || 0), 0);

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
        {ELEVATORS.map(el => {
          const items = stock.filter(s => s.elevator === el);
          if (!items.length) return null;
          return (
            <div className="stock-card" key={el}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>📍 {el}</div>
              {items.map((s, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{s.culture}</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt(s.amount)} <span style={{ fontSize: 12, color: "var(--muted)" }}>т</span></div>
                </div>
              ))}
            </div>
          );
        })}
        {stock.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Нет данных. Добавьте приход зерна.</div>}
      </div>

      {exportContracts.length > 0 && (
        <>
          <div className="section-title">Выполнение экспортных контрактов</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Контракт</th><th>Покупатель</th><th>Страна</th><th>Выполнение</th></tr></thead>
              <tbody>
                {exportContracts.map(c => {
                  const pct = c.volume > 0 ? Math.min(100, Math.round((c.shipped / c.volume) * 100)) : 0;
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: "var(--accent)" }}>{c.number}</td>
                      <td>{c.buyer}</td>
                      <td>{c.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"} {c.country}</td>
                      <td style={{ width: 200 }}>
                        <div style={{ fontSize: 12, marginBottom: 3 }}>{fmt(c.shipped)} / {fmt(c.volume)} т ({pct}%)</div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--accent)" }} /></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── STOCK ──
function StockModule({ stock, setStock, movements, setMovements }) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), culture: CULTURES[0], elevator: ELEVATORS[0], amount: "", type: "приход", doc: "" });

  const handleAdd = async () => {
    if (!form.date || !form.amount) return;
    setSaving(true);
    const amt = parseFloat(form.amount);
    const { data: mov } = await supabase.from("movements").insert([{ ...form, amount: amt }]).select().single();
    if (mov) setMovements(prev => [mov, ...prev]);

    const existing = stock.find(s => s.elevator === form.elevator && s.culture === form.culture);
    const newAmt = (existing ? Number(existing.amount) : 0) + (form.type === "приход" ? amt : -amt);
    if (existing) {
      await supabase.from("stock").update({ amount: newAmt }).eq("id", existing.id);
      setStock(prev => prev.map(s => s.id === existing.id ? { ...s, amount: newAmt } : s));
    } else {
      const { data: ns } = await supabase.from("stock").insert([{ elevator: form.elevator, culture: form.culture, amount: newAmt }]).select().single();
      if (ns) setStock(prev => [...prev, ns]);
    }
    setSaving(false);
    setShowAdd(false);
  };

  return (
    <div>
      <div className="stat-grid">
        {ELEVATORS.map(el => {
          const total = stock.filter(s => s.elevator === el).reduce((a, b) => a + Number(b.amount || 0), 0);
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
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Добавить</button>
        </div>
        <table>
          <thead><tr><th>Дата</th><th>Культура</th><th>Элеватор</th><th>Тонн</th><th>Тип</th><th>Документ</th></tr></thead>
          <tbody>
            {movements.length === 0 && <tr><td colSpan={6} className="empty">Нет записей</td></tr>}
            {movements.map(m => (
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
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? "Сохраняю..." : "Сохранить"}</button></>}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Дата</label><input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Тип</label><select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>приход</option><option>расход</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Культура</label><select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>{CULTURES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Элеватор</label><select className="form-input" value={form.elevator} onChange={e => setForm({ ...form, elevator: e.target.value })}>{ELEVATORS.map(el => <option key={el}>{el}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Количество (тонн)</label><input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Документ</label><input className="form-input" value={form.doc} onChange={e => setForm({ ...form, doc: e.target.value })} placeholder="Договор / вагон..." /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CONTRACTS ──
function ContractsModule({ contracts, setContracts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ supplier_name: "", culture: CULTURES[0], elevator: ELEVATORS[0], volume: "", delivered: "", price: "", deadline: "", status: "active" });

  const handleAdd = async () => {
    if (!form.supplier_name || !form.volume) return;
    setSaving(true);
    const { data } = await supabase.from("contracts").insert([{ ...form, volume: +form.volume, delivered: +form.delivered || 0, price: +form.price || 0 }]).select().single();
    if (data) setContracts(prev => [data, ...prev]);
    setSaving(false);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("contracts").delete().eq("id", id);
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Договоры закупа</span>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Договор</button>
        </div>
        <table>
          <thead><tr><th>Поставщик</th><th>Культура</th><th>Элеватор</th><th>Объём</th><th>Поставлено</th><th>%</th><th>Цена</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {contracts.length === 0 && <tr><td colSpan={9} className="empty">Нет договоров</td></tr>}
            {contracts.map(c => {
              const pct = c.volume > 0 ? Math.round((c.delivered / c.volume) * 100) : 0;
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.supplier_name}</td>
                  <td>{c.culture}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{c.elevator}</td>
                  <td>{fmt(c.volume)} т</td>
                  <td>{fmt(c.delivered)} т</td>
                  <td style={{ width: 120 }}>
                    <div style={{ fontSize: 11, color: pct === 100 ? "var(--green)" : "var(--accent)", marginBottom: 2 }}>{pct}%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--accent)" }} /></div>
                  </td>
                  <td style={{ color: "var(--blue)" }}>{fmt(c.price)} ₸</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td><button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDelete(c.id)}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <Modal title="Новый договор" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? "Сохраняю..." : "Сохранить"}</button></>}>
          <div className="form-group"><label className="form-label">Поставщик</label><input className="form-input" value={form.supplier_name} onChange={e => setForm({ ...form, supplier_name: e.target.value })} placeholder="КХ Иванов" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Культура</label><select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>{CULTURES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Элеватор</label><select className="form-input" value={form.elevator} onChange={e => setForm({ ...form, elevator: e.target.value })}>{ELEVATORS.map(el => <option key={el}>{el}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Объём (тонн)</label><input type="number" className="form-input" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Цена (₸/т)</label><input type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Срок</label><input type="date" className="form-input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Статус</label><select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Активный</option><option value="closed">Закрыт</option></select></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ORDERS ──
function OrdersModule({ orders, setOrders, stock }) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("orders");
  const [form, setForm] = useState({ country: COUNTRIES[0], buyer: "", culture: CULTURES[0], amount: "", period: new Date().toISOString().slice(0, 7) });

  const handleAdd = async () => {
    if (!form.buyer || !form.amount) return;
    setSaving(true);
    const { data } = await supabase.from("orders").insert([{ ...form, amount: +form.amount, status: "active" }]).select().single();
    if (data) setOrders(prev => [data, ...prev]);
    setSaving(false);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("orders").delete().eq("id", id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const totalStock = stock.reduce((acc, s) => { acc[s.culture] = (acc[s.culture] || 0) + Number(s.amount || 0); return acc; }, {});

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Заявки</div>
        <div className={`tab ${tab === "balance" ? "active" : ""}`} onClick={() => setTab("balance")}>Баланс зерна</div>
      </div>
      {tab === "orders" && (
        <div className="table-wrap">
          <div className="table-head">
            <span className="table-title">Заявки от клиентов</span>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Заявка</button>
          </div>
          <table>
            <thead><tr><th>Страна</th><th>Покупатель</th><th>Культура</th><th>Тонн</th><th>Период</th><th>Вагонов ~</th><th></th></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={7} className="empty">Нет заявок</td></tr>}
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"} {o.country}</td>
                  <td style={{ fontWeight: 600 }}>{o.buyer}</td>
                  <td>{o.culture}</td>
                  <td style={{ fontWeight: 700 }}>{fmt(o.amount)}</td>
                  <td style={{ color: "var(--muted)" }}>{o.period}</td>
                  <td style={{ color: "var(--blue)" }}>~{Math.ceil(o.amount / 60)}</td>
                  <td><button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDelete(o.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "balance" && (
        <div>
          {CULTURES.map(cult => {
            const need = orders.filter(o => o.culture === cult).reduce((a, b) => a + Number(b.amount || 0), 0);
            const avail = totalStock[cult] || 0;
            if (!need && !avail) return null;
            const diff = avail - need;
            return (
              <div className="stat-card" key={cult} style={{ marginBottom: 12 }}>
                <div className="stat-label">{cult}</div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>На элеваторах</div><div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{fmt(avail)} т</div></div>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Заявок</div><div style={{ fontSize: 20, fontWeight: 700, color: "var(--blue)" }}>{fmt(need)} т</div></div>
                  <div><div style={{ fontSize: 11, color: "var(--muted)" }}>Остаток / дефицит</div><div style={{ fontSize: 20, fontWeight: 700, color: diff >= 0 ? "var(--green)" : "var(--red)" }}>{diff >= 0 ? "+" : ""}{fmt(diff)} т</div></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showAdd && (
        <Modal title="Новая заявка" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? "Сохраняю..." : "Сохранить"}</button></>}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Страна</label><select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Покупатель</label><input className="form-input" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} placeholder="Название компании" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Культура</label><select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>{CULTURES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Количество (тонн)</label><input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Период (ГГГГ-ММ)</label><input className="form-input" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}

// ── EXPORT ──
function ExportModule({ exportContracts, setExportContracts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ number: "", buyer: "", country: COUNTRIES[0], culture: CULTURES[0], volume: "", shipped: "", price: "", currency: "USD", date: new Date().toISOString().slice(0, 10) });

  const handleAdd = async () => {
    if (!form.number || !form.volume) return;
    setSaving(true);
    const { data } = await supabase.from("export_contracts").insert([{ ...form, volume: +form.volume, shipped: +form.shipped || 0, price: +form.price || 0 }]).select().single();
    if (data) setExportContracts(prev => [data, ...prev]);
    setSaving(false);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("export_contracts").delete().eq("id", id);
    setExportContracts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Экспортные контракты</span>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Контракт</button>
        </div>
        <table>
          <thead><tr><th>Номер</th><th>Покупатель</th><th>Страна</th><th>Культура</th><th>Объём</th><th>Отгружено</th><th>%</th><th>Цена</th><th></th></tr></thead>
          <tbody>
            {exportContracts.length === 0 && <tr><td colSpan={9} className="empty">Нет контрактов</td></tr>}
            {exportContracts.map(c => {
              const pct = c.volume > 0 ? Math.round((c.shipped / c.volume) * 100) : 0;
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: "var(--accent)" }}>{c.number}</td>
                  <td>{c.buyer}</td>
                  <td>{c.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"} {c.country}</td>
                  <td>{c.culture}</td>
                  <td>{fmt(c.volume)} т</td>
                  <td>{fmt(c.shipped)} т</td>
                  <td style={{ width: 120 }}>
                    <div style={{ fontSize: 11, marginBottom: 2 }}>{pct}%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--blue)" }} /></div>
                  </td>
                  <td style={{ color: "var(--blue)" }}>{c.price} {c.currency}/т</td>
                  <td><button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDelete(c.id)}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <Modal title="Новый экспортный контракт" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? "Сохраняю..." : "Сохранить"}</button></>}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Номер контракта</label><input className="form-input" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="EXP-2025-001" /></div>
            <div className="form-group"><label className="form-label">Дата</label><input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Покупатель</label><input className="form-input" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Страна</label><select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Культура</label><select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>{CULTURES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Объём (тонн)</label><input type="number" className="form-input" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Цена</label><input type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Валюта</label><select className="form-input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}><option>USD</option><option>EUR</option><option>KZT</option></select></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── WAGONS ──
function WagonsModule({ wagons, setWagons, exportContracts, setStock, stock }) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ number: "", date: new Date().toISOString().slice(0, 10), culture: CULTURES[0], amount: "", elevator: ELEVATORS[0], country: COUNTRIES[0], buyer: "", status: "отгружен" });

  const handleAdd = async () => {
    if (!form.number || !form.amount) return;
    setSaving(true);
    const amt = +form.amount;
    const { data } = await supabase.from("wagons").insert([{ ...form, amount: amt }]).select().single();
    if (data) {
      setWagons(prev => [data, ...prev]);
      const existing = stock.find(s => s.elevator === form.elevator && s.culture === form.culture);
      if (existing) {
        const newAmt = Math.max(0, Number(existing.amount) - amt);
        await supabase.from("stock").update({ amount: newAmt }).eq("id", existing.id);
        setStock(prev => prev.map(s => s.id === existing.id ? { ...s, amount: newAmt } : s));
      }
    }
    setSaving(false);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("wagons").delete().eq("id", id);
    setWagons(prev => prev.filter(w => w.id !== id));
  };

  const filtered = filter === "all" ? wagons : wagons.filter(w => w.status === filter);
  const statusColor = { "в пути": "var(--blue)", "отгружен": "var(--accent)", "прибыл": "var(--green)" };

  return (
    <div>
      <div className="stat-grid">
        {["в пути", "отгружен", "прибыл"].map(s => (
          <div className="stat-card" key={s} style={{ borderTop: `2px solid ${statusColor[s]}` }}>
            <div className="stat-label">{s}</div>
            <div className="stat-value" style={{ color: statusColor[s], fontSize: 20 }}>{wagons.filter(w => w.status === s).length} ваг.</div>
            <div className="stat-sub">{fmt(wagons.filter(w => w.status === s).reduce((a, b) => a + Number(b.amount || 0), 0))} т</div>
          </div>
        ))}
      </div>
      <div className="table-wrap">
        <div className="table-head">
          <span className="table-title">Вагоны (ЖД)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="form-input" style={{ width: 140 }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">Все</option><option value="в пути">В пути</option><option value="отгружен">Отгружены</option><option value="прибыл">Прибыли</option>
            </select>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Вагон</button>
          </div>
        </div>
        <table>
          <thead><tr><th>Номер</th><th>Дата</th><th>Культура</th><th>Тонн</th><th>Элеватор</th><th>Страна</th><th>Покупатель</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={9} className="empty">Нет вагонов</td></tr>}
            {filtered.map(w => (
              <tr key={w.id}>
                <td style={{ fontWeight: 700, fontFamily: "monospace", color: "var(--accent2)" }}>{w.number}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{w.date}</td>
                <td>{w.culture}</td>
                <td style={{ fontWeight: 600 }}>{w.amount}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{w.elevator?.replace(" ЭКП", "")}</td>
                <td>{w.country === "Таджикистан" ? "🇹🇯" : "🇺🇿"}</td>
                <td style={{ fontSize: 12 }}>{w.buyer}</td>
                <td><span className="status-dot" style={{ background: statusColor[w.status] }} /><span style={{ color: statusColor[w.status], fontSize: 12, fontWeight: 600 }}>{w.status}</span></td>
                <td><button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDelete(w.id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <Modal title="Добавить вагон" onClose={() => setShowAdd(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Отмена</button><button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? "Сохраняю..." : "Сохранить"}</button></>}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Номер вагона</label><input className="form-input" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="85441-КЗ" /></div>
            <div className="form-group"><label className="form-label">Дата погрузки</label><input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Культура</label><select className="form-input" value={form.culture} onChange={e => setForm({ ...form, culture: e.target.value })}>{CULTURES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Тонн</label><input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Элеватор</label><select className="form-input" value={form.elevator} onChange={e => setForm({ ...form, elevator: e.target.value })}>{ELEVATORS.map(el => <option key={el}>{el}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Страна</label><select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Покупатель</label><input className="form-input" value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Статус</label><select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>отгружен</option><option>в пути</option><option>прибыл</option></select></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const PAGES = [
  { id: "dashboard", label: "Дашборд", icon: "📊", section: "Обзор" },
  { id: "stock", label: "Зерно и остатки", icon: "🌾", section: "Закуп" },
  { id: "contracts", label: "Договоры закупа", icon: "📋", section: "Закуп" },
  { id: "orders", label: "Заявки клиентов", icon: "📬", section: "Продажи" },
  { id: "export", label: "Экспортные контракты", icon: "🌐", section: "Продажи" },
  { id: "wagons", label: "Вагоны (ЖД)", icon: "🚂", section: "Логистика" },
];

const PAGE_TITLES = { dashboard: "Главный дашборд", stock: "Зерно и остатки", contracts: "Договоры закупа", orders: "Заявки клиентов", export: "Экспортные контракты", wagons: "ЖД вагоны" };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [exportContracts, setExportContracts] = useState([]);
  const [wagons, setWagons] = useState([]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const [s, m, c, o, e, w] = await Promise.all([
        supabase.from("stock").select("*"),
        supabase.from("movements").select("*").order("created_at", { ascending: false }),
        supabase.from("contracts").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("export_contracts").select("*").order("created_at", { ascending: false }),
        supabase.from("wagons").select("*").order("created_at", { ascending: false }),
      ]);
      setStock(s.data || []);
      setMovements(m.data || []);
      setContracts(c.data || []);
      setOrders(o.data || []);
      setExportContracts(e.data || []);
      setWagons(w.data || []);
      setLoading(false);
    }
    loadAll();
  }, []);

  const sections = [...new Set(PAGES.map(p => p.section))];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-title">🌾 GRAIN CRM</div>
            <div className="logo-sub">КЗ → ТДЖ / УЗБ</div>
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
        <main className="main">
          <div className="topbar">
            <span className="topbar-title">{PAGE_TITLES[page]}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "var(--green)", background: "rgba(63,185,80,0.1)", padding: "4px 10px", borderRadius: 6 }}>● Онлайн</div>
              <div className="user-chip"><div className="user-avatar">Р</div><span>Руководитель</span></div>
            </div>
          </div>
          <div className="content">
            {loading ? (
              <div className="loading"><div className="spinner" /> Загружаю данные из базы...</div>
            ) : (
              <>
                {page === "dashboard" && <Dashboard stock={stock} wagons={wagons} contracts={contracts} exportContracts={exportContracts} orders={orders} />}
                {page === "stock" && <StockModule stock={stock} setStock={setStock} movements={movements} setMovements={setMovements} />}
                {page === "contracts" && <ContractsModule contracts={contracts} setContracts={setContracts} />}
                {page === "orders" && <OrdersModule orders={orders} setOrders={setOrders} stock={stock} />}
                {page === "export" && <ExportModule exportContracts={exportContracts} setExportContracts={setExportContracts} />}
                {page === "wagons" && <WagonsModule wagons={wagons} setWagons={setWagons} exportContracts={exportContracts} setStock={setStock} stock={stock} />}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
