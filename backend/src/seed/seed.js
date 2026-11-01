import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';
import { Service } from '../models/Service.js';

dotenv.config();

const INITIAL_SERVICES = [
  {
    id: 'deep-cleaning',
    name: 'Deep Home Cleaning',
    slug: 'deep-cleaning',
    category: 'Full House',
    iconName: 'Sparkles',
    badge: 'Most Popular',
    shortDescription: 'Intensive top-to-bottom thorough cleaning for your entire home.',
    fullDescription: 'Our Deep Home Cleaning is a high-grade, comprehensive cleaning package designed to sanitize, degrease, and remove stubborn dirt from every corner of your house. Perfect for seasonal resets, post-renovation, or festival preparation.',
    startingPrice: 2499,
    estimatedDuration: '4 - 6 Hours',
    rating: 4.9,
    reviewCount: 482,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    included: [
      'Deep scrubbing of all home floors & tiles',
      'Kitchen degreasing (stovetop, countertops, cabinets exterior)',
      'Bathroom descaling & disinfection',
      'Dusting of doors, window frames & ceiling fans',
      'Vacuuming of sofas, carpets & curtains',
      'Balcony washing & glass panel wiping',
    ],
    excluded: [
      'Paint stain removal from walls',
      'Cleaning inside locked cabinets with personal items',
      'Outdoor garden or exterior roof cleaning',
      'Heavy furniture moving without assistance',
    ],
    benefits: [
      'Eliminates 99.9% of allergens and household bacteria',
      'Uses hospital-grade eco-friendly disinfectants',
      'Professional background-verified cleaners',
      '100% Satisfaction Guarantee',
    ],
    faqs: [
      {
        q: 'Do I need to supply cleaning equipment or products?',
        a: 'No, our team brings all specialized equipment, heavy-duty vacuum cleaners, ladder, microfiber towels, and eco-friendly cleaning agents.',
      },
      {
        q: 'How many cleaners will arrive at my home?',
        a: 'Depending on the property size, 2 to 4 trained cleaning specialists will arrive at your scheduled time slot.',
      },
    ],
    availableAddons: [
      { id: 'refrigerator', name: 'Inside Refrigerator Deep Clean', price: 499, icon: 'Refrigerator' },
      { id: 'oven', name: 'Inside Oven & Microwave Degrease', price: 399, icon: 'Flame' },
      { id: 'windows', name: 'Exterior Window Glass Polishing', price: 599, icon: 'Square' },
      { id: 'balcony', name: 'Extra Balcony Scrubbing', price: 350, icon: 'Sun' },
      { id: 'extra-bath', name: 'Extra Bathroom Cleaning', price: 450, icon: 'Bath' },
      { id: 'extra-bed', name: 'Extra Bedroom Cleaning', price: 350, icon: 'Bed' },
    ],
  },
  {
    id: 'standard-cleaning',
    name: 'Standard Home Cleaning',
    slug: 'standard-cleaning',
    category: 'Full House',
    iconName: 'Home',
    badge: 'Essential',
    shortDescription: 'Regular maintenance home cleaning to keep your living space tidy and spotless.',
    fullDescription: 'Keep your house effortlessly clean with our Standard Home Cleaning package. Designed for regular upkeep, this service covers general sweeping, mopping, dusting, trash removal, and surface wiping.',
    startingPrice: 1499,
    estimatedDuration: '2 - 3 Hours',
    rating: 4.8,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    included: [
      'Mopping & sweeping all room floors',
      'Dusting reachable surfaces, tables & shelves',
      'Kitchen counter wiping & sink cleaning',
      'Bathroom surface cleaning & mirror wipe down',
      'Bed making & trash bin emptying',
    ],
    excluded: [
      'Heavy kitchen degreasing',
      'Hard water stain descaling in bathrooms',
      'Ceiling fan deep scrub',
      'Window exterior cleaning',
    ],
    benefits: [
      'Quick & efficient maintenance clean',
      'Flexible weekly or bi-weekly scheduling',
      'Trained and trustworthy home cleaners',
    ],
    faqs: [
      {
        q: 'How often should I book standard home cleaning?',
        a: 'We recommend weekly or bi-weekly bookings to maintain a healthy and spotless home environment.',
      },
    ],
    availableAddons: [
      { id: 'refrigerator', name: 'Inside Refrigerator Deep Clean', price: 499, icon: 'Refrigerator' },
      { id: 'oven', name: 'Inside Oven & Microwave Degrease', price: 399, icon: 'Flame' },
      { id: 'balcony', name: 'Extra Balcony Scrubbing', price: 350, icon: 'Sun' },
    ],
  },
  {
    id: 'bathroom-cleaning',
    name: 'Bathroom Deep Cleaning',
    slug: 'bathroom-cleaning',
    category: 'Targeted Area',
    iconName: 'Bath',
    badge: 'Hygiene Focus',
    shortDescription: 'Rigorous descaling, tile scrubbing, and germ disinfection for home washrooms.',
    fullDescription: 'Eliminate hard water deposits, soap scum, mold, and odor-causing bacteria with our targeted Bathroom Deep Cleaning service. We restore tiles, shower doors, commodes, and fittings to a sparkling finish.',
    startingPrice: 699,
    estimatedDuration: '1 - 2 Hours',
    rating: 4.9,
    reviewCount: 620,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
    included: [
      'Scrubbing floor tiles & wall grout',
      'Commode descaling & deep sanitization',
      'Shower area glass panel water-mark removal',
      'Taps, fixtures & mirror shine polishing',
      'Exhaust fan & light fixture wiping',
    ],
    excluded: [
      'Plumbing repairs or drain unclogging',
      'Tile replacement or re-grouting',
    ],
    benefits: [
      'Stains and lime-scale removal',
      'Hospital-grade disinfectant spray',
      'Odors eliminated completely',
    ],
    faqs: [
      {
        q: 'Can hard water stains be 100% removed?',
        a: 'We remove up to 95% of hard water deposits depending on how long they have been embedded in the glass and ceramic.',
      },
    ],
    availableAddons: [
      { id: 'extra-bath', name: 'Additional Bathroom', price: 450, icon: 'Bath' },
      { id: 'exhaust-deep', name: 'Exhaust Fan Disassembly Scrub', price: 199, icon: 'Wind' },
    ],
  },
  {
    id: 'kitchen-cleaning',
    name: 'Kitchen Deep Cleaning',
    slug: 'kitchen-cleaning',
    category: 'Targeted Area',
    iconName: 'ChefHat',
    badge: 'Degrease Master',
    shortDescription: 'Heavy oil degreasing, appliance exterior scrub, and countertop polishing.',
    fullDescription: 'Cooking oils and grease build up fast in modern home kitchens. Our Kitchen Deep Cleaning removes tough oil layers, chimney exteriors, tile stains, sink grime, and countertop residue.',
    startingPrice: 999,
    estimatedDuration: '2 - 3 Hours',
    rating: 4.85,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    included: [
      'Stovetop, burners, & gas knobs scrubbing',
      'Chimney hood exterior degreasing',
      'Kitchen wall tiles oil stain removal',
      'Sink descaling & faucet polishing',
      'Countertop & cabinet door wiping',
    ],
    excluded: [
      'Inside cabinet cleaning (unless add-on selected)',
      'Gas pipe leak repairs',
    ],
    benefits: [
      'Non-toxic food-safe degreasers used',
      'Restores shine to stainless steel and granite',
    ],
    faqs: [
      {
        q: 'Are your cleaning products safe near food surfaces?',
        a: 'Yes, we use food-safe, chemical-neutral degreasers that leave no toxic residues.',
      },
    ],
    availableAddons: [
      { id: 'refrigerator', name: 'Inside Refrigerator Deep Clean', price: 499, icon: 'Refrigerator' },
      { id: 'oven', name: 'Inside Oven & Microwave Degrease', price: 399, icon: 'Flame' },
      { id: 'cabinets-inside', name: 'Inside Kitchen Cabinets Scrub', price: 599, icon: 'Archive' },
    ],
  },
  {
    id: 'move-in-out-cleaning',
    name: 'Move-In / Move-Out Home Cleaning',
    slug: 'move-in-out-cleaning',
    category: 'Specialized',
    iconName: 'Truck',
    badge: 'Empty House',
    shortDescription: 'Complete sanitize & shine before moving into a new home or leaving an old house.',
    fullDescription: 'Ensure a smooth transition with our specialized Move-In / Move-Out service. We thoroughly scrub empty home properties so you move into a spotless sanctuary.',
    startingPrice: 3299,
    estimatedDuration: '5 - 7 Hours',
    rating: 4.95,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    included: [
      'Deep cleaning of all empty rooms & closets inside out',
      'All home floors, tiles, skirting boards & corners scrubbed',
      'Kitchen cabinets cleaned inside and out',
      'Bathrooms completely sanitized & descaled',
      'Windows, doors, switches & light fixture wiping',
    ],
    excluded: [
      'Junk disposal or heavy debris removal',
      'Wall painting or touch-ups',
    ],
    benefits: [
      'Spotless home guaranteed before move-in',
      'Fresh start in your new sanctuary',
    ],
    faqs: [
      {
        q: 'Should electricity and water be active in the home?',
        a: 'Yes, we require active electricity and running water connection for our scrubbers and vacuum cleaners.',
      },
    ],
    availableAddons: [
      { id: 'refrigerator', name: 'Inside Refrigerator Deep Clean', price: 499, icon: 'Refrigerator' },
      { id: 'windows', name: 'Exterior Window Glass Polishing', price: 599, icon: 'Square' },
      { id: 'balcony', name: 'Extra Balcony Scrubbing', price: 350, icon: 'Sun' },
    ],
  },
  {
    id: 'sofa-carpet-cleaning',
    name: 'Home Sofa & Upholstery Cleaning',
    slug: 'sofa-carpet-cleaning',
    category: 'Furniture Care',
    iconName: 'Armchair',
    badge: 'Steam Scrub',
    shortDescription: 'Shampooing and stain extraction for living room fabric & leather sofas.',
    fullDescription: 'Revitalize dull living room sofas, armchairs, and dining chairs. We draw out deep-seated dust mites, sweat stains, and pet odors.',
    startingPrice: 799,
    estimatedDuration: '1.5 - 2.5 Hours',
    rating: 4.88,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    included: [
      'Dry vacuuming to remove surface dust',
      'Eco-shampoo application & spot treatment',
      'Deep moisture extraction',
      'Fabric softening & deodorizing spray',
    ],
    excluded: [
      'Tears, burns, or physical fabric repair',
      '100% old dye stain removal',
    ],
    benefits: [
      'Dries within 3-4 hours',
      'Removes deep odor and allergens',
    ],
    faqs: [
      {
        q: 'How long does the sofa take to dry after shampooing?',
        a: 'It takes approximately 3 to 5 hours depending on room ventilation and ceiling fan speed.',
      },
    ],
    availableAddons: [
      { id: 'cushions', name: 'Extra Cushion Shampooing (Set of 4)', price: 299, icon: 'Plus' },
      { id: 'mattress', name: 'Single Mattress Steam Scrub', price: 799, icon: 'Plus' },
    ],
  },
  {
    id: 'carpet-cleaning',
    name: 'Carpet & Area Rug Cleaning',
    slug: 'carpet-cleaning',
    category: 'Furniture Care',
    iconName: 'Layers',
    badge: 'Deep Shampoo',
    shortDescription: 'Deep shampooing and fiber sanitization for home rugs and carpets.',
    fullDescription: 'Prolong carpet life and restore vibrant colors with professional carpet shampooing. Ideal for high-traffic living room rugs and bedroom floor covers.',
    startingPrice: 899,
    estimatedDuration: '1 - 2 Hours',
    rating: 4.79,
    reviewCount: 160,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    included: [
      'High-power HEPA dry vacuuming',
      'Pre-treatment for high-traffic stains',
      'Shampoo scrubber agitation',
      'Moisture extraction & grooming',
    ],
    excluded: [
      'Severe pet urine odor elimination from carpet backing',
    ],
    benefits: [
      'Restores carpet fluff and softness',
      'Kills microscopic dust mites',
    ],
    faqs: [
      {
        q: 'Can delicate silk or wool rugs be cleaned?',
        a: 'Yes, we use special low-moisture pH-neutral cleansers for delicate wool and silk fibers.',
      },
    ],
    availableAddons: [
      { id: 'sanitization-spray', name: 'Antimicrobial Shield Coating', price: 399, icon: 'Shield' },
    ],
  },
  {
    id: 'custom-cleaning',
    name: 'Custom Home Cleaning',
    slug: 'custom-cleaning',
    category: 'Specialized',
    iconName: 'Sliders',
    badge: 'Personalized',
    shortDescription: 'Select specific home tasks, hours, and areas tailored to your unique needs.',
    fullDescription: 'Have unique home cleaning requirements? Build your custom cleaning plan by choosing exact rooms, focus areas, and duration.',
    startingPrice: 1199,
    estimatedDuration: 'Flexible',
    rating: 4.84,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    included: [
      'Customized checklist based on your priorities',
      'Dedicated lead cleaner coordination',
      'Full equipment and supply bundle included',
    ],
    excluded: [
      'Hazardous material cleaning',
    ],
    benefits: [
      'Pay only for what you need',
      'Customized time allocation',
    ],
    faqs: [
      {
        q: 'How is custom cleaning priced?',
        a: 'Pricing is dynamically calculated based on selected duration, property parameters, and specific add-ons.',
      },
    ],
    availableAddons: [
      { id: 'refrigerator', name: 'Inside Refrigerator Deep Clean', price: 499, icon: 'Refrigerator' },
      { id: 'oven', name: 'Inside Oven & Microwave Degrease', price: 399, icon: 'Flame' },
      { id: 'windows', name: 'Exterior Window Glass Polishing', price: 599, icon: 'Square' },
      { id: 'balcony', name: 'Extra Balcony Scrubbing', price: 350, icon: 'Sun' },
    ],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('[Seed]: Seeding database...');

    // Seed Admins (supports both common spellings)
    const adminEmails = ['admin@sagrika.com', 'admin@sagarika.com'];
    const passwordHash = await bcrypt.hash('admin123', 10);

    for (const email of adminEmails) {
      let admin = await Admin.findOne({ email });
      if (!admin) {
        await Admin.create({
          name: 'Sagarika Admin',
          email,
          passwordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
        });
        console.log(`[Seed]: Created default Admin: ${email} / admin123`);
      } else {
        console.log(`[Seed]: Admin ${email} already exists.`);
      }
    }

    // Seed Services
    await Service.deleteMany({});
    await Service.insertMany(INITIAL_SERVICES);
    console.log(`[Seed]: Seeded ${INITIAL_SERVICES.length} services successfully.`);

    console.log('[Seed]: Database seeding finished cleanly!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
