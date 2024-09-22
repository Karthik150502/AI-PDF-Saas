import Stripe from "stripe"
import 'dotenv/config'


export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: '2024-06-20',
    typescript: true
});


