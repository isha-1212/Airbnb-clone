# IMPLEMENTATION_PLAN.md
Airbnb Clone — Desktop-only implementation plan (spec phase, no code yet)

This plan is derived from `REFERENCE_SPEC.md`. Anything marked ESTIMATE/UNKNOWN there is treated here as a decision the implementation will need to make independently (not copy), and is called out again under "Technical Risks."

---

## 1. Proposed Component Structure

```
App
└─ ListingPage (route: /listing/:id — single page, no modal routing needed for nav tabs)
   ├─ SiteHeader                     (logo, search pill, become-a-host, globe, menu — scrolls away normally)
   ├─ ListingTitleRow                (title, Share, Save)
   ├─ HeroGallery
   │   ├─ HeroGrid (1 large + 4 small tiles, rounded outer corners)
   │   └─ ShowAllPhotosButton        → opens PhotoTourPage
   ├─ StickySectionNav               (full-viewport-width bar; inner row aligned to page content margins)
   │   - outer wrapper: position: sticky; top: 0; width: 100vw (or 100% of a full-bleed ancestor); background white; bottom border
   │   - inner row: same max-width/left-right padding as the ListingPage content column, containing:
   │       - left: Photos | Amenities | Reviews | Location (underline on active)
   │       - far right: compact price + "★ rating · N reviews" + Reserve button
   │   - IntersectionObserver-driven active state (see §4)
   │   - onClick → smooth-scroll to target section ref
   │   - NOTE: this is the ONLY sticky element on the page. The BookingCard (below) is a separate,
   │     ordinary in-flow element and must NOT be given its own independent sticky/floating behavior —
   │     no screenshot shows that, so it is out of scope.
   ├─ ContentColumn (left, ~60-65% width)
   │   ├─ ListingSummary             (type line, guest/bed/bath line)  [section: photos]
   │   ├─ GuestFavouriteBadge
   │   ├─ HostRow
   │   ├─ HighlightsList             (3 icon+title+desc rows)
   │   ├─ TranslationNotice
   │   ├─ DescriptionBlock           (truncated + Show more)
   │   ├─ WhereYoullSleep            (2 room cards)
   │   ├─ AmenitiesPreview           [section: amenities]
   │   │   └─ ShowAllAmenitiesButton → opens AmenitiesModal (or inline expand)
   │   ├─ AvailabilityCalendar       (2-month, range select, Clear dates)
   │   ├─ RatingSummaryBig           ("4.95" hero rating block)
   │   ├─ RatingCategoryBreakdown    (bars + 6 category scores)
   │   ├─ ReviewTopicFilterPills     [section: reviews]
   │   ├─ ReviewCardsGrid            (2-col, Show more per card)
   │   ├─ ShowAllReviewsButton
   │   ├─ LocationMap                [section: location]
   │   ├─ NeighbourhoodHighlights
   │   ├─ MeetYourHost               (host card + bio facts + co-hosts grid + host details + Message host)
   │   ├─ PaymentSafetyNotice
   │   ├─ ThingsToKnow               (3-column: cancellation / house rules / safety)
   │   └─ NearbyStaysCarousel        (horizontal, own prev/next controls)
   └─ BookingCard (right column, ~35-40% width; ordinary in-flow element, NOT sticky/floating)
       ├─ DiscountBanner             (Get 10% off + Claim)
       └─ BookingCardBody
           ├─ PriceLine
           ├─ CheckInCheckoutFields
           ├─ GuestsField (dropdown)
           ├─ CancellationNote
           ├─ ReserveButton
           └─ ChargeDisclaimer

PhotoTourPage (separate route/view, reached from ShowAllPhotosButton)
   ├─ CategoryThumbnailStrip         (9 thumbnails + labels, click → scroll to category section)
   └─ CategorySections[]             (repeating: heading + amenity-tag subtitle + large photo)
       └─ onPhotoClick → opens Lightbox at that image index

Lightbox (overlay, mounted at app root so it can appear from either ListingPage gallery or PhotoTourPage)
   ├─ LightboxBackdrop
   ├─ LightboxImage (centered, rounded corners)
   ├─ PrevArrowControl / NextArrowControl
   ├─ CloseControl                   [UNKNOWN in reference — include for usability, standard "×"]
   └─ (optional) ImageCounter        [UNKNOWN in reference — include for usability]
```

---

## 2. Data Structure (listing/gallery content)

```ts
interface ListingData {
  id: string;
  title: string;                     // "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10"
  propertyType: string;               // "Entire serviced apartment in Candolim, India"
  summary: { guests: number; bedrooms: number; beds: number; bathrooms: number };
  heroImages: GalleryImage[];         // exactly 5, fixed order per §4 of REFERENCE_SPEC
  rating: {
    overall: number;                  // 4.95
    reviewCount: number;              // 19
    isGuestFavourite: boolean;
    categories: { cleanliness: number; accuracy: number; checkIn: number; communication: number; location: number; value: number };
    distribution: { stars: 1|2|3|4|5; count: number }[];
  };
  host: {
    name: string;
    avatarUrl: string;
    yearsHosting: number;
    reviewsCount: number;
    hostRating: number;
    bornDecade?: string;
    school?: string;
    responseRate: number;
    responseTime: string;
    isVerified: boolean;
  };
  coHosts: { name: string; avatarUrl: string }[];
  highlights: { icon: string; title: string; description: string }[];
  description: { translated: boolean; text: string };
  sleepingArrangements: { roomName: string; photo: string; caption: string }[];
  amenities: { icon: string; label: string; available: boolean }[]; // available:false → struck through
  amenitiesTotalCount: number;        // 50
  calendar: { checkIn: string; checkOut: string; blockedDates: string[] };
  reviewTopics: { label: string; icon: string; count: number }[];
  reviews: {
    id: string; author: string; avatarUrl: string; tenure: string;
    rating: number; timeAgo: string; text: string; isTruncated: boolean;
  }[];
  location: { neighbourhood: string; city: string; country: string; description: string };
  houseRules: { checkInTime: string; checkoutTime: string; maxGuests: number };
  safety: { carbonMonoxideAlarm: boolean; smokeAlarm: boolean; exteriorCameras: boolean };
  cancellationPolicy: { freeUntil: string; partialRefundNote: string };
  price: { amount: number; currency: string; nights: number };
  nearbyStays: { title: string; image: string; price: number; rating: number }[];
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: string;      // "Living room 1", "Full kitchen", etc — drives Photo Tour grouping
}
```

---

## 3. Required Application States

- `activeSection: 'photos' | 'amenities' | 'reviews' | 'location'` — drives the sticky nav underline; updated by scroll observation, also settable on click.
- `isNavStuck: boolean` — not strictly needed if using pure CSS `position: sticky`, but useful if any conditional styling (e.g., shadow-on-stuck) is desired later. Optional.
- `lightbox: { isOpen: boolean; imageIndex: number; imageSet: GalleryImage[] }`
- `photoTourOpen: boolean` (or route-based instead of state, e.g. a separate URL)
- `calendar: { checkIn: Date | null; checkOut: Date | null; visibleMonths: [Date, Date] }`
- `guestsCount: number`, `guestsDropdownOpen: boolean`
- `descriptionExpanded: boolean`
- `amenitiesModalOpen: boolean` (if "Show all 50 amenities" opens a modal rather than expanding inline — reference behavior for this click is not captured, treat as UNKNOWN/decision)
- `reviewsShowAllOpen: boolean` (if "Show all N reviews" opens a modal/expanded list)
- `activeReviewTopicFilter: string | null`
- `nearbyCarouselPage: number` (drives the "1 / 2" indicator and prev/next arrows)
- `focusedElement` — implicit via standard DOM focus management for keyboard/a11y (Tab order, focus trap in Lightbox/modals)

---

## 4. Required Interactions

Per the corrected priority rule: items marked **(confirmed)** reproduce something visible across the screenshots and are core scope. Items marked **(baseline default)** are not shown in any screenshot at all (no click/hover/keyboard transition was ever captured) — they get a normal, unremarkable implementation so the app is usable, but are not pixel/behavior targets and shouldn't absorb extra effort.

1. **Hero grid → Show all photos** click → navigate to Photo Tour view. **(confirmed structurally** — the button and destination view both exist in screenshots; the click transition itself isn't captured, only start/end states.)
2. **Secondary nav click** (Photos/Amenities/Reviews/Location) → smooth-scroll content column to the matching section's anchor. **(confirmed structurally** — the nav's existence and active-section mapping are confirmed; the click-triggered scroll itself is a baseline default since no click frame was captured.)
3. **Secondary nav scroll-sync**: implement via **IntersectionObserver** watching sentinel elements (or the section containers themselves) for each of the 4 sections; update `activeSection` when a section crosses a chosen viewport threshold. This is **(confirmed)** as the required mechanism per the corrected spec, and should reproduce the exact section boundaries documented in REFERENCE_SPEC §6.5.
4. **Calendar date click** → sets check-in/check-out range, updates the price-line nights count and the sticky-nav's echoed price text. **(confirmed** — the resulting selected-range visual state is shown in a screenshot.)
5. **"Show more" (description)** → expands full description text inline. **(confirmed** — the link is visible; expanded-state visual isn't captured, so exact expansion presentation is a baseline default.)
6. **Nearby stays carousel prev/next** → paginate visible cards, update "1 / 2" indicator. **(confirmed** — control exists in screenshot.)
7. **Photo Tour photo click** → opens Lightbox at that image. **(confirmed** — both the Photo Tour and Lightbox views exist as screenshots.)
8. **Lightbox prev/next arrow click** → change displayed image. **(confirmed** — arrows are visible in the screenshot.)

The following are **(baseline default only)** — no screenshot evidence at all; include the minimum needed for a working page, do not treat as reference-accuracy targets:
- Hero grid tile click opening the Lightbox directly (not shown; only the "Show all photos" button is shown as an entry point).
- Reserve button click behavior (no real checkout in scope).
- Check-in/Checkout field click behavior (calendar is shown inline in the page flow already, not as a popover — clicking the fields can simply be a no-op or scroll-to-calendar).
- Guests field dropdown contents/behavior.
- "Show all 50 amenities" and "Show all N reviews" — whether these open a modal or expand inline is unconfirmed; pick the simpler inline-expand approach unless told otherwise.
- Review topic pill filtering behavior.
- Map zoom/search icon behavior (static graphic is sufficient; do not build a live map integration unless separately requested).
- "Message host" behavior.
- Lightbox close control, image counter, Escape/ArrowLeft/ArrowRight keyboard handling, focus trap — add only a minimal close affordance for usability; do not over-invest here since none of it is a reproduction target.

---

## 5. Recommended Implementation Order

1. **Static shell & layout**: SiteHeader, ListingTitleRow, HeroGrid (non-interactive), two-column content/booking layout — establishes the base grid before any interactivity.
2. **Content column static sections** (top to bottom, no interactivity): Summary, GuestFavouriteBadge, HostRow, Highlights, Description, WhereYoullSleep, AmenitiesPreview, Calendar (static render), RatingSummaryBig, RatingCategoryBreakdown, ReviewTopicFilterPills, ReviewCardsGrid, LocationMap (static), NeighbourhoodHighlights, MeetYourHost, ThingsToKnow, NearbyStaysCarousel (static).
3. **BookingCard** static render, aligned beside content column.
4. **StickySectionNav — static version** (no scroll-sync yet): fixed markup, click = simple `scrollIntoView`, hard-coded active tab.
5. **StickySectionNav — scroll-sync**: add IntersectionObserver wiring across the four section anchors; verify against the documented active-section mapping in REFERENCE_SPEC §6.5 (Photos through the highlights block; Amenities through the rating breakdown; Reviews through the start of the map; Location from the map onward).
6. **Calendar interactivity**: date range selection, month navigation, "Clear dates", syncing displayed price/nights.
7. **Description expand/collapse**, **amenities show-all**, **reviews show-all**, **review topic filtering** — smaller self-contained interactive pieces.
8. **NearbyStaysCarousel pagination**.
9. **PhotoTourPage** as a second view/route, reusing gallery image data grouped by category.
10. **Lightbox** last, since it can be triggered from both the hero grid and the Photo Tour, and needs the full image data set wired up first; add keyboard handling and focus trap at this stage.
11. **Polish pass**: hover/focus states, transitions, responsive-desktop-only breakpoints, final spacing/typography pass against screenshots.

Rationale: build outward-in (static structure → the one confirmed complex behavior we have real spec detail for, the sticky nav → smaller isolated interactive widgets → the two views that depend on shared gallery data last).

---

## 6. Likely Technical Risks for Pixel Accuracy

1. **Sticky-nav trigger point & height** are estimates; getting the exact scroll offset where it "catches" will require iterative visual comparison against a live reference, not just this spec.
2. **Full-width sticky bar with margin-aligned inner content**: getting the bar's background to span 100% of the viewport while its content lines up exactly with the content column's edges requires the bar to live outside (or escape) whatever container constrains the main content column — a layout detail to get right early, since retrofitting it later touches the page shell.
3. **IntersectionObserver thresholds for 4 sections** are inherently approximate — the reference's exact section boundaries (especially the Reviews→Location handoff, which happens somewhere around the map appearing) were only bracketed between two screenshots, not pinpointed to a pixel.
4. **No hex colors, font sizes, spacing, or radii are confirmed** — the whole visual layer will be a best-effort visual match, not a measured one, and will likely need multiple correction passes once compared side-by-side with the live site.
5. **Lightbox and Photo Tour close/exit controls are unconfirmed** — whatever is implemented is a baseline usability default, not a reproduction, and should be kept minimal rather than polished, since no reference behavior exists to match.
6. **Calendar popover vs. inline behavior for the Check-in/Checkout fields** — reference shows the calendar inline in page flow; treat as inline (confirmed) and don't build a popover.
7. **"Show all amenities" / "Show all reviews" behavior** (modal vs. inline expansion) is unconfirmed; default to the simpler inline-expand approach rather than investing in a modal system for an unverified detail.
8. **Stylized map**: reference appears to show a flat illustrative placeholder, not a live map tile provider — build a simple static/illustrative graphic rather than integrating a real map SDK, since that matches what's actually visible.
9. **All hover/focus/active states are pure invention** — no visual reference exists for them; keep them ordinary and don't chase a "look" for them.
10. **Asset sourcing**: every photo, avatar, and icon must be an original/licensed substitute (per source-code/asset restrictions), so exact visual match to the reference's specific photography is not the goal — compositional/structural match is.

Resolved (no longer a risk): whether the booking card needs independent sticky behavior — confirmed out of scope; it is an ordinary in-flow element.
