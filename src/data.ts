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

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'ShoppingBag' },
  { id: 'beverages', label: 'Beverages', icon: 'CupSoda' },
  { id: 'snacks', label: 'Snacks & Packaged Food', icon: 'Cookie' },
  { id: 'stationery', label: 'Stationery & Adhesives', icon: 'PenTool' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'redbull',
    name: 'RedBull',
    category: 'beverages',
    price: 130,
    originalPrice: 145,
    stock: 24,
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
    stock: 8,
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
    name: 'Fizz',
    category: 'beverages',
    price: 20,
    originalPrice: 25,
    stock: 15,
    image: fizzCanImg,
    description: 'Appy Fizz is a refreshing, crisp apple-flavored sparkling drink. Perfect companion for quick hangouts and active refreshes.',
    tags: ['Apple Soda', 'Sparkling', 'Chilled'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'fevicol',
    name: 'fevicol',
    category: 'stationery',
    price: 10,
    originalPrice: 12,
    stock: 50,
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
    stock: 40,
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
    stock: 42,
    image: penBlackImg,
    description: 'Premium black ballpoint pen featuring a sleek matt foiled body, providing a non-slip grip and elegant black writing experience.',
    tags: ['Black Ink', 'Matt Body', 'Smooth Glide'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'milk-bikis',
    name: 'Britannia Milk Bikis',
    category: 'snacks',
    price: 10,
    originalPrice: 15,
    stock: 12,
    image: milkBikisImg,
    description: 'Milk Bikis has been a favorite brand among mothers for their kids. Loaded with the goodness of milk, calcium, and essential vitamins.',
    tags: ['Milk Biscuit', 'Kids Favorite', 'Healthy Snacking'],
    instant: true,
    rating: 4.0,
  },
  {
    id: 'bhujia-sev',
    name: "Haldiram's Bhujia Sev",
    category: 'snacks',
    price: 60,
    originalPrice: 75,
    stock: 30,
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
    price: 10,
    originalPrice: 15,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    description: 'Crunchy chocolate cookie on the outside with a smooth, velvety chocolate-filled center. A sweet treat that melts in your mouth.',
    tags: ['Choco Filled', 'Cadbury Joy', 'Cookies'],
    instant: true,
    rating: 4.0,
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
