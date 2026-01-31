'use client'

import React from "react"

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, User, Bot, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatProps {
  agentType: 'task_coordinator' | 'resource_optimizer' | 'inventory_monitor' | 'general'
  title: string
  placeholder?: string
}

const agentConfig = {
  task_coordinator: {
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'Helps assign tasks to staff members',
  },
  resource_optimizer: {
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    description: 'Suggests resource optimizations',
  },
  inventory_monitor: {
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    description: 'Monitors stock levels',
  },
  general: {
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'General operations assistant',
  },
}

export function AIChat({ agentType, title, placeholder }: AIChatProps) {
  const config = agentConfig[agentType]

  const { messages, sendMessage, status, input, setInput } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai-agent',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          message: messages[messages.length - 1],
          id,
          messages,
          agentType,
        },
      }),
    }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === 'streaming') return
    sendMessage({ text: input })
    setInput('')
  }

  const getMessageText = (msg: typeof messages[0]) => {
    if (!msg.parts || !Array.isArray(msg.parts)) return ''
    return msg.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text)
      .join('')
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bgColor)}>
            <Brain className={cn("h-5 w-5", config.color)} />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Ask me anything about your operations
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {agentType === 'task_coordinator' && (
                  <>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setInput('Which tasks should be assigned first?')}
                    >
                      Task priorities
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setInput('Assign pending tasks to available staff')}
                    >
                      Auto-assign tasks
                    </Badge>
                  </>
                )}
                {agentType === 'inventory_monitor' && (
                  <>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setInput('Check for low stock items')}
                    >
                      Stock check
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setInput('Create restock alerts for critical items')}
                    >
                      Restock alerts
                    </Badge>
                  </>
                )}
                {agentType === 'resource_optimizer' && (
                  <>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setInput('Analyze current resource usage')}
                    >
                      Usage analysis
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setInput('Suggest cost optimizations')}
                    >
                      Cost savings
                    </Badge>
                  </>
                )}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message)
            const isUser = message.role === 'user'

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  isUser && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isUser ? "bg-primary" : config.bgColor
                )}>
                  {isUser ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className={cn("h-4 w-4", config.color)} />
                  )}
                </div>
                <div className={cn(
                  "rounded-lg px-3 py-2 max-w-[80%]",
                  isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            )
          })}

          {status === 'streaming' && (
            <div className="flex gap-3">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bgColor)}>
                <Loader2 className={cn("h-4 w-4 animate-spin", config.color)} />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder || "Ask the AI agent..."}
            disabled={status === 'streaming'}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || status === 'streaming'}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
