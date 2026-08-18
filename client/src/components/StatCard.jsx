import React from 'react';
import { GlassCard } from './GlassCard';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'brand',
  delay = 0,
}) => {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };

  return (
    <GlassCard delay={delay} className="flex items-center justify-between relative overflow-hidden">
      <div>
        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">{title}</p>
        <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {trend}
            </span>
            {trendLabel && <span className="text-xs text-slate-400">{trendLabel}</span>}
          </div>
        )}
      </div>

      {Icon && (
        <div className={`p-3.5 rounded-xl border backdrop-blur-md ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </GlassCard>
  );
};
