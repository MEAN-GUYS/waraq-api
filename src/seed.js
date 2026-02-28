const mongoose = require('mongoose');
const config = require('./config/config');
const { Order, Review, Book, User } = require('./models');

const reviewTexts = [
  'Absolutely loved this book! Could not put it down.',
  'A wonderful read, highly recommend to anyone.',
  'Great writing style and compelling story.',
  'One of the best books I have read this year.',
  'Interesting perspective, made me think differently.',
  'Good book overall, a few slow parts but worth it.',
  'Beautifully written, the characters felt so real.',
  'An engaging page-turner from start to finish.',
  'Solid read, I enjoyed the plot twists.',
  'Not bad, but I expected a bit more depth.',
  'Fantastic storyline with a satisfying ending.',
  'A must-read for anyone who enjoys this genre.',
  'Well-crafted and thought-provoking.',
  'Enjoyable and easy to read, perfect for weekends.',
  'The author really knows how to tell a story.',
];

const addresses = [
  { fullName: 'Karim Ibrahim', street: '11 Ahmed Said St', city: 'Cairo', country: 'Egypt', phone: '+201148059140' },
  { fullName: 'Asaad Mansour', street: '25 Tahrir Square', city: 'Cairo', country: 'Egypt', phone: '+201012345678' },
  { fullName: 'Mohamed Sameh', street: '8 Corniche El Nile', city: 'Giza', country: 'Egypt', phone: '+201098765432' },
  { fullName: 'Shahd Mostafa', street: '15 Garden City', city: 'Alexandria', country: 'Egypt', phone: '+201234567890' },
];

function pick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  console.log('Connected to MongoDB');

  const users = await User.find({}).lean();
  const books = await Book.find({}).lean();

  if (users.length === 0 || books.length === 0) {
    console.log('No users or books found. Seed some users and books first.');
    process.exit(1);
  }

  console.log(`Found ${users.length} users and ${books.length} books`);

  // Pick ~12 books as "top sellers" — they get ordered more
  const topBooks = books.slice(0, 12);
  const otherBooks = books.slice(12);

  // --- Create Orders ---
  const orders = [];
  let orderCount = 0;

  for (const user of users) {
    // Each user gets 3-4 orders
    const numOrders = randInt(3, 4);

    for (let i = 0; i < numOrders; i++) {
      // Each order has 2-5 items
      const numItems = randInt(2, 5);

      // Mix top books and other books
      const topPicks = pick(topBooks, Math.min(randInt(1, 3), numItems));
      const otherPicks = pick(otherBooks, numItems - topPicks.length);
      const orderBooks = [...topPicks, ...otherPicks];

      const items = orderBooks.map((book) => ({
        book: book._id,
        name: book.name,
        cover: book.cover,
        price: book.price,
        quantity: topBooks.includes(book) ? randInt(2, 6) : randInt(1, 2),
      }));

      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      orders.push({
        user: user._id,
        items,
        address: randElement(addresses),
        shippingStatus: 'delivered',
        paymentStatus: 'success',
        paymentMethod: randElement(['COD', 'card']),
        totalPrice: Math.round(totalPrice * 100) / 100,
      });

      orderCount++;
    }
  }

  await Order.insertMany(orders);
  console.log(`Created ${orderCount} orders`);

  // --- Create Reviews ---
  // Track which (user, book) pairs have been ordered
  const purchaseMap = new Map(); // key: `userId-bookId`, value: true
  for (const order of orders) {
    for (const item of order.items) {
      const key = `${order.user}-${item.book}`;
      purchaseMap.set(key, true);
    }
  }

  let reviewCount = 0;
  let skipped = 0;

  // Create reviews for each unique (user, book) pair
  for (const [key] of purchaseMap) {
    const [userId, bookId] = key.split('-');

    try {
      await Review.create({
        user: userId,
        book: bookId,
        rating: randInt(3, 5), // weighted toward positive reviews
        review: randElement(reviewTexts),
        liked: Math.random() > 0.2 ? true : Math.random() > 0.5 ? false : null,
      });
      reviewCount++;
    } catch (err) {
      if (err.code === 11000) {
        skipped++;
      } else {
        console.error(`Error creating review for ${key}:`, err.message);
      }
    }
  }

  console.log(`Created ${reviewCount} reviews (${skipped} duplicates skipped)`);
  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
