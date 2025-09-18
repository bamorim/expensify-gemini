'use client';

import { createContext, useContext } from 'react';
import type { RouterOutputs } from '~/trpc/react';

type OrganizationContextType = {
  orgData: RouterOutputs['organization']['get'];
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children, orgData }: {
  children: React.ReactNode;
  orgData: RouterOutputs['organization']['get'];
}) {
  return (
    <OrganizationContext.Provider value={{ orgData }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return {
    organization: context.orgData.organization,
    userRole: context.orgData.role,
  };
}
