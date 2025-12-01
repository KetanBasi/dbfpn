"use client"

import * as React from "react"
import { useState } from "react"

interface TooltipProps {
    children: React.ReactNode
}

export const TooltipProvider = ({ children }: TooltipProps) => {
    return <>{children}</>
}

export const Tooltip = ({ children }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false)

    // Clone children to inject props
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            if (child.type === TooltipTrigger) {
                return React.cloneElement(child, {
                    // @ts-ignore
                    onMouseEnter: () => setIsVisible(true),
                    // @ts-ignore
                    onMouseLeave: () => setIsVisible(false)
                })
            }
            // @ts-ignore
            if (child.type === TooltipContent) {
                return isVisible ? child : null
            }
        }
        return child
    })

    return <div className="relative inline-block">{childrenWithProps}</div>
}

export const TooltipTrigger = ({ children, ...props }: any) => {
    return (
        <div {...props} className="inline-block cursor-help">
            {children}
        </div>
    )
}

export const TooltipContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="absolute z-50 w-64 p-2 text-sm text-white bg-black border border-gray-800 rounded-md shadow-lg -top-2 left-full ml-2 transform -translate-y-1/2">
            {children}
        </div>
    )
}
