// import { fetchMutation } from "convex/nextjs";
import { inngest } from "@/inngest/client";

export const dynamic = "force-dynamic";

type User = {
  email: string | null;
  family_name: string | null;
  given_name: string | null;
  id: string;
  picture: string | null;
};

export const POST = async (req: Request) => {
  try {
    const params = (await req.json()) as User;

    await inngest.send({
      name: "interview/user.create",
      data: {} as User,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error.", data: null });
  }
};
