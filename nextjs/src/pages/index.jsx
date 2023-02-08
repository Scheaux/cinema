import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ReactNotifications } from 'react-notifications-component'
import GuestLayout from '@/components/GuestLayout'

export default function Home() {
    return (
        <>
            <Head>
                <title>ИдёмВКино</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ReactNotifications />

            <header className="page-header">
                <h1 className="page-header__title">
                    Идём<span>в</span>кино
                </h1>
            </header>

            <GuestLayout />
        </>
    )
}
