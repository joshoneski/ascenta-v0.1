'use client'

import { cn } from '@/client/lib/utils'
import { IframeHTMLAttributes, SyntheticEvent } from 'react'

export const AutosizeIframe = ({
    className,
    onLoad,
    ...props
}: IframeHTMLAttributes<HTMLIFrameElement>) => {
    function handleOnLoad(e: SyntheticEvent<HTMLIFrameElement, Event>) {
        const contentWindow = e.currentTarget.contentWindow
        const iframe = e.currentTarget
        if (contentWindow) {
            const height = contentWindow.document.body.scrollHeight
            iframe.style.height = height + 'px'
        }

        if (onLoad) {
            onLoad(e)
        }
    }

    return (
        <iframe
            className={cn('b-0 w-full', className)}
            onLoad={handleOnLoad}
            {...props}
        />
    )
}
