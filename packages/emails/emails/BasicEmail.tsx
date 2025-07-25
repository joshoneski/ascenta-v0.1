import { ReactNode } from 'react'
import { BasicLayout } from '../layouts/BasicLayout'

export const BasicEmail = (props: { children?: ReactNode }) => {
    return <BasicLayout>{props.children}</BasicLayout>
}

export default BasicEmail
