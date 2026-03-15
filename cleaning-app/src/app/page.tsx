"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "high" | "medium" | "low";
type Status = "pending" | "in-progress" | "done";
type Tab = "dashboard" | "tasks" | "schedule" | "team";

interface Task {
  id: number;
  title: string;
  location: string;
  assignee: string;
  avatar: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  dueTime: string;
  category: string;
  progress: number;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  tasksToday: number;
  completed: number;
  rating: number;
  status: "available" | "busy" | "off";
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Deep Clean — Master Bedroom",
    location: "Unit 4B, Maple Tower",
    assignee: "Sofia M.",
    avatar: "SM",
    priority: "high",
    status: "in-progress",
    dueDate: "Today",
    dueTime: "10:00 AM",
    category: "Residential",
    progress: 60,
  },
  {
    id: 2,
    title: "Office Floor Sanitization",
    location: "Tech Hub, 3rd Floor",
    assignee: "James R.",
    avatar: "JR",
    priority: "high",
    status: "pending",
    dueDate: "Today",
    dueTime: "01:30 PM",
    category: "Commercial",
    progress: 0,
  },
  {
    id: 3,
    title: "Window & Glass Cleaning",
    location: "Sunrise Apartments, #12",
    assignee: "Lena K.",
    avatar: "LK",
    priority: "medium",
    status: "pending",
    dueDate: "Tomorrow",
    dueTime: "09:00 AM",
    category: "Residential",
    progress: 0,
  },
  {
    id: 4,
    title: "Kitchen & Appliance Deep Clean",
    location: "Green Villa, Block C",
    assignee: "Sofia M.",
    avatar: "SM",
    priority: "medium",
    status: "done",
    dueDate: "Today",
    dueTime: "08:00 AM",
    category: "Residential",
    progress: 100,
  },
  {
    id: 5,
    title: "Lobby & Common Areas",
    location: "Westfield Mall — South Wing",
    assignee: "Carlos D.",
    avatar: "CD",
    priority: "low",
    status: "done",
    dueDate: "Yesterday",
    dueTime: "06:00 AM",
    category: "Commercial",
    progress: 100,
  },
  {
    id: 6,
    title: "Post-Construction Cleanup",
    location: "New Build Site, Lot 7",
    assignee: "James R.",
    avatar: "JR",
    priority: "high",
    status: "pending",
    dueDate: "Mar 17",
    dueTime: "07:00 AM",
    category: "Specialty",
    progress: 0,
  },
];

const teamMembers: TeamMember[] = [
  { id: 1, name: "Sofia Martinez", role: "Senior Cleaner", avatar: "SM", tasksToday: 3, completed: 2, rating: 4.9, status: "busy" },
  { id: 2, name: "James Rivera", role: "Commercial Specialist", avatar: "JR", tasksToday: 2, completed: 0, rating: 4.7, status: "available" },
  { id: 3, name: "Lena Kovac", role: "Residential Cleaner", avatar: "LK", tasksToday: 2, completed: 1, rating: 4.8, status: "busy" },
  { id: 4, name: "Carlos Diaz", role: "Floor Technician", avatar: "CD", tasksToday: 1, completed: 1, rating: 4.6, status: "available" },
];

const schedule = [
  { time: "06:00 AM", task: "Lobby & Common Areas", assignee: "Carlos D.", location: "Westfield Mall", done: true },
  { time: "08:00 AM", task: "Kitchen & Appliance Deep Clean", assignee: "Sofia M.", location: "Green Villa", done: true },
  { time: "10:00 AM", task: "Deep Clean — Master Bedroom", assignee: "Sofia M.", location: "Unit 4B, Maple Tower", done: false, active: true },
  { time: "01:30 PM", task: "Office Floor Sanitization", assignee: "James R.", location: "Tech Hub, 3rd Floor", done: false },
  { time: "02:00 PM", task: "Window Cleaning", assignee: "Lena K.", location: "Sunrise Apartments", done: false },
  { time: "04:00 PM", task: "Carpet Steam Clean", assignee: "Carlos D.", location: "Oakwood Residence", done: false },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: Priority }) {
  const labels = { high: "High", medium: "Medium", low: "Low" };
  const cls = `priority-${priority}`;
  return (
    <span className={`${cls} text-xs font-semibold px-2 py-0.5 rounded-full`}>
      {labels[priority]}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map = {
    pending: { label: "Pending", cls: "status-pending" },
    "in-progress": { label: "In Progress", cls: "status-progress" },
    done: { label: "Done", cls: "status-done" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`${cls} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
      {label}
    </span>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  const colors: Record<string, string> = {
    SM: "from-violet-500 to-purple-600",
    JR: "from-blue-500 to-indigo-600",
    LK: "from-emerald-500 to-teal-600",
    CD: "from-amber-500 to-orange-600",
  };
  const grad = colors[initials] ?? "from-slate-500 to-slate-600";
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const nav: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "tasks", label: "Tasks", icon: "✓" },
    { id: "schedule", label: "Schedule", icon: "📅" },
    { id: "team", label: "Team", icon: "👥" },
  ];

  return (
    <aside className="sidebar-gradient w-64 min-h-screen flex flex-col text-white flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
            ✦
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">CleanPro</div>
            <div className="text-xs text-indigo-300 font-medium">Task Manager</div>
          </div>
        </div>
      </div>

      {/* Today's date */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="text-xs text-indigo-300 font-medium uppercase tracking-widest mb-0.5">Today</div>
        <div className="text-sm font-semibold text-white">Sunday, Mar 15, 2026</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left cursor-pointer border-0
              ${active === item.id
                ? "bg-white/15 text-white shadow-sm"
                : "text-indigo-200 hover:bg-white/8 hover:text-white"
              }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
            {item.id === "tasks" && (
              <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                6
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom profile */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/8 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">Admin</div>
            <div className="text-xs text-indigo-300 truncate">Manager</div>
          </div>
          <span className="text-indigo-400 text-xs">⚙</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ tasks, setActive }: { tasks: Task[]; setActive: (t: Tab) => void }) {
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const high = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;

  const stats = [
    { label: "Total Tasks", value: tasks.length, sub: "This week", cls: "stat-indigo", icon: "📋" },
    { label: "Completed", value: done, sub: `${Math.round((done / tasks.length) * 100)}% done`, cls: "stat-emerald", icon: "✅" },
    { label: "In Progress", value: inProgress, sub: "Active now", cls: "stat-amber", icon: "⚡" },
    { label: "High Priority", value: high, sub: "Needs attention", cls: "stat-rose", icon: "🔥" },
  ];

  const recent = tasks.filter((t) => t.status !== "done").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`${s.cls} rounded-2xl p-5 text-white shadow-lg hover-lift fade-in-up fade-in-up-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{s.icon}</div>
              <span className="text-white/60 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">{s.sub}</span>
            </div>
            <div className="text-4xl font-black mb-0.5">{s.value}</div>
            <div className="text-white/80 text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress overview + recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Completion chart */}
        <div className="glass-card rounded-2xl p-5 fade-in-up fade-in-up-5">
          <h3 className="font-bold text-slate-800 mb-4">Today&apos;s Progress</h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="56" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="70" cy="70" r="56" fill="none"
                  stroke="url(#prog-grad)" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - done / tasks.length)}`}
                  transform="rotate(-90 70 70)"
                />
                <defs>
                  <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{Math.round((done / tasks.length) * 100)}%</span>
                <span className="text-xs text-slate-500 font-medium">Complete</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {[
              { label: "Done", count: done, color: "bg-emerald-500" },
              { label: "In Progress", count: inProgress, color: "bg-amber-400" },
              { label: "Pending", count: pending, color: "bg-slate-300" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-sm text-slate-600">
                <span className={`${row.color} w-2.5 h-2.5 rounded-full flex-shrink-0`} />
                <span className="flex-1">{row.label}</span>
                <span className="font-semibold text-slate-800">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tasks */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5 fade-in-up fade-in-up-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Upcoming Tasks</h3>
            <button
              onClick={() => setActive("tasks")}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 cursor-pointer border-0 bg-transparent"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recent.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 cursor-pointer hover-lift">
                <Avatar initials={task.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{task.title}</div>
                  <div className="text-xs text-slate-500">{task.dueDate} · {task.dueTime}</div>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team activity */}
      <div className="glass-card rounded-2xl p-5 fade-in-up fade-in-up-6">
        <h3 className="font-bold text-slate-800 mb-4">Team Activity Today</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {teamMembers.map((m) => (
            <div key={m.id} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover-lift cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Avatar initials={m.avatar} size="sm" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">{m.name.split(" ")[0]}</div>
                  <div className={`flex items-center gap-1 text-[10px] font-medium ${
                    m.status === "busy" ? "text-amber-600" :
                    m.status === "available" ? "text-emerald-600" : "text-slate-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${
                      m.status === "busy" ? "bg-amber-500" :
                      m.status === "available" ? "bg-emerald-500" : "bg-slate-400"
                    }`} />
                    {m.status}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {m.completed}/{m.tasksToday} tasks done
              </div>
              <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  style={{ width: `${(m.completed / Math.max(m.tasksToday, 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

function TasksTab({ tasks, setTasks }: { tasks: Task[]; setTasks: (t: Task[]) => void }) {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", location: "", assignee: "", priority: "medium" as Priority, dueDate: "", dueTime: "" });

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const toggleStatus = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id !== id ? t :
        { ...t, status: t.status === "done" ? "pending" : t.status === "pending" ? "in-progress" : "done",
          progress: t.status === "done" ? 0 : t.status === "pending" ? 50 : 100 }
      )
    );
  };

  const deleteTask = (id: number) => setTasks(tasks.filter((t) => t.id !== id));

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const avatars: Record<string, string> = { "Sofia M.": "SM", "James R.": "JR", "Lena K.": "LK", "Carlos D.": "CD" };
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask.title,
        location: newTask.location || "TBD",
        assignee: newTask.assignee || "Unassigned",
        avatar: avatars[newTask.assignee] ?? newTask.assignee.slice(0, 2).toUpperCase(),
        priority: newTask.priority,
        status: "pending",
        dueDate: newTask.dueDate || "TBD",
        dueTime: newTask.dueTime || "",
        category: "Residential",
        progress: 0,
      },
    ]);
    setNewTask({ title: "", location: "", assignee: "", priority: "medium", dueDate: "", dueTime: "" });
    setShowModal(false);
  };

  const filters: { id: "all" | Status; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "done", label: "Done" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-slate-100">
          {filters.map((f) => (
            <button
              key={f.id}
              id={`filter-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer border-0 transition-all
                ${filter === f.id ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:bg-slate-100 bg-transparent"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          id="add-task-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 cursor-pointer border-0"
        >
          <span className="text-lg leading-none">+</span> Add Task
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-500">
            <div className="text-4xl mb-3">🎉</div>
            <div className="font-semibold">No tasks here!</div>
          </div>
        )}
        {filtered.map((task, i) => (
          <div
            key={task.id}
            className={`glass-card rounded-2xl p-4 hover-lift fade-in-up fade-in-up-${Math.min(i + 1, 6)} ${task.status === "done" ? "opacity-70" : ""}`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => toggleStatus(task.id)}
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 cursor-pointer flex items-center justify-center transition-all border-0
                  ${task.status === "done" ? "bg-emerald-500 border-emerald-500 text-white" :
                    task.status === "in-progress" ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-indigo-400"
                  }`}
                aria-label="Toggle task status"
              >
                {task.status === "done" && <span className="text-[10px] font-black">✓</span>}
                {task.status === "in-progress" && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-slate-800 ${task.status === "done" ? "line-through text-slate-400" : ""}`}>
                    {task.title}
                  </h4>
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
                <div className="text-sm text-slate-500 mb-2 flex flex-wrap gap-3">
                  <span>📍 {task.location}</span>
                  <span>🕐 {task.dueDate}{task.dueTime ? ` · ${task.dueTime}` : ""}</span>
                </div>
                {task.status === "in-progress" && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 font-medium w-8">{task.progress}%</span>
                  </div>
                )}
              </div>

              {/* Assignee + delete */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Avatar initials={task.avatar} size="sm" />
                  <span className="text-xs text-slate-600 font-medium hidden sm:block">{task.assignee}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 hover:text-rose-400 cursor-pointer border-0 bg-transparent text-lg leading-none p-1 rounded-lg hover:bg-rose-50"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">New Task</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent text-2xl leading-none">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Task Title *</label>
                <input
                  id="task-title-input"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="e.g. Deep Clean Living Room"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="e.g. Unit 3A, Maple Tower"
                  value={newTask.location}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Assignee</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 bg-white cursor-pointer"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    <option>Sofia M.</option>
                    <option>James R.</option>
                    <option>Lena K.</option>
                    <option>Carlos D.</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Priority</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 bg-white cursor-pointer"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Time</label>
                  <input
                    type="time"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  />
                </div>
              </div>
              <button
                id="submit-task-btn"
                onClick={addTask}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold cursor-pointer border-0 mt-1 shadow-lg shadow-indigo-200"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Schedule Tab ─────────────────────────────────────────────────────────────

function ScheduleTab() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-1">
      <h3 className="font-bold text-slate-800 text-lg mb-5">Today&apos;s Schedule — March 15, 2026</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[74px] top-3 bottom-3 w-0.5 bg-slate-100" />

        <div className="space-y-4">
          {schedule.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 fade-in-up fade-in-up-${Math.min(i + 1, 6)}`}
            >
              {/* Time */}
              <div className={`w-16 flex-shrink-0 text-right text-xs font-bold pt-2 ${item.done ? "text-slate-400" : item.active ? "text-indigo-600" : "text-slate-600"}`}>
                {item.time}
              </div>

              {/* Dot */}
              <div className="relative flex-shrink-0 mt-2 z-10">
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                  item.done ? "bg-emerald-400 border-emerald-500" :
                  item.active ? "bg-indigo-500 border-indigo-600 pulse-dot shadow-lg shadow-indigo-200" :
                  "bg-white border-slate-300"
                }`} />
              </div>

              {/* Card */}
              <div className={`flex-1 rounded-xl p-3 mb-1 hover-lift cursor-pointer ${
                item.done ? "bg-slate-50 opacity-60" :
                item.active ? "bg-indigo-50 border border-indigo-200 shadow-sm" :
                "bg-white border border-slate-100 shadow-sm"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={`font-semibold text-sm ${item.done ? "line-through text-slate-400" : item.active ? "text-indigo-800" : "text-slate-800"}`}>
                      {item.task}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.assignee} · {item.location}
                    </div>
                  </div>
                  {item.done && <span className="text-emerald-500 text-base flex-shrink-0">✓</span>}
                  {item.active && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Live</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────

function TeamTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {teamMembers.map((m, i) => (
        <div key={m.id} className={`glass-card rounded-2xl p-5 hover-lift cursor-pointer fade-in-up fade-in-up-${i + 1}`}>
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <Avatar initials={m.avatar} size="lg" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white pulse-dot ${
                m.status === "busy" ? "bg-amber-400" :
                m.status === "available" ? "bg-emerald-400" : "bg-slate-300"
              }`} />
            </div>
            <div className="font-bold text-slate-800 text-sm">{m.name}</div>
            <div className="text-xs text-slate-500 mb-3">{m.role}</div>

            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${
              m.status === "busy" ? "bg-amber-100 text-amber-700" :
              m.status === "available" ? "bg-emerald-100 text-emerald-700" :
              "bg-slate-100 text-slate-500"
            }`}>
              {m.status === "busy" ? "🔶 On task" : m.status === "available" ? "🟢 Available" : "⭘ Off today"}
            </div>

            <div className="w-full space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tasks today</span>
                <span className="font-semibold text-slate-800">{m.completed}/{m.tasksToday}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{ width: `${(m.completed / Math.max(m.tasksToday, 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Rating</span>
                <span className="font-semibold text-amber-500">⭐ {m.rating}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const tabTitles: Record<Tab, { title: string; sub: string }> = {
    dashboard: { title: "Good morning, Admin 👋", sub: "Here's what's happening today" },
    tasks: { title: "All Tasks", sub: `${tasks.length} tasks total · ${tasks.filter(t => t.status === "done").length} completed` },
    schedule: { title: "Today's Schedule", sub: "March 15, 2026 · 6 planned sessions" },
    team: { title: "Your Team", sub: `${teamMembers.length} members · ${teamMembers.filter(m => m.status === "available").length} available now` },
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar active={activeTab} setActive={setActiveTab} />

      <main className="flex-1 min-w-0 p-6 xl:p-8 overflow-auto">
        {/* Top header */}
        <div className="mb-7 fade-in-up">
          <h1 className="text-2xl font-black text-slate-800 mb-0.5">{tabTitles[activeTab].title}</h1>
          <p className="text-slate-500 text-sm">{tabTitles[activeTab].sub}</p>
        </div>

        {/* Tab content */}
        {activeTab === "dashboard" && <DashboardTab tasks={tasks} setActive={setActiveTab} />}
        {activeTab === "tasks" && <TasksTab tasks={tasks} setTasks={setTasks} />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "team" && <TeamTab />}
      </main>
    </div>
  );
}
