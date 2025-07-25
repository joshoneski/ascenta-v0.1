import { cn } from '@ascenta-plus/web/src/client/lib/utils'
import React, { ReactNode } from 'react'

interface StackProps {
    children?: ReactNode
    gap?: 4
}

export const Stack = (props: StackProps) => {
    const { children, gap = 4 } = props

    const childrenArray = React.Children.toArray(children)

    return (
        <div>
            {childrenArray.map((child, index) => {
                if (!React.isValidElement(child)) {
                    return child
                }

                const props = child.props as { className?: string }
                const className = cn(props.className, {
                    'mt-4': gap === 4 && index > 0,
                })

                return React.cloneElement(child as React.ReactElement<any>, {
                    className,
                })
            })}
        </div>
    )
}
