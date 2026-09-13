"use client";

import { useEffect, useState } from "react";

import { USER_EMAIL_KEY } from "@/lib/auth/tokens";

export function useDashboardUserDisplay() {
  const [user, setUser] = useState({ label: "User", initials: "U" });

  useEffect(() => {
    const label = (localStorage.getItem(USER_EMAIL_KEY) ?? "").split("@")[0] || "User";
    const initials =
      label
        .split(/[.\s_-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "U";
    setUser({ label, initials });
  }, []);

  return user;
}
