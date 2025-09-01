# ManadaBook Project

This project is a comprehensive social network for pets, featuring:
- Pet profiles
- Photo and text posts
- Like system
- Follow/unfollow functionality
- Real-time chat
- Group creation
- Moments (stories)
- Short-form videos
- Friends list
- User blocking

## New Feature: Sponsorship System

A new sponsorship system has been integrated for monetization. Sponsors will be displayed in a carousel within the app.

### Setup Instructions for Sponsors

1.  **Firebase Environment Variables:**
    Ensure your `.env.local` file (or equivalent environment configuration) contains the following Firebase credentials:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

2.  **Populate Firestore `sponsors` Collection:**
    You need to manually create a new collection in your Firestore database called `sponsors`. Each document in this collection should represent a sponsor and have the following fields:

    *   `name`: (string) The name of the sponsor.
    *   `logoUrl`: (string) The URL to the sponsor's logo image.
    *   `websiteUrl`: (string) The URL to the sponsor's website.
    *   `description`: (string) A brief description of the sponsor.

    **Example Sponsor Document:**

    ```json
    {
      "name": "PetCo",
      "logoUrl": "https://example.com/petco-logo.png",
      "websiteUrl": "https://www.petco.com",
      "description": "Your one-stop shop for all pet needs."
    }
    ```

### Running the Project

To run the project and see the new sponsorship system in action, follow your usual project startup procedure (e.g., `npm run dev` or `yarn dev`). The sponsors carousel will appear on the homepage (`/`).

---

**Files Modified/Added:**

*   `lib/firebase.ts`: New file for Firebase initialization and sponsor data fetching.
*   `components/SponsorsCarousel.tsx`: New React component to display the sponsors carousel.
*   `app/page.tsx`: Modified to import and render the `SponsorsCarousel` component.
