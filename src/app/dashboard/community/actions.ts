"use server";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

const ChatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

export type FormState = {
  status: "success" | "error" | "idle";
  message: string;
};

export async function sendMessage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ChatFormSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Message cannot be empty.",
    };
  }

  try {
    // In a real app, you'd get the user from the session
    const user = {
      name: "User",
      avatar: "https://github.com/shadcn.png", 
    };

    await addDoc(collection(db, "messages"), {
      text: validatedFields.data.message,
      user: user,
      createdAt: serverTimestamp(),
    });

    return {
      status: "success",
      message: "Message sent!",
    };
  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
