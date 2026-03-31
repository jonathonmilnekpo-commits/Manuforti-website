// Manu Forti Website Configuration
// Update these values after deploying the backend

const CONFIG = {
    // API Base URL - Change this after deploying backend
    // Local development: 'http://localhost:3000/api'
    // Production: 'https://your-railway-app.railway.app/api'
    API_BASE_URL: 'https://manuforti-api.railway.app/api',
    
    // Stripe Publishable Key (test mode for development)
    // Get from: https://dashboard.stripe.com/apikeys
    STRIPE_PUBLISHABLE_KEY: 'pk_test_your_key_here',
    
    // Website settings
    SITE_NAME: 'Manu Forti Intelligence',
    SUPPORT_EMAIL: 'support@manuforti.com',
    
    // Product 1: Supplier Analysis Reports
    REPORTS: {
        Standard: {
            price: 249,
            sla: 24,
            currency: 'EUR'
        },
        Premium: {
            price: 349,
            sla: 12,
            currency: 'EUR'
        }
    },
    
    // Product 2: Media Monitoring
    MONITORING: {
        Monitor: {
            price: 35,
            billing: 'monthly',
            suppliers: 10,
            frequency: 'weekly',
            currency: 'EUR'
        },
        Alert: {
            price: 105,
            billing: 'monthly',
            suppliers: 25,
            frequency: 'real-time',
            currency: 'EUR'
        }
    },
    
    // Bundle discount
    BUNDLE_DISCOUNT: 0.20, // 20% off
    
    // Legacy pricing (for reference)
    SLA: {
        Standard: 24,
        Premium: 12
    },
    
    PRICING: {
        Standard: 249,
        Premium: 349,
        Monitor: 35,
        Alert: 105
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}