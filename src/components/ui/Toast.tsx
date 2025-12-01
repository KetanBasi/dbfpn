"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 3000)
    }, [])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] animate-in slide-in-from-right-full fade-in duration-300 ${toast.type === "success"
                                ? "bg-green-900/90 border-green-700 text-white"
                                : toast.type === "error"
                                    ? "bg-red-900/90 border-red-700 text-white"
                                    : "bg-blue-900/90 border-blue-700 text-white"
                            }`}
                    >
                        {toast.type === "success" && <CheckCircle size={20} className="text-green-400" />}
                        {toast.type === "error" && <AlertCircle size={20} className="text-red-400" />}
                        {toast.type === "info" && <Info size={20} className="text-blue-400" />}

                        <p className="flex-1 text-sm font-medium">{toast.message}</p>

                        <button onClick={() => removeToast(toast.id)} className="text-white/70 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
