import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Command, Briefcase, FileText, Zap, 
    Settings, Users, Calculator, Trash2, Plus, ArrowRight,
    Scale, Feather, UserCheck, Building2, Gavel
} from 'lucide-react';
import { AppView } from '../types';
import { useLegalStore } from '../contexts/LegalStoreContext';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: AppView) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { cases, clients } = useLegalStore();

    const commands = [
        { id: AppView.DASHBOARD, label: 'Go to Dashboard', icon: Briefcase, category: 'Navigation' },
        { id: AppView.CASES, label: 'View Case Files', icon: Briefcase, category: 'Navigation' },
        { id: AppView.CLIENTS, label: 'Client Directory', icon: Users, category: 'Navigation' },
        { id: AppView.BRIEFS, label: 'Draft New Brief', icon: Feather, category: 'Tools' },
        { id: AppView.DRAFTER, label: 'Draft Instrument', icon: PenTool, category: 'Tools' },
        { id: AppView.RESEARCH, label: 'Legal Research', icon: Scale, category: 'Tools' },
        { id: AppView.SETTINGS, label: 'Firm Settings', icon: Settings, category: 'System' },
    ];

    // Filtered items based on query
    const filteredCommands = commands.filter(c => 
        c.label.toLowerCase().includes(query.toLowerCase()) || 
        c.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            const selected = filteredCommands[selectedIndex];
            if (selected) {
                onNavigate(selected.id as AppView);
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
            <div className="fixed inset-0 bg-legal-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 ring-1 ring-black/5 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center px-8 border-b border-slate-100 bg-slate-50/50">
                    <Search className="text-slate-400 mr-4" size={24} />
                    <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Search modules, cases, or type a command..."
                        className="w-full py-8 text-xl font-serif italic text-legal-900 bg-transparent outline-none placeholder:text-slate-300"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm ml-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ESC</span>
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, idx) => {
                            const Icon = cmd.icon;
                            return (
                                <button 
                                    key={cmd.label}
                                    onClick={() => { onNavigate(cmd.id as AppView); onClose(); }}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                        idx === selectedIndex ? 'bg-legal-900 text-white shadow-xl translate-x-1' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            idx === selectedIndex ? 'bg-legal-gold text-legal-900' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-black uppercase tracking-widest text-[11px] ${idx === selectedIndex ? 'text-white' : 'text-legal-900'}`}>{cmd.label}</p>
                                            <p className={`text-[9px] uppercase tracking-widest font-medium mt-0.5 opacity-60`}>{cmd.category}</p>
                                        </div>
                                    </div>
                                    {idx === selectedIndex && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mr-2">Execute</span>
                                            <Plus size={16} className="text-legal-gold" />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center">
                            <Zap size={48} className="mx-auto text-slate-100 mb-6" />
                            <p className="font-serif italic text-slate-400 text-xl">No commands matching protocol.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-8">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400">↑↓</div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400">ENTER</div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <Command size={14} className="text-slate-300" />
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest tracking-tighter italic">LexiNaija Professional Interface v2.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PenTool = FileText; // Fallback
