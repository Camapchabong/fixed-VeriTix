import React from 'react';

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl py-16 flex flex-col items-center justify-center">
    {icon && (
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 text-slate-600">
        {icon}
      </div>
    )}
    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
    {description && <p className="text-slate-600 text-[13px]">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
