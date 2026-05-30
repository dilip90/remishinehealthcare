# Remishine Healthcare Website

Corporate website and product catalogue for Remishine Healthcare, built with Next.js, Tailwind CSS, and Firebase.

## Stack

- Next.js App Router
- Tailwind CSS
- Firebase Hosting
- Firebase Auth, Firestore, and Storage for the CMS phase

## Firebase Setup

1. Create a Firebase project.
2. Add a Web App in Firebase Console.
3. Copy `.env.local.example` to `.env.local`.
4. Add the Firebase Web App config values in `.env.local`.
5. Copy `.firebaserc.example` to `.firebaserc` and replace `your-firebase-project-id`.
6. Enable these Firebase products:
   - Hosting
   - Firestore Database
   - Storage
   - Authentication with Email/Password

## Firebase Hosting

This project is configured for Firebase Hosting static export:

- `next.config.js` uses `output: 'export'`.
- Firebase Hosting serves the generated `out` folder.
- `firebase.json` includes hosting headers, Firestore rules, Firestore indexes, and Storage rules.

Build and deploy commands should be run only after the Firebase project ID and environment values are ready.

## Firestore Collections

- `products`: Product catalogue records
- `categories`: Therapeutic focus/category records
- `heroBanners`: Homepage slider images and ordering
- `enquiries`: Contact/product enquiry submissions
- `users`: Admin users and roles
- `siteSettings`: Company contact, GSTIN, address, and global settings

Typed collection helpers are available in `lib/firebaseCollections.ts`.

## Current Public Pages

- Home
- About Us
- Products
- Product Detail
- Contact Us
- Privacy Policy
- Disclaimer

## Next Steps

1. Add real Firebase config values.
2. Deploy Firestore and Storage rules.
3. Create the first admin user in Firebase Auth.
4. Add CMS admin pages.
5. Migrate static products and hero banners into Firestore.
6. Connect the Namecheap domain to Firebase Hosting.
