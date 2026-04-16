"use client";

import { createContext, useContext, useEffect } from "react";
import { useCockpitStore } from "@/store/use-cockpit";
import type { DomainKey } from "@/types";

const DomainThemeContext = createContext<{
  domain: DomainKey;
  setDomain: (d: DomainKey) => void;
}>({
  domain: "ops",
  setDomain: () => {},
});

export function DomainThemeProvider({ children }: { children: React.ReactNode }) {
  const domain = useCockpitStore((s) => s.domain);
  const setDomain = useCockpitStore((s) => s.setDomain);

  useEffect(() => {
    document.body.setAttribute("data-domain", domain);
  }, [domain]);

  return (
    <DomainThemeContext.Provider value={{ domain, setDomain }}>
      {children}
    </DomainThemeContext.Provider>
  );
}

export function useDomainTheme() {
  return useContext(DomainThemeContext);
}
