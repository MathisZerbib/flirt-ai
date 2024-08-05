// Import necessary functions from @clerk/nextjs/server
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that should be considered public and not protected by middleware
const isPublicRoute = createRouteMatcher(['/sign-in(.*)']);

export default clerkMiddleware((auth, request) => {
    // Check if the current route is public
    if (!isPublicRoute(request)) {
        // If not public, protect the route
        auth().protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
