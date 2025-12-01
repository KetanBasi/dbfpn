interface SectionProps {
    title: string
    children: React.ReactNode
    className?: string
    action?: React.ReactNode
}

export default function Section({ title, children, className = "", action }: SectionProps) {
    return (
        <section className={`py-8 px-4 md:px-8 max-w-7xl mx-auto ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-primary pl-3">
                    {title}
                </h2>
                {action && <div>{action}</div>}
            </div>
            {children}
        </section>
    )
}
