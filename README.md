# E-commerce web client

This project is a pure React storefront that consumes the live E-comus API.

## Notes on the live API
- The backend exposes products, categories, cart, and orders under the /api prefix.
- The product listing endpoint currently returns an empty catalog on this deployment, so the UI includes deliberate loading, empty, and error states.
- The cart and order endpoints require a valid user identifier. The app uses a demo user id for the interactive flow.
