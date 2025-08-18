import React, { createContext, useContext, ReactNode } from 'react';

// Mock EventContext for Storybook
interface MockEventContextType {
  // Tab management
  getActiveTab: () => string;
  setActiveTab: (tab: string) => void;
  updateActivityCodePrefix: (tab: string) => void;
  
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
    setActiveTab: (tab: string) => {
      console.log('Mock setActiveTab called:', tab);
    },
    updateActivityCodePrefix: (tab: string) => {
      console.log('Mock updateActivityCodePrefix called:', tab);
    },
    
    getTabDetails: () => ({
      planning: {
        planningSubType: mockState.planningSubType || '',
        estimateSubType: mockState.estimateSubType || '',
      }
    }),
    setTabDetail: (tab: string, field: string, value: string) => {
      console.log('Mock setTabDetail called:', tab, field, value);
    },
    
    handleUpdateEvent: (event: any) => {
      console.log('Mock handleUpdateEvent called:', event);
    },
    
    // Project management (for ProjectSelect)
    selectedEvent: mockState.selectedEvent || null,
    selectedProjectCode: mockState.selectedProjectCode || '',
    purposeProjectCode: mockState.purposeProjectCode || '',
    setSelectedProjectCode: (code: string) => {
      console.log('Mock setSelectedProjectCode called:', code);
    },
    setPurposeProjectCode: (code: string) => {
      console.log('Mock setPurposeProjectCode called:', code);
    },
    updateEvent: (id: string, updates: any) => {
      console.log('Mock updateEvent called:', id, updates);
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