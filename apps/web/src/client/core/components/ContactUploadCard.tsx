'use client'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent } from '@/client/components/ui/card'
import { api } from '@/client/lib/api'
import { useMutation } from '@tanstack/react-query'
import {
    CheckCircleIcon,
    FileTextIcon,
    LoaderCircleIcon,
    UploadIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

export const ContactUploadCard = (props: {
    title: string | null
    organisationId: string
}) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const importContacts = useMutation({
        mutationFn: api.contacts.createMany,
    })

    const router = useRouter()

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const [file] = Array.from(e.dataTransfer.files).filter(
            (file) =>
                file.type === 'text/csv' ||
                file.name.endsWith('.csv') ||
                file.name.endsWith('.xlsx')
        )

        if (file) {
            setFile(file)
        }
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [file] = Array.from(e.target.files || [])
        if (file) {
            setFile(file)
        }
    }

    const handleUpload = async () => {
        if (importContacts.isPending) {
            return
        }

        if (!file) {
            toast.error('No file provided.')
            return
        }

        const response = await importContacts.mutateAsync({
            file,
            organisation: props.organisationId,
        })

        if (!response.success) {
            toast.error(response.error.message)
            throw response.error
        }

        toast.success(
            `Contacts successfully imported. ${response.data.created} created and ${response.data.updated} updated.`
        )
        router.refresh()
    }

    const handleButtonClick = () => {
        const fileInput = document.getElementById(
            'file-upload'
        ) as HTMLInputElement
        fileInput?.click()
    }

    return (
        <Card className="overflow-hidden border-2 border-dashed border-gray-200">
            <CardContent className="p-0">
                {!file ? (
                    <div
                        className={`p-12 text-center transition-all duration-200 ${
                            isDragOver ? 'border-purple-300 bg-purple-50' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="bg-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                            <UploadIcon className="text-muted-foreground h-8 w-8" />
                        </div>

                        {props.title ? (
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                {props.title}
                            </h3>
                        ) : null}

                        <p className="mx-auto mb-6 max-w-md text-gray-600">
                            Upload a CSV of contacts you would like to add. File
                            can include: email, first name, last name.
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer"
                                >
                                    <Button
                                        variant="accent"
                                        onClick={handleButtonClick}
                                    >
                                        <UploadIcon className="size-4" />
                                        <span>Choose file</span>
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".csv"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>

                            <p className="text-sm text-gray-500">
                                Supported formats: CSV
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                            File selected!
                        </h3>
                        <div className="mb-6 space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <FileTextIcon className="h-4 w-4" />
                                <span>{file.name}</span>
                                <span className="text-gray-400">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                        </div>
                        <Button onClick={handleUpload}>
                            {importContacts.isPending ? (
                                <LoaderCircleIcon className="size-4 animate-spin" />
                            ) : (
                                <UploadIcon className="size-4" />
                            )}
                            <span>Import contacts</span>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
