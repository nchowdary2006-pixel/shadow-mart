import { Product, Review } from './types';
// @ts-ignore
import redbullPackImg from './assets/images/redbull_pack_1784375313480.jpg';
// @ts-ignore
import cheetosMasalaImg from './assets/images/cheetos_masala_bag_1784375462685.jpg';
// @ts-ignore
import fevicolBottleImg from './assets/images/fevicol_bottle_1784375574644.jpg';
// @ts-ignore
import penBlueImg from './assets/images/blue_ballpoint_pen_1784375709496.jpg';
// @ts-ignore
import penBlackImg from './assets/images/black_ballpoint_pen_1784375839100.jpg';
// @ts-ignore
import bhujiaSevImg from './assets/images/haldirams_aloo_bhujia_1784375951094.jpg';
// @ts-ignore
import fizzCanImg from './assets/images/bfizz_can_1784376231593.jpg';
// @ts-ignore
import milkBikisImg from './assets/images/milk_bikis_pack_1784377233295.jpg';
// @ts-ignore
import jimJamImg from './assets/images/britannia_treat_jim_jam_1784383409515.jpg';
// @ts-ignore
import thumsUpXforceImg from './assets/images/thums_up_xforce_1784383592906.jpg';
// @ts-ignore
import parleGImg from './assets/images/parle_g_pack_1784384459358.jpg';
// @ts-ignore
import actIIPopcornImg from './assets/images/act_ii_popcorn_pack_1784384757356.jpg';
// @ts-ignore
import darkFantasyMilkshakeImg from './assets/images/dark_fantasy_milkshake_pack_1784384886441.jpg';
// @ts-ignore
import hatsunButtermilkImg from './assets/images/hatsun_buttermilk_pack_1784387005239.jpg';
// @ts-ignore
import letsTryMurukkuImg from './assets/images/lets_try_murukku_pack_1784387100300.jpg';
// @ts-ignore
import smartWatchImg from './assets/images/smart_watch_new_product_1784387524420.jpg';

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'ShoppingBag' },
  { id: 'beverages', label: 'Beverages', icon: 'CupSoda' },
  { id: 'snacks', label: 'Snacks & Packaged Food', icon: 'Cookie' },
  { id: 'stationery', label: 'Stationery & Adhesives', icon: 'PenTool' },
  { id: 'electronics', label: 'Electronics', icon: 'Watch' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'redbull',
    name: 'RedBull',
    category: 'beverages',
    price: 130,
    originalPrice: 145,
    stock: 1,
    image: redbullPackImg,
    description: 'Red Bull Energy Drink is a functional beverage giving you wings whenever you need them. Vitalizes body and mind.',
    tags: ['Energy Drink', 'Chilled', 'Active'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'cheetos',
    name: 'Cheetos',
    category: 'snacks',
    price: 36,
    originalPrice: 40,
    stock: 3,
    image: cheetosMasalaImg,
    description: 'Cheetos Masala Balls are the perfect spicy snack, packed with flavor and satisfyingly crunchy. Made from premium corn.',
    tags: ['Masala Balls', 'Spicy', 'Crunchy'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'bauli',
    name: 'Bauli Moonfils Croissant',
    category: 'snacks',
    price: 26,
    originalPrice: 30,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    description: 'Delicious crescent-shaped puff rolls filled with rich, creamy Italian chocolate. Soft, fluffy, and baked to perfection.',
    tags: ['Chocolate', 'Italian Cream', 'Soft Roll'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'appy-fizz',
    name: 'Thums Up Xforce',
    category: 'beverages',
    price: 20,
    originalPrice: 25,
    stock: 3,
    image: thumsUpXforceImg,
    description: 'Thums Up Xforce is an intense, high-energy carbonated beverage with a strong cola taste and thunderous power.',
    tags: ['Cola', 'High Energy', 'Chilled'],
    instant: true,
    rating: 4.7,
  },
  {
    id: 'fevicol',
    name: 'fevicol',
    category: 'stationery',
    price: 28,
    originalPrice: 32,
    stock: 3,
    image: fevicolBottleImg,
    description: 'Fevicol MR Squeeze Bottle is a premium multi-purpose white synthetic adhesive. Perfect for school projects, crafts, and cardboard binding.',
    tags: ['Glue', 'Crafts', 'Super Adhesive'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'pen-blue',
    name: 'pen blue',
    category: 'stationery',
    price: 10,
    originalPrice: 12,
    stock: 3,
    image: penBlueImg,
    description: 'Smudge-free blue ink ballpoint pen with smooth flow and comfortable grip. Long-lasting ink for professional or educational writing.',
    tags: ['Blue Ink', 'Ballpoint', 'Fine Tip'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'pen-black',
    name: 'pen black',
    category: 'stationery',
    price: 10,
    originalPrice: 12,
    stock: 3,
    image: penBlackImg,
    description: 'Premium black ballpoint pen featuring a sleek matt foiled body, providing a non-slip grip and elegant black writing experience.',
    tags: ['Black Ink', 'Matt Body', 'Smooth Glide'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'milk-bikis',
    name: 'Britannia Treat Jim Jam',
    category: 'snacks',
    price: 10,
    originalPrice: 15,
    stock: 2,
    image: jimJamImg,
    description: 'Crispy biscuit shells filled with sweet cream and topped with a dollop of sticky, delicious raspberry jam.',
    tags: ['Cream Biscuit', 'Jam Cookie', 'Sweet Treat'],
    instant: true,
    rating: 4.5,
  },
  {
    id: 'bhujia-sev',
    name: "Haldiram's Bhujia Sev",
    category: 'snacks',
    price: 54,
    originalPrice: 60,
    stock: 2,
    image: bhujiaSevImg,
    description: 'A classic crispy snack made of moth beans, gram flour, and mixed spices. The authentic taste of Bikaner directly at your doorstep.',
    tags: ['Indian Savory', 'Spicy', 'Crispy Sev'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'chocobakes',
    name: 'Cadbury Chocobakes',
    category: 'snacks',
    price: 31,
    originalPrice: 35,
    stock: 1,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    description: 'Crunchy chocolate cookie on the outside with a smooth, velvety chocolate-filled center. A sweet treat that melts in your mouth.',
    tags: ['Choco Filled', 'Cadbury Joy', 'Cookies'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'parle-g',
    name: 'Parle-G Original',
    category: 'snacks',
    price: 34,
    originalPrice: 12,
    stock: 2,
    image: parleGImg,
    description: 'The classic glucose biscuit that has been a staple snack for generations.',
    tags: ['Glucose', 'Classic', 'Biscuit'],
    instant: true,
    rating: 4.8,
  },
  {
    id: 'act-ii-popcorn',
    name: 'Act II Sour Cream & Cheese',
    category: 'snacks',
    price: 38,
    originalPrice: 50,
    stock: 2,
    image: actIIPopcornImg,
    description: 'Crispy popcorn seasoned with delicious sour cream and tangy cheese. A perfect snack for movie nights.',
    tags: ['Popcorn', 'Sour Cream', 'Cheese'],
    instant: true,
    rating: 4.6,
  },
  {
    id: 'dark-fantasy-milkshake',
    name: 'Sunfeast Dark Fantasy Chocolate Milkshake',
    category: 'beverages',
    price: 34,
    originalPrice: 60,
    stock: 2,
    image: darkFantasyMilkshakeImg,
    description: 'Rich, creamy chocolate milkshake infused with the signature flavor of Dark Fantasy cookies.',
    tags: ['Chocolate', 'Milkshake', 'Rich'],
    instant: true,
    rating: 4.8,
  },
  {
    id: 'hatsun-buttermilk',
    name: 'Hatsun Spiced Buttermilk',
    category: 'beverages',
    price: 25,
    originalPrice: 30,
    stock: 5,
    image: hatsunButtermilkImg,
    description: 'Refreshing and creamy spiced buttermilk, perfect for a hot day.',
    tags: ['Buttermilk', 'Refreshing', 'Spiced'],
    instant: true,
    rating: 4.5,
  },
  {
    id: 'lets-try-murukku',
    name: "Let's Try Butter Murukku",
    category: 'snacks',
    price: 68,
    originalPrice: 40,
    stock: 2,
    image: letsTryMurukkuImg,
    description: 'Crispy and savory butter murukku made with 100% groundnut oil. A traditional Indian snack.',
    tags: ['Murukku', 'Traditional', 'Crispy'],
    instant: true,
    rating: 4.7,
  },
  {
    id: 'smart-watch',
    name: 'All mobile laptop accessories Only Pre Order On Feedback support',
    category: 'electronics',
    price: 0,
    originalPrice: 1200,
    stock: 5,
    image: smartWatchImg,
    description: 'A stylish and functional smart watch with health tracking features and a sleek design.',
    tags: ['Smart Watch', 'Wearable', 'Fitness'],
    instant: true,
    rating: 4.6,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    username: 'Rohan Sharma',
    rating: 5,
    comment: 'Red Bull was delivered completely chilled and in just 10 minutes! Incredible instant local service.',
    productName: 'RedBull',
    date: 'July 17, 2026',
    verified: true,
  },
  {
    id: 'rev-2',
    username: 'Ananya Iyer',
    rating: 5,
    comment: 'The Cheetos Masala Balls are perfectly fresh and spicy. The automated webhook notification in our family discord server is super fun!',
    productName: 'Cheetos',
    date: 'July 15, 2026',
    verified: true,
  },
  {
    id: 'rev-3',
    username: 'Dev Patel',
    rating: 4,
    comment: 'Smooth and classic blue pens, perfect for my final exams. Highly recommend this store!',
    productName: 'pen blue',
    date: 'July 12, 2026',
    verified: true,
  }
];

export const FAQS = [
  {
    question: 'How do I receive my order?',
    answer: 'All daily essentials and snacks are delivered directly to your doorstep via our automated local logistics system. Most orders arrive within 10-15 minutes!'
  },
  {
    question: 'How does the Discord Webhook Integration work?',
    answer: 'Once you specify your Discord Webhook URL in Settings, the app automatically posts beautiful card embeds to your channel for new orders, customer reviews, and feedback.'
  },
  {
    question: 'Are these items always in stock?',
    answer: 'We coordinate live stock levels with neighborhood stores. If an item says "Out of Stock," we expect a restock within 2-4 hours.'
  },
  {
    question: 'What is the refund policy?',
    answer: 'We offer a 100% money-back or replacement guarantee if any item received is damaged or past its expiration date.'
  }
];
