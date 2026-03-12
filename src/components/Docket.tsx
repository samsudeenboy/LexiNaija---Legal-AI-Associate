import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus, AlertCircle, Gavel, Sparkles, Filter } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { generateDailyBrief } from '../services/geminiService';
import { Task } from '../types';
import ReactMarkdown from 'react-markdown';

export const Docket: React.FC = () => {
  const { cases, tasks, addTask, updateTask, deleteTask } = useLegalStore();
  const [showModal, setShowModal] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [filter, setFilter] = useState<'All' | 'High' | 'Court'>('All');

  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: 'Medium',
    status: 'Pending',
    title: '',
    caseId: ''
  });

  // Combine Hearings and Tasks into one chronological list
  const upcomingHearings = cases
    .filter(c => c.nextHearing && c.status !== 'Closed')
    .map(c => ({
      id: `hearing-${c.id}`,
      type: 'Hearing',
      title: `Court: ${c.title}`,
      date: new Date(c.nextHearing!),
      priority: 'High',
      caseId: c.id,
      suitNumber: c.suitNumber,
      court: c.court,
      status: 'Pending'
    }));

  const allItems = [
    ...upcomingHearings,
    ...tasks.map(t => ({ ...t, type: 'Task', date: new Date(t.dueDate) }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const filteredItems = allItems.filter(item => {
    if (filter === 'High') return item.priority === 'High';
    if (filter === 'Court') return item.type === 'Hearing';
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.dueDate) {
      addTask({
        id: Date.now().toString(),
        title: newTask.title,
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority as any,
        status: 'Pending',
        caseId: newTask.caseId
      });
      setShowModal(false);
      setNewTask({ priority: 'Medium', status: 'Pending', title: '', caseId: '' });
    }
  };

  const toggleTaskStatus = (task: any) => {
    if (task.type === 'Hearing') return; // Cannot check off hearings easily in this view
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    updateTask(task.id, { status: newStatus });
  };

  const handleGenerateBrief = async () => {
    setGeneratingBrief(true);
    const scheduleSummary = filteredItems.slice(0, 5).map(i => 
      `- ${i.date.toDateString()}: ${i.type} - ${i.title} (${i.priority})`
    ).join('\n');
    
    const result = await generateDailyBrief(scheduleSummary);
    setBrief(result);
    setGeneratingBrief(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-serif font-bold text-legal-900">Court Diary & Tasks</h2>
          <p className="text-gray-500 text-sm mt-1">Manage deadlines, court appearances, and administrative duties.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleGenerateBrief}
                disabled={generatingBrief}
                className="bg-white border border-legal-200 text-legal-900 px-4 py-2 rounded-lg hover:bg-legal-50 flex items-center gap-2 text-sm font-medium shadow-sm"
            >
                <Sparkles size={16} className={generatingBrief ? "animate-pulse text-legal-gold" : "text-legal-gold"} />
                {generatingBrief ? "Generating Brief..." : "Daily Brief"}
            </button>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-legal-900 text-white px-4 py-2 rounded-lg hover:bg-legal-800 flex items-center gap-2 text-sm font-medium shadow-sm"
            >
                <Plus size={16} /> New Task
            </button>
        </div>
      </div>

      {brief && (
        <div className="mb-6 bg-gradient-to-r from-legal-900 to-legal-800 rounded-xl p-6 text-white shadow-lg shrink-0 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif font-bold flex items-center gap-2"><Sparkles size={16} className="text-legal-gold"/> Executive Brief</h3>
                <button onClick={() => setBrief(null)} className="text-gray-400 hover:text-white text-xs">Dismiss</button>
            </div>
            <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{brief}</ReactMarkdown>
        </div>
      )}

      <div className="flex gap-4 mb-4 shrink-0">
          {['All', 'High', 'Court'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-legal-100 text-legal-900 border border-legal-200' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  {f === 'All' ? 'All Items' : f === 'High' ? 'High Priority' : 'Court Dates'}
              </button>
          ))}
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
            {filteredItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                    <CalendarIcon className="w-12 h-12 mb-3 opacity-20"/>
                    <p>No upcoming items found.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {filteredItems.map((item) => {
                        const isOverdue = new Date() > item.date && item.status !== 'Completed';
                        const isToday = new Date().toDateString() === item.date.toDateString();
                        
                        return (
                            <div key={item.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${item.status === 'Completed' ? 'opacity-50' : ''}`}>
                                <button 
                                    onClick={() => toggleTaskStatus(item)}
                                    disabled={item.type === 'Hearing'}
                                    className={`shrink-0 ${item.type === 'Hearing' ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                    {item.status === 'Completed' ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : item.type === 'Hearing' ? (
                                        <Gavel className="w-5 h-5 text-legal-900" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300 hover:text-legal-gold" />
                                    )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                            item.type === 'Hearing' ? 'bg-legal-900 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {item.type}
                                        </span>
                                        {item.priority === 'High' && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-red-100 text-red-700 flex items-center gap-1">
                                                <AlertCircle size={10} /> Urgent
                                            </span>
                                        )}
                                        {item.caseId && (
                                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                • {cases.find(c => c.id === item.caseId)?.title || 'Unknown Case'}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`font-medium text-gray-900 truncate ${item.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                                        {item.title}
                                    </h3>
                                    {item.type === 'Hearing' && item.court && (
                                        <p className="text-xs text-gray-500 mt-0.5">{item.court} • {item.suitNumber}</p>
                                    )}
                                </div>

                                <div className="text-right shrink-0">
                                    <div className={`flex items-center justify-end gap-1.5 text-sm font-medium ${isOverdue ? 'text-red-600' : isToday ? 'text-green-600' : 'text-gray-600'}`}>
                                        <CalendarIcon size={14} />
                                        {isToday ? 'Today' : item.date.toLocaleDateString()}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                
                                {item.type === 'Task' && (
                                    <button onClick={() => deleteTask(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded">
                                        <Filter className="w-4 h-4" /> {/* Using Filter as delete/menu placeholder or trash if available */}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-legal-900">Add New Task</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <form onSubmit={handleAddTask} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                            placeholder="e.g. Call Registrar at High Court"
                            value={newTask.title}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input 
                                required
                                type="datetime-local" 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none text-sm"
                                onChange={e => setNewTask({...newTask, dueDate: e.target.value as any})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                                value={newTask.priority}
                                onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link to Case (Optional)</label>
                        <select 
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                            value={newTask.caseId}
                            onChange={e => setNewTask({...newTask, caseId: e.target.value})}
                        >
                            <option value="">-- No Case Link --</option>
                            {cases.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-legal-900 text-white font-medium py-2.5 rounded-lg hover:bg-legal-800 transition-colors">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};