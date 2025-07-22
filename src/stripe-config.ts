interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  mode: 'subscription' | 'payment';
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'premium_subscription',
    name: 'Premium',
    description: 'For serious readers and learners',
    price: 999, // $9.99
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_placeholder',
    mode: 'subscription',
    currency: 'usd'
  }
];

export function getProductById(id: string): StripeProduct | undefined {
    return stripeProducts.find(product => product.id === id)
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
    return stripeProducts.find(product => product.priceId === priceId)
}