"use client";
import React from "react";

type GroupedPermissions = Record<string, string[]>;

interface Props {
    slugCaption?: string | null;
    data: GroupedPermissions;
    // optional: max height untuk scroll, default 16rem
    maxH?: string;
}

export default function RolePermissionsTable({ slugCaption = "", data, maxH = "max-h-64" }: Props) {
  const groups = Object.entries(data || {});

  if (groups.length === 0) {
    return <div className="text-sm text-muted-foreground">No permissions</div>;
  }

  return (
    <div className={`pr-2 space-y-3`}>
        <h5 className="text-xs font-semibold uppercase mb-2">{slugCaption}</h5>
        <div className={`${maxH} overflow-y-auto`}>
            {groups.map(([group, perms]) => (
                <div key={group}>
                <div className="text-xs font-semibold uppercase mb-1">
                    {group}
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-0.5">
                    {perms.map((label, idx) => (
                    <li key={idx} className="leading-tight">
                        {label}
                    </li>
                    ))}
                </ul>
                </div>
            ))}

        </div>
    </div>
  );
}
