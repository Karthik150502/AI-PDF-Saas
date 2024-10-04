'use client'
import React from 'react'
import { Button } from './ui/button';
import axios from 'axios';
type Props = {
    isPro: Boolean
}

export default function SubscriptionButton(props: Props) {

    const [loading, setLoading] = React.useState(false);

    const handleSubscription = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/stripe')
            window.location.href = response.data.url;
        } catch (error) {
            console.log("Error ", error)
        } finally {
            setLoading(false)
        }
    }





    return (
        <Button disabled={loading} onClick={handleSubscription} className='rounded-none text-sm'>
            {props.isPro ? "Manage Subscriptions" : "Get Pro"}
        </Button>
    )
}
