import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuSelectedType {
  pageIndex: number;
  setPageIndex: (value: number) => void;
}

export const useMenuSelectedStore = create(
  persist<MenuSelectedType>(
    (set) => ({
      pageIndex: -1,
      setPageIndex: (value) => {
        set({ pageIndex: value });
      },
    }),
    { name: 'menuStore' },
  ),
);

interface ApiActionType {
  apiCallComplete: boolean;
  setApiCallComplete: (value: boolean) => void;
  apiActionPage: number;
  setApiActionPage: (value: number) => void;
}

export const useApiActionStore = create<ApiActionType>((set) => ({
  apiActionPage: -1,
  setApiActionPage: (value) => set({ apiActionPage: value }),
  apiCallComplete: false,
  setApiCallComplete: (value) => set({ apiCallComplete: value }),
}));

interface ModifyType {
  isItemModify: boolean;
  setItemModify: (value: boolean) => void;
  isEdidMode: boolean;
  setEditMode: (value: boolean) => void;
}

export const useModifyPageStore = create<ModifyType>((set) => ({
  isItemModify: false,
  setItemModify: (value) => set({ isItemModify: value }),
  isEdidMode: false,
  setEditMode: (value) => set({ isEdidMode: value }),
}));

interface DepthBackType {
  depthBack: boolean;
  setDepthBack: (value: boolean) => void;
}

export const useDepthBackStore = create<DepthBackType>((set) => ({
  depthBack: false,
  setDepthBack: (value) => set({ depthBack: value }),
}));
