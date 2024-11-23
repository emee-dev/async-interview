"use client";

import { VideoConferenceStyles } from "@/consts";
import { Entity, useSuperVizContext } from "@/context";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import {
  Realtime,
  SuperVizRoomProvider,
  VideoConference,
} from "@superviz/react-sdk";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";

type Participant = {
  activeComponents: any[];
  avatar?: string;
  email?: string;
  id: string;
  name: string;
  slot: {
    color: "";
    colorName: "";
    index: null;
    textColor: "";
    timestamp: number;
  };
};

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const context = useSuperVizContext();

  const onParticipantJoined = (participant: Participant) => {
    console.log("Participant joined", participant);
  };

  return (
    <KindeProvider>
      <QueryClientProvider client={queryClient}>
        <ConvexProvider client={convex}>
          <SuperVizRoomProvider
            debug
            developerKey={process.env.NEXT_PUBLIC_SUPERVIZ_DEVELOPER_TOKEN!}
            group={context.group as Entity}
            participant={context.participant as Entity}
            roomId={context.roomId as string}
            stopAutoStart={true}
            // @ts-ignore
            onParticipantJoined={onParticipantJoined}
          >
            {children}
            <Realtime />

            {/* Manually enable the video chat */}
            {context.isVideoEnabled && (
              <VideoConference
                // devices={{ videoInput: false, audioInput: false, audioOutput: false }}
                participantType="host"
                offset={{
                  top: -15,
                  right: -8,
                  bottom: 0,
                  left: 0,
                }}
                enableRecording={true}
                styles={VideoConferenceStyles}
                onConnectionStatusChange={(status) =>
                  context.setConnectionStatus(status)
                }
              />
            )}
          </SuperVizRoomProvider>
        </ConvexProvider>
      </QueryClientProvider>
    </KindeProvider>
  );
};

export default Provider;
