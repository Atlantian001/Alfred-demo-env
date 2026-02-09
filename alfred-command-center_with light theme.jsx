import { useState, useEffect, useRef } from "react";

const DARK_COLORS = {
  bg: "#0B0E14",
  surface: "#131720",
  surfaceHover: "#1A1F2B",
  border: "#1E2433",
  borderActive: "#2A3345",
  text: "#E8ECF4",
  textMuted: "#7A8599",
  textDim: "#4A5568",
  accent: "#22D3EE",
  accentDim: "rgba(34,211,238,0.12)",
  accentGlow: "rgba(34,211,238,0.25)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.12)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.12)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,0.12)",
  purple: "#A78BFA",
  purpleDim: "rgba(167,139,250,0.12)",
};

const LIGHT_COLORS = {
  bg: "#FFFFFF",
  surface: "#F8F9FA",
  surfaceHover: "#F1F3F5",
  border: "#E9ECEF",
  borderActive: "#DEE2E6",
  text: "#212529",
  textMuted: "#6C757D",
  textDim: "#ADB5BD",
  accent: "#0891B2",
  accentDim: "rgba(8,145,178,0.08)",
  accentGlow: "rgba(8,145,178,0.15)",
  green: "#10B981",
  greenDim: "rgba(16,185,129,0.08)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.08)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.08)",
  purple: "#8B5CF6",
  purpleDim: "rgba(139,92,246,0.08)",
};

// --- MOCK DATA ---
const pulseData = {
  revenue: { value: "$142,800", change: "+12.5%", trend: "up", label: "Monthly Revenue" },
  orders: { value: "3,847", change: "+8.2%", trend: "up", label: "Orders" },
  adSpend: { value: "$28,400", change: "-3.1%", trend: "down", label: "Ad Spend" },
  roas: { value: "5.03x", change: "+18.7%", trend: "up", label: "Return on Ad Spend" },
  tasksCompleted: { value: "89%", change: "+4%", trend: "up", label: "Tasks Completed" },
  clientHealth: { value: "84", change: "+2", trend: "up", label: "Client Health Score" },
};

const revenueChart = [
  { month: "Aug", value: 98000 },
  { month: "Sep", value: 105000 },
  { month: "Oct", value: 112000 },
  { month: "Nov", value: 118000 },
  { month: "Dec", value: 127000 },
  { month: "Jan", value: 142800 },
];

const topProducts = [
  { name: "Hydra Serum Pro", revenue: "$24,200", units: 842, trend: "+22%" },
  { name: "CloudFit Joggers", revenue: "$18,900", units: 631, trend: "+15%" },
  { name: "ZenBrew Matcha Kit", revenue: "$14,600", units: 487, trend: "+31%" },
  { name: "LuxGlow Night Cream", revenue: "$12,100", units: 403, trend: "+8%" },
  { name: "TerraFit Resistance Set", revenue: "$9,800", units: 326, trend: "-2%" },
];

const brandHealth = [
  { name: "Vinthentic", health: 94, revenue: "$38,200", trend: "+26%", status: "thriving" },
  { name: "Carlotta Beauty", health: 91, revenue: "$32,100", trend: "+27%", status: "thriving" },
  { name: "ZenBrew", health: 82, revenue: "$28,400", trend: "+11%", status: "stable" },
  { name: "CloudFit", health: 78, revenue: "$22,800", trend: "+5%", status: "stable" },
  { name: "Nuit Skincare", health: 58, revenue: "$12,400", trend: "-6%", status: "attention" },
  { name: "Fitizen", health: 42, revenue: "$8,900", trend: "-28%", status: "critical" },
];

const alerts = [
  {
    id: 1,
    severity: "critical",
    title: "Fitizen ad spend burning cash",
    description: "Meta campaign CPC up 62% in 7 days. ROAS dropped below 1.8x. At current burn rate, $4,200 will be wasted this week.",
    action: "Pause underperforming ad sets",
    time: "12 min ago",
    category: "Marketing",
  },
  {
    id: 2,
    severity: "critical",
    title: "Client at risk: Nuit Skincare",
    description: "3 negative sentiment signals detected this week. Last email mentioned 'disappointed with results' and 'considering other options'.",
    action: "Schedule urgent check-in call",
    time: "1 hr ago",
    category: "Client Health",
  },
  {
    id: 3,
    severity: "warning",
    title: "Inventory alert: Hydra Serum Pro",
    description: "At current sell-through rate, stock runs out in 11 days. Reorder lead time is 14 days. You'll have a 3-day gap.",
    action: "Trigger reorder now",
    time: "2 hrs ago",
    category: "Operations",
  },
  {
    id: 4,
    severity: "warning",
    title: "Invoice overdue: Vendor MediaPixel",
    description: "$3,800 invoice is 15 days past due. This vendor handles creative assets for 3 brands. Risk of service pause.",
    action: "Send payment reminder",
    time: "3 hrs ago",
    category: "Finance",
  },
  {
    id: 5,
    severity: "info",
    title: "ZenBrew Matcha Kit trending on TikTok",
    description: "Organic mentions up 340% in 48hrs. 2 micro-influencers posted unpaid reviews. Estimated earned media value: $8,200.",
    action: "Boost top-performing organic content",
    time: "4 hrs ago",
    category: "Marketing",
  },
  {
    id: 6,
    severity: "info",
    title: "CloudFit email campaign outperforming",
    description: "Abandoned cart sequence hitting 8.2% conversion (benchmark: 4.5%). Consider applying this template to other brands.",
    action: "Clone template to Vinthentic",
    time: "5 hrs ago",
    category: "Marketing",
  },
];

const workflows = [
  {
    id: 1, name: "Weekly Client Reporting", status: "active", progress: 72,
    owner: "Alfred", tasks: 8, completed: 6, dueIn: "2 days",
    subtasks: [
      { name: "Pull Shopify revenue data", done: true, by: "Alfred" },
      { name: "Compile ad performance", done: true, by: "Alfred" },
      { name: "Generate narrative summary", done: true, by: "Alfred" },
      { name: "Calculate client ROI", done: true, by: "Alfred" },
      { name: "Draft client email", done: true, by: "Alfred" },
      { name: "QA review", done: true, by: "Sarah M." },
      { name: "Client approval", done: false, by: "Waiting" },
      { name: "Send final report", done: false, by: "Alfred" },
    ]
  },
  {
    id: 2, name: "Fitizen Campaign Audit", status: "overdue", progress: 30,
    owner: "Marcus T.", tasks: 10, completed: 3, dueIn: "Overdue by 1 day",
    subtasks: [
      { name: "Export last 30-day campaign data", done: true, by: "Alfred" },
      { name: "Identify top/bottom ad sets", done: true, by: "Alfred" },
      { name: "Review creative assets", done: true, by: "Marcus T." },
      { name: "Audience overlap analysis", done: false, by: "Marcus T." },
      { name: "Competitor benchmarking", done: false, by: "Marcus T." },
    ]
  },
  {
    id: 3, name: "New Brand Onboarding: TerraCraft", status: "active", progress: 45,
    owner: "Sarah M.", tasks: 12, completed: 5, dueIn: "5 days",
    subtasks: [
      { name: "Shopify store setup", done: true, by: "Alfred" },
      { name: "Product catalog import", done: true, by: "Alfred" },
      { name: "Brand guidelines uploaded", done: true, by: "Sarah M." },
      { name: "Meta ad account connected", done: true, by: "Alfred" },
      { name: "Google Ads setup", done: true, by: "Alfred" },
      { name: "Email sequences configured", done: false, by: "Sarah M." },
    ]
  },
  {
    id: 4, name: "Monthly P&L Compilation", status: "active", progress: 88,
    owner: "Alfred", tasks: 6, completed: 5, dueIn: "Tomorrow",
    subtasks: [
      { name: "Pull all revenue streams", done: true, by: "Alfred" },
      { name: "Reconcile ad spend across platforms", done: true, by: "Alfred" },
      { name: "Calculate COGS per brand", done: true, by: "Alfred" },
      { name: "Compile vendor payments", done: true, by: "Alfred" },
      { name: "Generate P&L per brand", done: true, by: "Alfred" },
      { name: "Manager review & sign-off", done: false, by: "Irthu" },
    ]
  },
];

const teamActivity = [
  { name: "Alfred", role: "AI Operations", tasks: 34, completed: 34, avatar: "🤖" },
  { name: "Sarah M.", role: "Brand Manager", tasks: 12, completed: 9, avatar: "SM" },
  { name: "Marcus T.", role: "Performance Marketer", tasks: 8, completed: 4, avatar: "MT" },
  { name: "Priya K.", role: "Creative Lead", tasks: 6, completed: 5, avatar: "PK" },
];

const financialData = {
  totalRevenue: "$142,800",
  totalCosts: "$68,200",
  grossProfit: "$74,600",
  margin: "52.2%",
  monthOverMonth: "+12.5%",
};

const brandPnL = [
  { name: "Vinthentic", revenue: 38200, costs: 14800, profit: 23400, margin: "61.3%" },
  { name: "Carlotta Beauty", revenue: 32100, costs: 15200, profit: 16900, margin: "52.6%" },
  { name: "ZenBrew", revenue: 28400, costs: 12600, profit: 15800, margin: "55.6%" },
  { name: "CloudFit", revenue: 22800, costs: 11400, profit: 11400, margin: "50.0%" },
  { name: "Nuit Skincare", revenue: 12400, costs: 8200, profit: 4200, margin: "33.9%" },
  { name: "Fitizen", revenue: 8900, costs: 6000, profit: 2900, margin: "32.6%" },
];

const cashFlow = [
  { month: "Aug", inflow: 98000, outflow: 42000 },
  { month: "Sep", inflow: 105000, outflow: 48000 },
  { month: "Oct", inflow: 112000, outflow: 51000 },
  { month: "Nov", inflow: 118000, outflow: 54000 },
  { month: "Dec", inflow: 127000, outflow: 59000 },
  { month: "Jan", inflow: 142800, outflow: 68200 },
];

const invoices = [
  { vendor: "MediaPixel Studios", amount: "$3,800", due: "15 days overdue", status: "overdue" },
  { vendor: "CloudHost Pro", amount: "$840", due: "Due in 2 days", status: "pending" },
  { vendor: "ShipFast Logistics", amount: "$2,200", due: "Due in 5 days", status: "pending" },
  { vendor: "AdCreative Agency", amount: "$6,500", due: "Paid", status: "paid" },
];

// --- COMPONENTS ---

function Card({ children, className = "", COLORS }) {
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 20,
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.borderActive}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
    className={className}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, change, trend, COLORS }) {
  return (
    <Card COLORS={COLORS}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: COLORS.text }}>{value}</span>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 4,
          padding: "4px 8px",
          borderRadius: 6,
          background: trend === "up" ? COLORS.greenDim : COLORS.redDim,
        }}>
          <span style={{ fontSize: 16 }}>{trend === "up" ? "↗" : "↘"}</span>
          <span style={{ 
            fontSize: 12, 
            fontWeight: 600,
            color: trend === "up" ? COLORS.green : COLORS.red,
          }}>
            {change}
          </span>
        </div>
      </div>
    </Card>
  );
}

function LineChart({ data, height = 120, COLORS }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxVal) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ position: "relative", height, marginTop: 12 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="url(#chartGradient)"
          stroke="none"
          points={`0,100 ${points} 100,100`}
        />
        <polyline
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="0.5"
          points={points}
        />
      </svg>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginTop: 8,
        fontSize: 10,
        color: COLORS.textDim,
        fontFamily: "'Space Mono', monospace",
      }}>
        {data.map((d, i) => (
          <span key={i}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, height = 140, COLORS }) {
  const maxVal = Math.max(...data.flatMap(d => [d.inflow, d.outflow]));
  
  return (
    <div style={{ position: "relative", height, display: "flex", alignItems: "flex-end", gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: height - 20 }}>
            <div style={{
              flex: 1,
              height: `${(d.inflow / maxVal) * 100}%`,
              background: COLORS.accent,
              borderRadius: "3px 3px 0 0",
              minHeight: 2,
              transition: "height 0.3s ease",
            }} />
            <div style={{
              flex: 1,
              height: `${(d.outflow / maxVal) * 100}%`,
              background: COLORS.red,
              borderRadius: "3px 3px 0 0",
              minHeight: 2,
              transition: "height 0.3s ease",
            }} />
          </div>
          <span style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'Space Mono', monospace" }}>
            {d.month}
          </span>
        </div>
      ))}
    </div>
  );
}

// --- SCREENS ---

function PulseScreen({ COLORS }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {Object.entries(pulseData).map(([key, data]) => (
          <MetricCard key={key} {...data} COLORS={COLORS} />
        ))}
      </div>

      {/* Revenue Trend */}
      <Card COLORS={COLORS}>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          Revenue Trend
        </div>
        <LineChart data={revenueChart} height={160} COLORS={COLORS} />
      </Card>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Top Products */}
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Top Products
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topProducts.map((p, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < topProducts.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>{p.units} units</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>{p.revenue}</div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: p.trend.startsWith("+") ? COLORS.green : COLORS.red,
                  }}>
                    {p.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Brand Health */}
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Brand Health
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {brandHealth.map((b, i) => (
              <div key={i} style={{
                padding: "10px 12px",
                background: COLORS.bg,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{b.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: b.status === "thriving" ? COLORS.green : 
                             b.status === "stable" ? COLORS.accent :
                             b.status === "attention" ? COLORS.amber : COLORS.red,
                    }}>
                      {b.health}
                    </span>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: b.status === "thriving" ? COLORS.green :
                                  b.status === "stable" ? COLORS.accent :
                                  b.status === "attention" ? COLORS.amber : COLORS.red,
                      boxShadow: `0 0 6px ${b.status === "thriving" ? COLORS.green :
                                            b.status === "stable" ? COLORS.accent :
                                            b.status === "attention" ? COLORS.amber : COLORS.red}`,
                    }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textDim }}>{b.revenue} revenue</span>
                  <span style={{
                    fontWeight: 600,
                    color: b.trend.startsWith("+") ? COLORS.green : COLORS.red,
                  }}>
                    {b.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Activity */}
      <Card COLORS={COLORS}>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          Team Activity
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {teamActivity.map((member, i) => (
            <div key={i} style={{
              padding: 14,
              background: COLORS.bg,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: member.name === "Alfred" ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})` : COLORS.surface,
                  border: member.name !== "Alfred" ? `1px solid ${COLORS.border}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: member.name === "Alfred" ? 18 : 12,
                  fontWeight: 700,
                  color: member.name === "Alfred" ? COLORS.bg : COLORS.text,
                }}>
                  {member.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim }}>{member.role}</div>
                </div>
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: COLORS.textMuted }}>Tasks</span>
                  <span style={{ color: COLORS.text, fontWeight: 600 }}>{member.completed}/{member.tasks}</span>
                </div>
                <div style={{
                  height: 4,
                  background: COLORS.border,
                  borderRadius: 2,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${(member.completed / member.tasks) * 100}%`,
                    background: member.completed === member.tasks ? COLORS.green : COLORS.accent,
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AlertsScreen({ COLORS }) {
  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {alerts.map((alert) => (
        <Card key={alert.id} COLORS={COLORS}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{
              width: 8,
              borderRadius: 4,
              background: alert.severity === "critical" ? COLORS.red :
                          alert.severity === "warning" ? COLORS.amber : COLORS.accent,
              boxShadow: `0 0 8px ${alert.severity === "critical" ? COLORS.red :
                                    alert.severity === "warning" ? COLORS.amber : COLORS.accent}`,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{alert.title}</span>
                    <span style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: alert.severity === "critical" ? COLORS.redDim :
                                  alert.severity === "warning" ? COLORS.amberDim : COLORS.accentDim,
                      color: alert.severity === "critical" ? COLORS.red :
                             alert.severity === "warning" ? COLORS.amber : COLORS.accent,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}>
                      {alert.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>{alert.description}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>
                    <span style={{ marginRight: 12 }}>{alert.category}</span>
                    <span>·</span>
                    <span style={{ marginLeft: 12 }}>{alert.time}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(alert.id)}
                style={{
                  marginTop: 10,
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: alert.severity === "critical" ? COLORS.red :
                              alert.severity === "warning" ? COLORS.amber : COLORS.accent,
                  color: COLORS.bg,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                {alert.action}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function WorkflowsScreen({ COLORS }) {
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {workflows.map((workflow) => (
        <Card key={workflow.id} COLORS={COLORS}>
          <div
            onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: workflow.status === "overdue" ? COLORS.red :
                              workflow.status === "active" ? COLORS.green : COLORS.textDim,
                  boxShadow: `0 0 6px ${workflow.status === "overdue" ? COLORS.red :
                                        workflow.status === "active" ? COLORS.green : COLORS.textDim}`,
                }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{workflow.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                  Due: <span style={{
                    fontWeight: 600,
                    color: workflow.status === "overdue" ? COLORS.red : COLORS.text,
                  }}>{workflow.dueIn}</span>
                </span>
                <span style={{ fontSize: 18, color: COLORS.textMuted }}>
                  {expandedWorkflow === workflow.id ? "−" : "+"}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: COLORS.textMuted }}>Progress: {workflow.completed}/{workflow.tasks} tasks</span>
                <span style={{ color: COLORS.text, fontWeight: 600 }}>{workflow.progress}%</span>
              </div>
              <div style={{
                height: 6,
                background: COLORS.border,
                borderRadius: 3,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${workflow.progress}%`,
                  background: workflow.status === "overdue" ? COLORS.red :
                              workflow.progress === 100 ? COLORS.green : COLORS.accent,
                  transition: "width 0.3s ease",
                }} />
              </div>
            </div>

            <div style={{ fontSize: 11, color: COLORS.textDim }}>
              Owner: <span style={{ color: COLORS.text, fontWeight: 600 }}>{workflow.owner}</span>
            </div>
          </div>

          {expandedWorkflow === workflow.id && workflow.subtasks && (
            <div style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: `1px solid ${COLORS.border}`,
            }}>
              {workflow.subtasks.map((task, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: i < workflow.subtasks.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}>
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `2px solid ${task.done ? COLORS.green : COLORS.border}`,
                    background: task.done ? COLORS.green : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {task.done && <span style={{ fontSize: 10, color: COLORS.bg }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: 12,
                    color: task.done ? COLORS.textMuted : COLORS.text,
                    textDecoration: task.done ? "line-through" : "none",
                    flex: 1,
                  }}>
                    {task.name}
                  </span>
                  <span style={{ fontSize: 11, color: COLORS.textDim }}>
                    {task.by}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function MoneyScreen({ COLORS }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Financial Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Total Revenue
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.green }}>{financialData.totalRevenue}</div>
        </Card>
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Total Costs
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.red }}>{financialData.totalCosts}</div>
        </Card>
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Gross Profit
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.accent }}>{financialData.grossProfit}</div>
        </Card>
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Margin
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text }}>{financialData.margin}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Brand P&L */}
        <Card COLORS={COLORS}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Brand P&L
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 80px 60px",
            gap: 8,
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase" }}>Brand</span>
            <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase" }}>Revenue</span>
            <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase" }}>Costs</span>
            <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase" }}>Profit</span>
            <span style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase" }}>Margin</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {brandPnL.map((b, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 60px", gap: 8, padding: "10px 0",
                borderBottom: i < brandPnL.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}>
                <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{b.name}</span>
                <span style={{ fontSize: 13, color: COLORS.green }}>${(b.revenue / 1000).toFixed(1)}k</span>
                <span style={{ fontSize: 13, color: COLORS.red }}>${(b.costs / 1000).toFixed(1)}k</span>
                <span style={{ fontSize: 13, color: COLORS.accent, fontWeight: 600 }}>${(b.profit / 1000).toFixed(1)}k</span>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: parseFloat(b.margin) > 50 ? COLORS.green : parseFloat(b.margin) > 40 ? COLORS.amber : COLORS.red,
                }}>{b.margin}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Cash Flow */}
        <Card COLORS={COLORS}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.03em" }}>Cash Flow</span>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.accent }} />
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>Inflow</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.red }} />
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>Outflow</span>
              </div>
            </div>
          </div>
          <BarChart data={cashFlow} height={180} COLORS={COLORS} />
        </Card>
      </div>

      {/* Invoices */}
      <Card COLORS={COLORS}>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.03em" }}>Invoice Tracker</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {invoices.map((inv, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0",
              borderBottom: i < invoices.length - 1 ? `1px solid ${COLORS.border}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: inv.status === "overdue" ? COLORS.red : inv.status === "pending" ? COLORS.amber : COLORS.green,
                  boxShadow: `0 0 6px ${inv.status === "overdue" ? COLORS.red : inv.status === "pending" ? COLORS.amber : COLORS.green}`,
                }} />
                <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{inv.vendor}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{inv.amount}</span>
                <span style={{
                  fontSize: 12,
                  color: inv.status === "overdue" ? COLORS.red : inv.status === "pending" ? COLORS.amber : COLORS.textDim,
                }}>{inv.due}</span>
                {inv.status === "overdue" && (
                  <button style={{
                    padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 600, background: COLORS.redDim, color: COLORS.red,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.background = COLORS.red}
                  onMouseLeave={(e) => e.target.style.background = COLORS.redDim}
                  >Send Reminder</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// --- MAIN APP ---

const tabs = [
  { id: "pulse", label: "The Pulse", icon: "◉" },
  { id: "alerts", label: "Alfred's Alerts", icon: "⚡" },
  { id: "workflows", label: "Workflows", icon: "↻" },
  { id: "money", label: "The Money", icon: "$" },
];

export default function AlfredCommandCenter() {
  const [activeTab, setActiveTab] = useState("pulse");
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);
  
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 28px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: "rgba(11,14,20,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.purple} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, fontWeight: 700, color: COLORS.bg,
            boxShadow: `0 4px 12px ${COLORS.accentGlow}`,
          }}>A</div>
          <div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>Alfred</span>
            <span style={{ fontSize: 12, color: COLORS.textDim, marginLeft: 10 }}>Command Center</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.surface,
              color: COLORS.text,
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = COLORS.surfaceHover;
              e.target.style.borderColor = COLORS.borderActive;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = COLORS.surface;
              e.target.style.borderColor = COLORS.border;
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 20,
            background: COLORS.greenDim,
            border: `1px solid ${COLORS.green}20`,
          }}>
            <div style={{ 
              width: 6, height: 6, borderRadius: "50%", 
              background: COLORS.green, 
              animation: "pulse 2s infinite",
              boxShadow: `0 0 6px ${COLORS.green}`,
            }} />
            <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, letterSpacing: "0.03em" }}>ALL SYSTEMS LIVE</span>
          </div>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "'Space Mono', monospace" }}>
            {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: "flex", gap: 2, padding: "0 28px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? COLORS.accent : COLORS.textMuted,
              background: "transparent",
              borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", gap: 7,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span style={{ fontSize: 15 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px", maxWidth: 1400, margin: "0 auto" }}>
        {activeTab === "pulse" && <PulseScreen COLORS={COLORS} />}
        {activeTab === "alerts" && <AlertsScreen COLORS={COLORS} />}
        {activeTab === "workflows" && <WorkflowsScreen COLORS={COLORS} />}
        {activeTab === "money" && <MoneyScreen COLORS={COLORS} />}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}
