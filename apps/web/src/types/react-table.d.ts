import '@tanstack/react-table'
import { RowData } from '@tanstack/react-table'

declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        minSizePixel?: number
        sizePercentage?: number
        style?: {
            className?: string
            textAlign?: 'left' | 'center' | 'right'
        }
    }
}
