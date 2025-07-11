'use client'

import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  title?: string
  description: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto-dismiss after duration (default 5000ms)
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]
  removeToast: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ 
  toast, 
  removeToast 
}: { 
  toast: Toast
  removeToast: (id: string) => void 
}) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => removeToast(toast.id), 150)
  }

  return (
    <div
      className={cn(
        "transform transition-all duration-200 ease-in-out pointer-events-auto",
        isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0"
      )}
    >
      <Alert variant={toast.variant} className="relative shadow-lg border-0 bg-background/95 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-background/50"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
        </Button>
        
        {toast.title && (
          <AlertTitle>{toast.title}</AlertTitle>
        )}
        <AlertDescription>{toast.description}</AlertDescription>
      </Alert>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Convenience functions for common toast types
export const toast = {
  success: (description: string, title?: string) => {
    // This will be used with the hook
    return { description, title, variant: "default" as const }
  },
  error: (description: string, title?: string) => {
    return { description, title, variant: "destructive" as const }
  },
  info: (description: string, title?: string) => {
    return { description, title, variant: "default" as const }
  }
} 