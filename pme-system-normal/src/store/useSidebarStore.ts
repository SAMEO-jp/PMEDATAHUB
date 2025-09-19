import { create } from 'zustand';

type SidebarState = {
  menuType: 'project' | 'global';
  toggleMenuType: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  menuType: 'global', // 初期値: 全体メニュー
  toggleMenuType: () => set((state) => ({
    menuType: state.menuType === 'project' ? 'global' : 'project',
  })),
}));