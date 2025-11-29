"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function StripeGuide() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Stripe Webhooks</h1>

            <p>This guide shows how to handle Stripe webhooks with HeliumTS.</p>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Setup</h2>
                <p>First, install the Stripe SDK:</p>
                <CodeBlock code={`npm install stripe`} language="bash" />
                <p>Add your Stripe keys to your environment variables:</p>
                <CodeBlock
                    code={`STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...`}
                    language="bash"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Webhook Handler</h2>
                <p>Handle Stripe webhooks to process events like successful payments:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
});

export const stripeWebhook = defineHTTPRequest("POST", "/webhooks/stripe", async (req, ctx) => {
    const body = await req.text();
    const signature = req.headers["stripe-signature"] as string;
    
    if (!signature) {
        return new Response(JSON.stringify({ error: "No signature" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        
        // Handle different event types
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log("Payment succeeded:", paymentIntent.id);
                // Update your database, send confirmation email, etc.
                break;
            }
            
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("Checkout completed:", session.id);
                // Fulfill the order
                break;
            }
            
            case "customer.subscription.created": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log("Subscription created:", subscription.id);
                // Update user's subscription status
                break;
            }
            
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log("Subscription cancelled:", subscription.id);
                // Revoke access
                break;
            }
            
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                console.log("Payment failed:", invoice.id);
                // Notify customer
                break;
            }
            
            default:
                console.log(\`Unhandled event type: \${event.type}\`);
        }
        
        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Webhook error:", error);
        
        return new Response(
            JSON.stringify({ error: "Webhook signature verification failed" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
});`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Testing Webhooks Locally</h2>
                <p>Use Stripe CLI to forward webhooks to your local server:</p>
                <CodeBlock
                    code={`# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/webhooks/stripe`}
                    language="bash"
                />
                <p>
                    The CLI will output your webhook signing secret. Add it to your <code>.env</code> file.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Best Practices</h2>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Always verify webhook signatures to prevent fraud</li>
                    <li>Use environment variables for API keys and secrets</li>
                    <li>Handle webhook events idempotently (same event may be sent multiple times)</li>
                    <li>Return a 200 response quickly to acknowledge receipt</li>
                    <li>Process webhook events asynchronously if they take time</li>
                    <li>Log all webhook events for debugging</li>
                    <li>Test with Stripe test mode before going live</li>
                    <li>Implement proper error handling and monitoring</li>
                </ul>
            </div>
        </div>
    );
}
