import React, { createContext, useContext, ReactNode } from 'react';

// Mock EventContext for Storybook
interface MockEventContextType {
  // Tab management
  getActiveTab: () => string;
  setActiveTab: (tab: 'project' | 'indirect') => void;
  updateActivityCodePrefix: (tab: 'project' | 'indirect', subTab?: string) => void;
  
  // Tab details
  getTabDetails: () => {
    planning: {
      planningSubType: string;
      estimateSubType: string;
    };
  };
  setTabDetail: (tab: string, field: string, value: string) => void;
  
  // Event management
  handleUpdateEvent: (event: any) => void;
  
  // Project management (for ProjectSelect)
  selectedEvent: any;
  selectedProjectCode: string;
  purposeProjectCode: string;
  setSelectedProjectCode: (code: string) => void;
  setPurposeProjectCode: (code: string) => void;
  updateEvent: (id: string, updates: any) => void;
}

const MockEventContext = createContext<MockEventContextType | null>(null);

interface MockEventProviderProps {
  children: ReactNode;
  mockState?: {
    activeTab?: string;
    planningSubType?: string;
    estimateSubType?: string;
    selectedProjectCode?: string;
    purposeProjectCode?: string;
    selectedEvent?: any;
  };
}

export const MockEventProvider = ({ children, mockState = {} }: MockEventProviderProps) => {
  const mockContextValue: MockEventContextType = {
    getActiveTab: () => mockState.activeTab || 'project',
    setActiveTab: (tab: 'project' | 'indirect') => {
      // Mock implementation
    },
    updateActivityCodePrefix: (tab: 'project' | 'indirect', subTab?: string) => {
      // Mock implementation
    },
    
    // Tab details
    getTabDetails: () => ({
      planning: {
        planningSubType: mockState.planningSubType || '',
        estimateSubType: mockState.estimateSubType || '',
      },
    }),
    setTabDetail: (tab: string, field: string, value: string) => {
      // Mock implementation
    },
    
    // Event management
    handleUpdateEvent: (event: any) => {
      // Mock implementation
    },
    
    // Project management (for ProjectSelect)
    selectedEvent: mockState.selectedEvent || null,
    selectedProjectCode: mockState.selectedProjectCode || '',
    purposeProjectCode: mockState.purposeProjectCode || '',
    setSelectedProjectCode: (code: string) => {
      // Mock implementation
    },
    setPurposeProjectCode: (code: string) => {
      // Mock implementation
    },
    updateEvent: (id: string, updates: any) => {
      // Mock implementation
    },
  };

  return (
    <MockEventContext.Provider value={mockContextValue}>
      {children}
    </MockEventContext.Provider>
  );
};

export const useMockEventContext = () => {
  const context = useContext(MockEventContext);
  if (!context) {
    throw new Error('useMockEventContext must be used within a MockEventProvider');
  }
  return context;
};

// Override the useEventContext hook for Storybook
export const useEventContext = useMockEventContext;