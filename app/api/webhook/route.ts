import { inngest } from "@/inngest/client";

export const dynamic = "force-dynamic";

export type User = {
  email: string;
  kindeId: string;
  first_name: string;
  last_name: string;
};

type KindeCreateUserEvent = JwtPayload & {
  data: {
    user: {
      email: string;
      first_name: string;
      id: string;
      is_password_reset_requested: boolean;
      is_suspended: boolean;
      last_name: string;
      organizations: [
        {
          code: string;
          permissions: null;
          roles: null;
        },
      ];
      phone: null;
      username: null;
    };
  };
  event_id: string;
  event_timestamp: string;
  source: string;
  timestamp: string;
  type: "user.created";
};

import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { env } from "@/lib/env";

const client = jwksClient({
  jwksUri: `${env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export const POST = async (req: Request) => {
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const jwtDecoded = jwt.decode(token, { complete: true });

    if (!jwtDecoded) {
      console.error("Error decoding jwt");
      return Response.json(
        { message: "Error decoding jwt", data: null },
        { status: 500 }
      );
    }

    const header = jwtDecoded.header;
    const kid = header.kid;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey) as KindeCreateUserEvent;

    // Handle various events
    switch (event.type) {
      case "user.created":
        const user = event.data.user;

        const kindeId = user.id;
        const email = user.email;
        const first_name = user.first_name ?? null;
        const last_name = user.last_name ?? null;

        // store user data
        await inngest.send({
          name: "webhook/user.create",
          data: {
            email,
            kindeId,
            last_name,
            first_name,
          } as User,
        });

        break;
      default:
        console.log("event not handled", event.type);
        break;
    }

    return Response.json({ message: "Event recieved" });
  } catch (err: any) {
    console.error(err);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};
