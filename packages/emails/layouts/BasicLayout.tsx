import { Body, Container, Head, Html } from '@react-email/components'
import { ReactNode } from 'react'
import { Tailwind } from '../components/Tailwind'
import '../styles/fonts.css'

interface BasicLayoutProps {
    children?: ReactNode
}

export const BasicLayout = (props: BasicLayoutProps) => {
    const { children } = props

    return (
        <Tailwind>
            <Html className="bg-gray-100">
                <Head>
                    <meta name="color-scheme" content="light" />
                    <meta name="supported-color-schemes" content="light" />
                </Head>

                <Body className="m-0 bg-gray-100">
                    <Container className="max-w-[632px] px-4 py-8">
                        <div className="rounded-xl bg-white px-4 py-8 shadow-md">
                            {children}
                        </div>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    )
}
