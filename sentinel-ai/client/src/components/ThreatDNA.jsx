import { motion } from 'framer-motion';
import { AlertTriangle, User, Link2, ShieldAlert, Skull } from 'lucide-react';

const DNA_ITEMS = [
  { key: 'urgency', label: 'Urgency', icon: AlertTriangle, color: '#FF2D55' },
  { key: 'impersonation', label: 'Impersonation', icon: User, color: '#FFB300' },
  { key: 'link_manipulation', label: 'Link Manipulation', icon: Link2, color: '#A855F7' },
  { key: 'authority_abuse', label: 'Authority Abuse', icon: ShieldAlert, color: '#00D9FF' },
  { key: 'fear_tactics', label: 'Fear Tactics', icon: Skull, color: '#FF6B6B' },
];

export default function ThreatDNA({ dna = {} }) {
  return (
    <div className="space-y-3">
      {DNA_ITEMS.map((item, i) => {
        const value = dna[item.key] || 0;
        const Icon = item.icon;
        return (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                <span className="text-xs text-sentinel-text-dim">{item.label}</span>
              </div>
              <span className="text-xs font-mono font-semibold" style={{ color: item.color }}>
                {value}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                  boxShadow: `0 0 10px ${item.color}40`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
