
"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar: string;
  };
  createdAt: Timestamp | null;
};

const initialState: FormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} className="shrink-0">
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5"/>}
      <span className="sr-only">Send Message</span>
    </Button>
  );
}

export function Chat() {
  const [state, formAction] = useActionState(sendMessage, initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 100)
    }
  }, [messages]);
  
  useEffect(() => {
    if (state.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state, toast]);


  return (
    <Card className="h-[75vh] flex flex-col">
      <CardHeader>
        <CardTitle>Live Community Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 p-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={msg.user.avatar} />
                  <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-base">{msg.user.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {isClient && msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mt-1 bg-secondary p-3 rounded-lg rounded-tl-none">
                    <p className="text-muted-foreground leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-background">
        <form ref={formRef} action={formAction} className="flex w-full items-center gap-4">
          <Input name="message" placeholder="Type your message..." autoComplete="off" className="h-12 text-base"/>
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
