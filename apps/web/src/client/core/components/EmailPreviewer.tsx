'use client'

import { Text } from '@/client/components/Text'
import { render } from '@react-email/render'
import { LoaderCircleIcon } from 'lucide-react'
import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'

export const EmailPreviewer = (props: { children: ReactElement }) => {
    const [error, setError] = useState<string | undefined>()
    const [mode, setMode] = useState<'error' | 'loading' | 'preview' | 'plain'>(
        'loading'
    )
    const [plainText, setPlainText] = useState<string | undefined>()
    const [srcDoc, setSrcDoc] = useState<string | undefined>()

    useEffect(() => {
        const supportsReadableByteStreamController =
            'ReadableByteStreamController' in window

        if (supportsReadableByteStreamController) {
            render(props.children).then(setSrcDoc)
            setMode('preview')
        } else {
            setError('Your browser or device does not support email previews.')
            setMode('error')
        }
    }, [props.children])

    function onLoad(e: SyntheticEvent<HTMLIFrameElement, Event>) {
        const contentWindow = e.currentTarget.contentWindow
        const iframe = e.currentTarget
        if (contentWindow) {
            const height = contentWindow.document.body.scrollHeight
            iframe.style.height = height + 'px'
        }
    }

    if (mode === 'error') {
        return (
            <div className="flex h-[200px] items-center justify-center bg-red-100 p-8">
                <Text className="text-center text-red-600">{error}</Text>
            </div>
        )
    }

    if (mode === 'loading') {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <LoaderCircleIcon className="size-8 animate-spin" />
            </div>
        )
    }

    if (mode === 'plain') {
        return <>{props.children}</>
    }

    return <iframe className="b-0 w-full" srcDoc={srcDoc} onLoad={onLoad} />
}
