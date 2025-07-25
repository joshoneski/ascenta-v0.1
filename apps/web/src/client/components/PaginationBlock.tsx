'use client'

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/client/components/ui/pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

export const PaginationBlock = (props: {
    className?: string
    page: number
    pageCount: number
    queryParam?: string
}) => {
    const { className, page, pageCount, queryParam = 'page' } = props

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const hasPrevious = page > 1
    const hasNext = page < pageCount

    const pageButtons: ReactNode[] = []

    function getPagePathname(page: number) {
        const query = new URLSearchParams(searchParams)
        query.set(queryParam, page.toString())
        return `${pathname}?${query}`
    }

    const { start, end } = getPageRange(page, pageCount)
    for (let i = start; i <= end; i++) {
        const query = new URLSearchParams(searchParams)
        query.set(queryParam, i.toString())

        pageButtons.push(
            <PaginationItem key={`page-${i}`}>
                <PaginationLink href={getPagePathname(i)} isActive={page === i}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        )
    }

    if (pageCount <= 1) {
        return null
    }

    return (
        <Pagination className={className}>
            <PaginationContent>
                {hasPrevious ? (
                    <PaginationItem>
                        <PaginationPrevious href={getPagePathname(page - 1)} />
                    </PaginationItem>
                ) : null}
                {pageButtons}
                {hasNext ? (
                    <PaginationItem>
                        <PaginationNext href={getPagePathname(page + 1)} />
                    </PaginationItem>
                ) : null}
            </PaginationContent>
        </Pagination>
    )
}

/**
 * Taken from https://stackoverflow.com/a/31239603
 * @param page
 * @param pageCount
 * @param padding
 */
const getPageRange = (page: number, pageCount: number, padding = 2) => {
    let start = page - padding
    let end = page + padding

    if (end > pageCount) {
        start -= end - pageCount
        end = pageCount
    }
    if (start <= 0) {
        end += (start - 1) * -1
        start = 1
    }

    end = end > pageCount ? pageCount : end

    return {
        start: start,
        end: end,
    }
}
