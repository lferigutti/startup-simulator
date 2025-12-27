// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Send, Loader2 } from "lucide-react";
// import type { Role, Message } from "@/models";
// import { rolePrompts } from "@/data";

// export default function ReflectionChat({
//   role,
//   onRestart,
// }: {
//   role: Role;
//   sessionId: string;
//   onRestart: () => void;
// }) {
//   const roleNames = {
//     engineer: "Engineer",
//     "product_manager": "Product Manager",
//     founder: "Founder",
//   };

//   const [messages, setMessages] = useState<Message[]>(() => [
//     {
//       role: "assistant",
//       content: `Thank you for completing the ${roleNames[role]} scenarios. I'm here to help you reflect on your decision-making patterns. Let's explore what drives your choices and how you think through complex situations.`,
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [turnCount, setTurnCount] = useState(0);
//   const [isComplete, setIsComplete] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const maxTurns = 6;

//   useEffect(() => {
//     // Ask first reflection question after a brief delay
//     const timer = setTimeout(() => {
//       const firstQuestion: Message = {
//         role: "assistant",
//         content: rolePrompts[role][0],
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, firstQuestion]);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, [role]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim() || isTyping || isComplete) return;

//     const userMessage: Message = {
//       role: "user",
//       content: input,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setTurnCount((prev) => prev + 1);

//     // Simulate AI response
//     setTimeout(() => {
//       const responses = generateReflectionResponse(role, turnCount + 1);
//       const assistantMessage: Message = {
//         role: "assistant",
//         content: responses,
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, assistantMessage]);
//       setIsTyping(false);

//       if (turnCount + 1 >= maxTurns) {
//         setTimeout(() => {
//           const closingMessage: Message = {
//             role: "assistant",
//             content:
//               "Thank you for this thoughtful reflection. Understanding your decision-making patterns is the first step toward growing as a leader. Feel free to explore other roles or start a new session anytime.",
//             timestamp: new Date(),
//           };
//           setMessages((prev) => [...prev, closingMessage]);
//           setIsComplete(true);
//         }, 1000);
//       }
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-semibold mb-1">
//                 Reflection with {roleNames[role]} Voice
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 A conversation to explore your decision-making patterns
//               </p>
//             </div>
//             <Badge variant="secondary">
//               Turn {Math.min(turnCount, maxTurns)} of {maxTurns}
//             </Badge>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 message.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <Card
//                 className={`max-w-[80%] p-4 ${
//                   message.role === "user"
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted"
//                 }`}
//               >
//                 <p className="leading-relaxed whitespace-pre-wrap">
//                   {message.content}
//                 </p>
//                 <span className="text-xs opacity-60 mt-2 block">
//                   {message.timestamp.toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//               </Card>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <Card className="bg-muted p-4">
//                 <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
//               </Card>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input */}
//       <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky bottom-0">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           {isComplete ? (
//             <div className="flex gap-4">
//               <Button onClick={onRestart} className="flex-1" size="lg">
//                 Start New Session
//               </Button>
//             </div>
//           ) : (
//             <div className="flex gap-2">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSend();
//                   }
//                 }}
//                 placeholder="Share your thoughts..."
//                 disabled={isTyping || isComplete}
//                 className="flex-1 min-h-15 max-h-50 px-4 py-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
//                 rows={2}
//               />
//               <Button
//                 onClick={handleSend}
//                 disabled={!input.trim() || isTyping || isComplete}
//                 size="lg"
//                 className="self-end"
//               >
//                 <Send className="w-5 h-5" />
//               </Button>
//             </div>
//           )}
//           {!isComplete && (
//             <p className="text-xs text-muted-foreground mt-2">
//               Press Enter to send, Shift+Enter for new line
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function generateReflectionResponse(role: Role, turn: number): string {
//   const responses = {
//     engineer: [
//       "That's an interesting perspective. It sounds like you value finding pragmatic solutions. How do you typically decide when to push for the ideal technical solution versus accepting a compromise?",
//       "I hear you balancing multiple concerns. Many engineers struggle with this tension. What signals do you look for that tell you it's time to prioritize differently?",
//       "Your approach shows thoughtful consideration. How has your comfort with these trade-offs evolved over time?",
//       "That experience resonates. When you're facing a decision with incomplete information, what framework do you use to move forward?",
//       "It's clear you've reflected deeply on this. How do you help others on your team develop similar decision-making skills?",
//     ],
//     "product_manager": [
//       "That's a thoughtful approach to balancing inputs. How do you handle situations where your intuition conflicts with what the data suggests?",
//       "I appreciate your focus on outcomes. When you're dealing with stakeholders who have different definitions of success, how do you create alignment?",
//       "Your process sounds well-considered. Can you think of a time when you had to make a decision faster than you would have liked? How did that feel?",
//       "That's interesting. How do you maintain conviction in a decision when there's uncertainty or pushback?",
//       "Your self-awareness is valuable. What aspects of product decision-making do you find most energizing versus most draining?",
//     ],
//     founder: [
//       "That balance between vision and pragmatism is crucial. How do you know when to hold firm on your vision versus when to adapt?",
//       "Leading a startup requires constant prioritization. What helps you stay focused on what truly matters versus urgent but less important demands?",
//       "Your experience highlights the complexity of founder decisions. How do you take care of your own decision-making capacity and avoid fatigue?",
//       "That's a valuable insight. As your company grows, how are you thinking about which decisions you need to own versus delegate?",
//       "Your journey shows meaningful growth. What advice would you give to yourself at the beginning of this startup journey?",
//     ],
//   };

//   return (
//     responses[role][turn - 1] ||
//     "Thank you for sharing. That's helpful to understand."
//   );
// }
