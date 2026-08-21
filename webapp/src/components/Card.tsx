import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md hover:border-gray-300 transition',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, children, className }: CardHeaderProps) {
  if (children) {
    return <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>{children}</div>
  }

  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200 flex items-center justify-between', className)}>
      <div>
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>
}
