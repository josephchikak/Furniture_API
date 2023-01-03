
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import * as dotenv from 'dotenv' 


dotenv.config()

const app = express();

app.use(express.json())
app.use(cors({
    origin: '*',
}))


const stripe = new Stripe (process.env.STRIPE_PRIVATE_KEY);


app.post('/create-checkout-session', async (req,res) => {
    try{
       const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode: 'payment',
        line_items: req.body.items.map(item =>{
        
            return {
                price_data: {
                    currency:'usd',
                    product_data: {
                        name: item.name,
                        images: [item.image]
                    },
                    unit_amount: item.price.raw * 100,
                },
                quantity: item.quantity, 
            }
        }),
        success_url: 'http://localhost:3001'
        })
        res.json({url: session.url})
       
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

const PORT = process.env.PORT
app.listen(process.env.PORT || 3000, console.log(`it is working on ${PORT}`))
