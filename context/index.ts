import { create } from "zustand";

export type Entity = {
  id: string;
  name: string;
};

type SuperViz = {
  group: Entity | null;
  participant: Entity | null;
  roomId: string | undefined;
  visitorId: number | undefined;
  connectionStatus: number;
  isVideoEnabled: boolean;

  setGroup: (group: SuperViz["group"]) => void;
  setParticipant: (participant: SuperViz["participant"]) => void;
  setRoomId: (roomId: string) => void;
  setVisitorId: (roomId: number) => void;
  setConnectionStatus: (status: number) => void;
  setIsVideoEnabled: (status: boolean) => void;
};

type AppContext = {
  superviz: SuperViz;
  application: SuperViz;
};

export const useSuperVizContext = create<SuperViz>((set) => ({
  group: null,
  participant: null,
  roomId: undefined,
  connectionStatus: 0,
  visitorId: undefined,
  isVideoEnabled: false,

  setGroup: (group) => set({ group }),
  setParticipant: (participant) => set({ participant }),
  setRoomId: (roomId) => set({ roomId }),
  setVisitorId: (visitorId) => set({ visitorId }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsVideoEnabled: (status) => set({ isVideoEnabled: status }),
}));
