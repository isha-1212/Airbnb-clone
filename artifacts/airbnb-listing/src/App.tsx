import { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { AirVent, ArrowLeft, ArrowRight, Bath, Bell, CalendarDays, Car, Check, ChevronDown, ChevronLeft, ChevronRight, DoorOpen, Flag, Globe2, Grid2X2, GraduationCap, Heart, House, KeyRound, Leaf, MapPin, Menu, Minus, PawPrint, Search, Send, ShieldCheck, Sparkles, Tag, Umbrella, Wifi, X, Plus } from 'lucide-react';
import './index.css';
import s1 from './assets/demo/s1.jpeg';
import s2 from './assets/demo/s2.jpeg';
import s3 from './assets/demo/s3.jpeg';
import s4 from './assets/demo/s4.jpeg';
import s5 from './assets/demo/s5.jpeg';
import s6 from './assets/demo/s6.jpeg';
type ImageItem = { id: string; url: string; alt: string; category: string };
const img = (id: string, url: string, alt: string, category: string): ImageItem => ({ id, url, alt, category });
const images: ImageItem[] = [
  img('living-1', s1, 'Living room', 'Living room 1'),
  img('outdoor', s2, 'Outdoor area', 'Living room 2'),
  img('jacuzzi', s3, 'Private jacuzzi', 'Full bathroom'),
  img('bedroom', s4, 'Bedroom', 'Bedroom'),
  img('exterior', s5, 'Apartment exterior', 'Exterior'),
  img('kitchen', s6, 'Full kitchen', 'Full kitchen'),

  img('bath', s1, 'Bathroom', 'Full bathroom'),
  img('pool', s2, 'Pool', 'Pool'),
  img('gym', s3, 'Gym', 'Gym'),
  img('detail', s4, 'Apartment details', 'Additional photos'),
];
const amenities = [
  ['Kitchen', UtensilsIcon], ['Wifi', Wifi], ['Dedicated workspace', House], ['Free parking on premises', Car],
  ['Pool', WavesIcon], ['Hot tub', Bath], ['Pets allowed', PawPrint], ['Exterior security cameras on property', ShieldCheck],
  ['Carbon monoxide alarm', Bell], ['Smoke alarm', Bell],
] as const;
const topicLabels = ['Comfort 6', 'Accuracy 5', 'Hot tub 5', 'Condition 4', 'Hospitality 8', 'Cleanliness 4', 'Amenities 2', 'Location 4'];
const reviews = [
  { name: 'Amit', tenure: '2 months on Airbnb', time: '1 week ago', text: 'Very helpful and responsive team. Safe and peaceful stay, loved everything about the property.' },
  { name: 'Aheesh', tenure: '3 years on Airbnb', time: '2 weeks ago', text: 'We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay.' },
  { name: 'Samiksha', tenure: '1 month on Airbnb', time: '3 weeks ago', text: 'The apartment is beautiful and thoughtfully set up. Perfect location for exploring Candolim.' },
  { name: 'Vedant', tenure: '4 months on Airbnb', time: '1 month ago', text: 'Great check-in experience and a relaxing jacuzzi. Would definitely recommend.' },
];
const cohosts = ['Sharath', 'Aman Dev Pahwa', 'Maria Karen Priyanka', 'Simran', 'Pallavi', 'Sanyukta', 'Shruti', 'Amisha'];
const nearby = [
  ['Beautiful Studio with a view to die for','₹23,600','4.91', '/demo/living-room.svg'],
  ['NAQAB - 1bhk with private pool','₹42,218','4.95','/demo/outdoor.svg'],
  ['Greentique Luxury Flat with plunge pool, Calangute','₹44,506','4.94','/demo/bedroom.svg'],
  ['The Tropical Studio | 5 mins to Beach','₹22,824','4.96','/demo/exterior.svg'],
  ['Luxury Casa Bella 1BHK with plunge pool, Calangute','₹39,942','4.95','/demo/kitchen.svg'],
];
const photoTourOrder = ['living-1', 'outdoor', 'kitchen', 'bedroom', 'bath', 'gym', 'exterior', 'pool', 'detail'];
type DateRange = [number, number];
const getNights = ([checkIn, checkOut]: DateRange) => checkIn && checkOut && checkOut > checkIn ? checkOut - checkIn : 0;
const displayDate = (day: number) => day ? `10/${String(day).padStart(2, '0')}/2026` : 'Add dates';
const displayRange = ([checkIn, checkOut]: DateRange) => checkIn && checkOut ? `${checkIn} Oct 2026 - ${checkOut} Oct 2026` : 'Add dates to see the total';

function UtensilsIcon(props: { size?: number }) { return <Sparkles {...props} />; }
function WavesIcon(props: { size?: number }) { return <Bath {...props} />; }

function Header() {
  return <header className="site-header">
    <a className="brand" href="/" data-testid="link-home"><span className="brand-mark">A</span><span>airbnb</span></a>
    <div className="search-pill" role="search">
      <span className="search-part">Anywhere</span><span className="search-part">Anytime</span><span className="search-part">Add guests</span>
      <button className="search-submit" aria-label="Search" data-testid="button-search"><Search size={18} /></button>
    </div>
    <div className="header-links"><a className="host-link" href="#host">Become a host</a><button className="round-btn" aria-label="Choose language" data-testid="button-language"><Globe2 size={19} /></button><button className="round-btn" aria-label="Open menu" data-testid="button-menu"><Menu size={20} /></button></div>
  </header>;
}

function BookingCard({ selected }: { selected: DateRange }) {
  const nights = getNights(selected) || 5;
  return <aside className="booking-wrap" aria-label="Reservation details">
    <div className="discount"><Tag size={18} /><span className="discount-text">Get 10% off your next stay.<br /><u>Terms apply</u></span><button className="claim" data-testid="button-claim">Claim</button></div>
    <div className="booking-card"><div className="price-line"><b>₹{(28499 / 5 * nights).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b> for {nights} nights</div>
      <div className="date-fields"><div className="date-field"><span className="field-label">CHECK-IN</span><span className="field-value">{displayDate(selected[0] || 18)}</span></div><div className="date-field"><span className="field-label">CHECKOUT</span><span className="field-value">{displayDate(selected[1] || 23)}</span></div></div>
      <div className="guest-field"><span><span className="field-label">GUESTS</span><span className="field-value">2 guests</span></span><ChevronDown size={16} /></div>
      <div className="cancel-note">Free cancellation before <b>17 October</b></div><button className="reserve" data-testid="button-reserve">Reserve</button><p className="charged">You won't be charged yet</p>
    </div><a className="report" href="#report"><Flag size={12} /> &nbsp;Report this listing</a>
  </aside>;
}

function SectionNav({ active, scrollTo, selected }: { active: string; scrollTo: (id: string) => void; selected: DateRange }) {
  const nights = getNights(selected) || 5;
  const total = (28499 / 5 * nights).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  return <div className="section-nav"><div className="nav-inner"><nav className="nav-tabs" aria-label="Listing sections">{[['photos', 'Photos'], ['amenities', 'Amenities'], ['reviews', 'Reviews'], ['location', 'Location']].map(([id, label]) => <button key={id} className={`nav-tab ${active === id ? 'active' : ''}`} onClick={() => scrollTo(id)} data-testid={`button-nav-${id}`}>{label}</button>)}</nav><div className="nav-summary"><div className="nav-price"><strong>₹{total}</strong> for {nights} nights<br />★ 4.95 · 19 reviews</div><button className="reserve" data-testid="button-nav-reserve">Reserve</button></div></div></div>;
}

function Hero({ onPhotos }: { onPhotos: () => void }) {
  return <><div className="title-row"><h1>Romantic Jacuzzi 1BHK Candolim | Mirashya UG10</h1><div className="title-actions"><button className="plain-action" data-testid="button-share"><Send size={16} />Share</button><button className="plain-action" data-testid="button-save"><Heart size={17} />Save</button></div></div><div className="hero">
    <div className="hero-main"><img src={images[0].url} alt={images[0].alt} /></div>{images.slice(1, 5).map((item, index) => <div className="hero-tile" key={item.id}><img src={item.url} alt={item.alt} />{index === 3 && <button className="show-photos" onClick={onPhotos} data-testid="button-show-photos"><Grid2X2 size={15} />Show all photos</button>}</div>)}
  </div></>;
}

function Summary() {
  return <section id="photos" className="summary"><h2>Entire serviced apartment in Candolim, India</h2><p className="summary-sub">3 guests · 1 bedroom · 1 bed · 1 bathroom</p><div className="favorite"><div className="laurel"><Leaf size={20} /><b>Guest<br />favourite</b><Leaf size={20} /></div><div className="favorite-copy">One of the most loved homes on Airbnb, according to guests</div><div><span className="rating-big">4.95</span><span className="stars">★★★★★</span></div><div><span className="rating-big">19</span><span className="fav-label">Reviews</span></div></div><div className="host-row"><div className="avatar">MIRASHYA</div><div><div className="host-name">Hosted by Mirashya Homes</div><div className="muted">2 years hosting</div></div></div><div className="highlights">{[['Outdoor entertainment', 'The pool and alfresco dining are great for summer trips.', Umbrella], ['Designed for staying cool', 'Beat the heat with the A/C and ceiling fan.', AirVent], ['Self check-in', 'You can check in with the building staff.', DoorOpen]].map(([title, desc, Icon]) => <div className="highlight" key={title as string}><Icon size={19} /><b>{title as string}</b><p>{desc as string}</p></div>)}</div></section>;
}

function DescriptionAndSleep() {
  const [expanded, setExpanded] = useState(false);
  return <><section className="description"><div className="translation">Some info has been automatically translated. <button className="link" data-testid="button-show-original">Show original</button></div><div className={expanded ? '' : 'fade'}><p>Plan your relaxing holiday at Amor De Goa by Mirashya Homes. Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi for the perfect unwind. Enjoy high-speed WiFi, Smart TV, pet-friendly comfort, and stylish interiors. Just minutes from Candolim Beach, popular cafes, restaurants, and nightlife.</p></div><button className="show-more" onClick={() => setExpanded(!expanded)} data-testid="button-description-more">{expanded ? 'Show less' : 'Show more'} <ArrowRight size={14} /></button></section><section className="sleep"><h2>Where you'll sleep</h2><div className="sleep-grid"><div className="sleep-card"><img src={images[3].url} alt="Bedroom" /><b>Bedroom</b><span>1 double bed</span></div><div className="sleep-card"><img src={images[0].url} alt="Living room" /><b>Living room</b><span>1 sofa</span></div></div></section></>;
}

function Amenities() {
  const [showAll, setShowAll] = useState(false);
  return <section id="amenities"><h2>What this place offers</h2><div className="amenities">{amenities.slice(0, showAll ? 10 : 8).map(([label, Icon], index) => <div className={`amenity ${index > 7 ? 'off' : ''}`} key={label}><Icon size={19} /><span>{label}</span></div>)}</div><button className="outline-btn" onClick={() => setShowAll(!showAll)} data-testid="button-amenities-more">{showAll ? 'Show fewer amenities' : 'Show all 50 amenities'}</button></section>;
}

function Calendar({ selected, onSelect }: { selected: DateRange; onSelect: (range: DateRange) => void }) {
  const days = (month: number) => Array.from({ length: 35 }, (_, i) => i < month ? null : i - month + 1);
  const nights = getNights(selected);
  return <section className="calendar"><h2>{nights ? `${nights} nights in Candolim` : 'Select your dates'}</h2><div className="month-sub">{displayRange(selected)}</div><div className="calendar-head"><button className="round-btn" data-testid="button-calendar-prev"><ChevronLeft size={18} /></button><div className="cal-months"><div className="month-title">October 2026</div><div className="month-title">November 2026</div></div><button className="round-btn" data-testid="button-calendar-next"><ChevronRight size={18} /></button></div><div className="cal-months">{[3, 0].map((offset, mi) => <div key={mi}><div className="week">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div><div className="days">{days(offset).map((day, i) => day ? <button key={i} className={`day ${mi === 0 && selected[0] && day >= selected[0] && day <= selected[1] ? 'range' : ''} ${mi === 0 && (day === selected[0] || day === selected[1]) ? 'selected' : ''} ${mi === 0 && day < 18 ? 'past' : ''}`} onClick={() => mi === 0 && day >= 18 && day <= 31 && onSelect(day <= (selected[0] || 18) ? [day, selected[1] || day + 5] : [selected[0] || 18, day])} data-testid={`button-date-${mi}-${day}`}>{day}</button> : <span key={i} />)}</div></div>)}</div><div className="calendar-foot"><CalendarDays size={18} /><button className="clear" onClick={() => onSelect([0, 0])} data-testid="button-clear-dates">Clear dates</button></div></section>;
}

function RatingReviews() {
  const [showAll, setShowAll] = useState(false);
  const [topic, setTopic] = useState('');

  return (
    <section id="reviews" className="rating-section">

      {/* =========================
          RATING HERO
          ========================= */}
      <div className="rating-hero-wrap">

        <img
          src="/assets/images/ui/laurel-left.png"
          alt=""
          className="rating-laurel rating-laurel-left"
        />

        <div className="rating-hero">
          4.95
        </div>

        <img
          src="/assets/images/ui/laurel-right.png"
          alt=""
          className="rating-laurel rating-laurel-right"
        />

      </div>

      <small>Guest favourite</small>

      <p className="rating-desc">
        This home is a guest favourite based on ratings, reviews and reliability
      </p>

      <button
        className="link"
        data-testid="button-how-reviews"
      >
        How reviews work
      </button>


      {/* =========================
          RATING BREAKDOWN
          ========================= */}
      <div className="breakdown">

        <div className="break-col">
          <div className="break-label">
            Overall rating
          </div>

          {[5, 4, 3, 2, 1].map((n, i) => (
            <div className="bar-row" key={n}>
              {n}

              <span
                className={`bar ${i === 0 ? 'filled' : ''}`}
                style={{
                  width:
                    i === 0
                      ? '95%'
                      : i === 1
                      ? '8%'
                      : '2%',
                }}
              />
            </div>
          ))}
        </div>


        {[
          ['Cleanliness', '5.0', Sparkles],
          ['Accuracy', '5.0', Check],
          ['Check-in', '5.0', KeyRound],
          ['Communication', '5.0', Bell],
          ['Location', '4.8', MapPin],
          ['Value', '4.8', Tag],
        ].map(([name, score, Icon]) => (
          <div
            className="break-col"
            key={name as string}
          >
            <div className="break-label">
              {name as string}
            </div>

            <div className="cat-score">
              {score as string}
            </div>

            <Icon
              className="cat-icon"
              size={22}
            />
          </div>
        ))}

      </div>


      {/* =========================
          REVIEW TOPICS
          ========================= */}
      <div className="topics">

        {topicLabels.map((label) => (
          <button
            className={`topic ${
              topic === label ? 'active' : ''
            }`}
            key={label}
            onClick={() =>
              setTopic(
                topic === label ? '' : label
              )
            }
            data-testid={`button-topic-${label
              .split(' ')[0]
              .toLowerCase()}`}
          >
            {label}
          </button>
        ))}

      </div>


      {/* =========================
          REVIEWS
          ========================= */}
      <div className="review-grid">

        {reviews
          .slice(0, showAll ? 4 : 2)
          .map((review, index) => (
            <article
              className="review"
              key={review.name}
            >

              <div className="review-head">

                <div className="review-avatar">
                  {review.name[0]}
                </div>

                <div>
                  <div className="review-name">
                    {review.name}
                  </div>

                  <div className="muted">
                    {review.tenure}
                  </div>
                </div>

              </div>


              <div className="stars">
                ★★★★★{' '}

                <span className="muted">
                  {review.time}
                </span>
              </div>


              <p>
                {review.text}
              </p>


              {index === 1 && (
                <button
                  className="link"
                  data-testid={`button-review-more-${index}`}
                >
                  Show more
                </button>
              )}

            </article>
          ))}

      </div>


      {/* =========================
          SHOW ALL REVIEWS
          ========================= */}
      <button
        className="outline-btn reviews-more"
        onClick={() => setShowAll(!showAll)}
        data-testid="button-reviews-more"
      >
        {showAll
          ? 'Show fewer reviews'
          : 'Show all 19 reviews'}
      </button>

    </section>
  );
}

function LocationHost() {
  return (
    <>
      {/* ================= LOCATION ================= */}
      <section id="location">

        <h2>Where you’ll be</h2>

        <div className="muted">
          Candolim, Goa, India
        </div>

        <div className="map">
          <div className="map-controls">

            <button
              aria-label="Search map"
              data-testid="button-map-search"
            >
              <Search size={16} />
            </button>

            <span>
              <button
                aria-label="Zoom in"
                data-testid="button-map-plus"
              >
                <Plus size={15} />
              </button>

              <button
                aria-label="Zoom out"
                data-testid="button-map-minus"
              >
                <Minus size={15} />
              </button>
            </span>

          </div>

          <div className="pin">
            <House size={19} />
          </div>
        </div>

        <div className="muted">
          Exact location will be provided after booking.
        </div>

        <div className="neighborhood">
          <h2>Neighbourhood highlights</h2>

          <p>
            Located in the heart of Candolim, Amor de Goa offers a peaceful
            stay with easy access to beaches, cafes, and popular attractions.
          </p>

          <button
            className="show-more"
            data-testid="button-neighborhood-more"
          >
            Show more <ArrowRight size={14} />
          </button>
        </div>

      </section>


      {/* ================= MEET YOUR HOST ================= */}
      <section id="host" className="host-section">

        <h2>Meet your host</h2>

        <div className="host-layout">

          {/* LEFT - HOST */}
          <div className="host-left">

            <div className="host-card">

              <div className="host-profile">

                <div className="avatar">
                  MIRASHYA
                </div>

                <h3>
                  Mirashya
                  <br />
                  Homes
                </h3>

                <span>Host</span>

              </div>


              <div className="host-stats">

                <div className="host-stat">
                  <b>1,463</b>
                  <span>Reviews</span>
                </div>

                <div className="host-stat">
                  <b>4.68★</b>
                  <span>Rating</span>
                </div>

                <div className="host-stat">
                  <b>2</b>
                  <span>Years hosting</span>
                </div>

              </div>

            </div>


            {/* HOST FACTS */}
            <div className="facts">

              <div>
                <MapPin size={18} />
                <span>Born in the 80s</span>
              </div>

              <div>
                <GraduationCap size={18} />
                <span>
                  Where I went to school: NICMAR GOA
                </span>
              </div>

            </div>

          </div>


          {/* RIGHT - CO HOSTS */}
          <div className="host-right">

            <h3 className="cohosts-title">
              Co-Hosts
            </h3>

            <div className="cohosts">

              {cohosts.map((name) => (
                <div
                  className="cohost"
                  key={name}
                >
                  <span className="cohost-avatar">
                    {name[0]}
                  </span>

                  <span className="cohost-name">
                    {name}
                  </span>
                </div>
              ))}

            </div>


            {/* HOST DETAILS */}
            <div className="host-detail">

              <h3>Host details</h3>

              <p>
                Response rate: 100%
              </p>

              <p>
                Responds within an hour
              </p>

              <button
                className="outline-btn message"
                data-testid="button-message-host"
              >
                Message host
              </button>

            </div>


            {/* SAFETY - ONLY ONE */}
            <div className="safety">

              <ShieldCheck
                size={24}
                strokeWidth={1.5}
              />

              <span>
                To help protect your payment, always use Airbnb to send money and communicate with hosts.
              </span>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}

function ThingsNearby() {
  const [page, setPage] = useState(0);

  const things = [
    {
      title: 'Cancellation policy',
      icon: CalendarDays,
      items: [
        'Free cancellation before 17 October.',
        'Cancel before check-in on 18 October for a partial refund.',
        "Review this host's full policy for details."
      ]
    },
    {
      title: 'House rules',
      icon: KeyRound,
      items: [
        'Check-in after 2:00 pm',
        'Checkout before 11:00 am',
        '3 guests maximum'
      ]
    },
    {
      title: 'Safety & property',
      icon: ShieldCheck,
      items: [
        'Carbon monoxide alarm not reported',
        'Smoke alarm not reported',
        'Exterior security cameras on property'
      ]
    }
  ];

  return (
    <>
      {/* ================= THINGS TO KNOW ================= */}
      <section className="things-section">

        <h2>Things to know</h2>

        <div className="things">

          {things.map(({ title, icon: Icon, items }) => (
            <div className="thing" key={title}>

              <div className="thing-icon">
                <Icon size={24} strokeWidth={1.5} />
              </div>

              <h3>{title}</h3>

              <ul>
                {items.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                className="link"
                data-testid={`button-learn-${title}`}
              >
                Learn more
              </button>

            </div>
          ))}

        </div>

      </section>


      {/* ================= MORE STAYS ================= */}
      <section className="nearby-section">

        <div className="nearby-head">

          <h2>More stays nearby</h2>

          <div className="carousel-controls">

            <span>{page + 1} / 2</span>

            <button
              onClick={() =>
                setPage(Math.max(0, page - 1))
              }
              aria-label="Previous stays"
              data-testid="button-nearby-prev"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() =>
                setPage(Math.min(1, page + 1))
              }
              aria-label="Next stays"
              data-testid="button-nearby-next"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

        <div className="nearby-grid">

          {nearby.map(
            ([title, price, rating, url]) => (
              <article
                className="stay"
                key={title}
              >
                <img
                  src={url}
                  alt={title}
                />

                <div className="stay-title">
                  {title}
                </div>

                <div className="stay-meta">
                  {price} · ★ {rating}
                </div>
              </article>
            )
          )}

        </div>

      </section>
    </>
  );
}

function Lightbox({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (delta: number) => void }) {
  useEffect(() => { const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onMove(1); if (e.key === 'ArrowLeft') onMove(-1) }; window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle) }, [onClose, onMove]);
  return <div className="lightbox" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}><button className="lb-close" onClick={onClose} aria-label="Close photo" data-testid="button-lightbox-close"><X size={28} /></button><button className="lb-prev" onClick={() => onMove(-1)} aria-label="Previous photo" data-testid="button-lightbox-prev"><ArrowLeft size={34} /></button><img src={images[index].url} alt={images[index].alt} /><button className="lb-next" onClick={() => onMove(1)} aria-label="Next photo" data-testid="button-lightbox-next"><ArrowRight size={34} /></button><div className="lightbox-caption">{index + 1} / {images.length} · {images[index].category}</div></div>;
}

function PhotoTour({ onBack, openLightbox }: { onBack: () => void; openLightbox: (index: number) => void }) {
  const categories = useMemo(() => photoTourOrder.map(id => images.find(item => item.id === id)).filter(Boolean) as ImageItem[], []);
  return <div className="tour"><div className="tour-head"><button className="back-btn" onClick={onBack} data-testid="button-back-listing"><ArrowLeft size={16} /> Back to listing</button><h1>Photo tour</h1><span /></div><div className="thumb-strip">{categories.map((item, index) => <button className="thumb" key={item.id} onClick={() => document.getElementById(`tour-${item.id}`)?.scrollIntoView({ behavior: 'smooth' })} data-testid={`button-tour-thumb-${index}`}><img src={item.url} alt={item.alt} />{item.category}</button>)}</div>{categories.map((item, index) => <section className="tour-section" id={`tour-${item.id}`} key={item.id}><div><h2>{item.category}</h2><p>{index === 0 ? 'Sofa · Air conditioning · Ceiling fan · TV' : index === 2 ? 'Kitchen · Refrigerator · Cooking basics' : 'Comfortable spaces · Natural light · Thoughtful details'}</p></div><img src={item.url} alt={item.alt} onClick={() => openLightbox(images.findIndex(image => image.id === item.id))} data-testid={`image-tour-${index}`} /></section>)}</div>;
}

function ListingPage({
  goTour,
  openLightbox,
}: {
  goTour: () => void;
  openLightbox: (index: number) => void;
}) {
  const [active, setActive] = useState('photos');
  const [selected, setSelected] = useState<DateRange>([18, 23]);
  const [hideBooking, setHideBooking] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const reviews = document.getElementById('reviews');

      if (!reviews) return;

      setHideBooking(reviews.getBoundingClientRect().top <= 90);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const sections = ['photos', 'amenities', 'reviews', 'location']
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          )[0];

        if (visible) {
          setActive(visible.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -55% 0px',
        threshold: [0, 0.15, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <Hero onPhotos={goTour} />
      </main>

      <SectionNav
        active={active}
        scrollTo={scrollTo}
        selected={selected}
      />

      <main className="container">
        <div className="columns">
          <div className="content">
            <Summary />

            <DescriptionAndSleep />

            <Amenities />

            <Calendar
              selected={selected}
              onSelect={setSelected}
            />

            <RatingReviews />

            <LocationHost />
          </div>

          <div
            className={`booking-sticky ${
              hideBooking ? 'hide-on-reviews' : ''
            }`}
          >
            <BookingCard selected={selected} />
          </div>
        </div>

        {/* Full-width sections */}
        <ThingsNearby />

        <footer className="footer">
          <span>
            © 2026 Airbnb clone · Candolim, India
          </span>

          <span>
            Privacy · Terms · Support
          </span>
        </footer>
      </main>
    </div>
  );
}
function App() {
  const [location, setLocation] = useLocation(); const [lightbox, setLightbox] = useState<number | null>(null);
  const isTour = location === '/photos';
  const openLightbox = (index: number) => setLightbox((index + images.length) % images.length);
  return <>{isTour ? <PhotoTour onBack={() => setLocation('/')} openLightbox={openLightbox} /> : <ListingPage goTour={() => setLocation('/photos')} openLightbox={openLightbox} />} {lightbox !== null && <Lightbox index={lightbox} onClose={() => setLightbox(null)} onMove={(delta) => setLightbox((lightbox + delta + images.length) % images.length)} />}</>;
}

export default App;