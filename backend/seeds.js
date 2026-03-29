const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reusehub';

const generateProducts = () => {
  const categories = ['Electronics', 'Vehicles', 'Furniture', 'Fashion', 'Sports', 'Books', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Austin, TX',
    'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Boston, MA',
    'San Francisco, CA', 'Atlanta, GA', 'Portland, OR'
  ];

  const productTemplates = {
    Electronics: [
      { title: 'MacBook Pro M2 14-inch', basePrice: 1800, url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
      { title: 'iPhone 14 Pro Max 256GB', basePrice: 900, url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80' },
      { title: 'Sony WH-1000XM5 Wireless Headphones', basePrice: 300, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
      { title: 'Samsung 65" 4K Smart OLED TV', basePrice: 1200, url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80' },
      { title: 'Nintendo Switch OLED Model', basePrice: 280, url: 'https://loremflickr.com/800/600/nintendo?lock=1' },
      { title: 'iPad Pro 12.9" M2 Chip', basePrice: 950, url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80' },
      { title: 'Dell XPS 15 Laptop 32GB RAM', basePrice: 1400, url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80' },
      { title: 'Bose SoundLink Revolve+ II', basePrice: 200, url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80' },
      { title: 'Canon EOS R6 Mirrorless Camera', basePrice: 2100, url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
      { title: 'PlayStation 5 Console Disc Edition', basePrice: 450, url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80' },
      { title: 'Xbox Series X 1TB', basePrice: 420, url: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80' },
      { title: 'GoPro HERO 11 Black', basePrice: 300, url: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80' }
    ],
    Vehicles: [
      { title: 'Trek Marlin 7 Mountain Bike', basePrice: 650, url: 'https://loremflickr.com/800/600/bicycle?lock=1' },
      { title: 'Honda Civic LX 2019', basePrice: 17000, url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },
      { title: 'Toyota RAV4 LE 2021', basePrice: 24000, url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80' },
      { title: 'Electric Scooter Ninebot Max', basePrice: 500, url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80' },
      { title: 'Ford F-150 XLT 2018', basePrice: 29000, url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80' },
      { title: 'Yamaha YZF-R3 Motorcycle', basePrice: 4500, url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80' },
      { title: 'Vintage Schwinn Road Bike', basePrice: 250, url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80' },
      { title: 'Vespa Primavera 150 Scooter', basePrice: 4000, url: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80' }
    ],
    Furniture: [
      { title: 'Mid-Century Leather Sectional Sofa', basePrice: 1100, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
      { title: 'Solid Oak Dining Table Set', basePrice: 750, url: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800&q=80' },
      { title: 'Herman Miller Aeron Office Chair', basePrice: 600, url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80' },
      { title: 'King Size Upholstered Bed Frame', basePrice: 400, url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80' },
      { title: 'Vintage Walnut Dresser 6-Drawer', basePrice: 350, url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80' },
      { title: 'Industrial Bookshelf 5-Tier', basePrice: 120, url: 'https://loremflickr.com/800/600/bookshelf?lock=1' },
      { title: 'Glass Top Modern Coffee Table', basePrice: 150, url: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800&q=80' },
      { title: 'Minimalist TV Stand Cabinet', basePrice: 180, url: 'https://images.unsplash.com/photo-1601760561441-16420502c7e0?w=800&q=80' },
      { title: 'Velvet Accent Armchair', basePrice: 220, url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80' }
    ],
    Fashion: [
      { title: 'The North Face Nuptse Winter Jacket', basePrice: 180, url: 'https://loremflickr.com/800/600/jacket?lock=1' },
      { title: 'Nike Air Jordan 1 Retro High', basePrice: 200, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
      { title: 'Gucci Leather Crossbody Bag', basePrice: 850, url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80' },
      { title: 'Ray-Ban Classic Aviator Sunglasses', basePrice: 110, url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80' },
      { title: 'Apple Watch Series 8 Stainless Steel', basePrice: 450, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
      { title: 'Levi\'s 501 Original Fit Jeans', basePrice: 50, url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80' },
      { title: 'Adidas Ultraboost Running Shoes', basePrice: 90, url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80' },
      { title: 'Burberry Cashmere Check Scarf', basePrice: 300, url: 'https://images.unsplash.com/photo-1605020420620-20c943cc4669?w=800&q=80' }
    ],
    Sports: [
      { title: 'Bowflex SelectTech 552 Dumbbells', basePrice: 300, url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80' },
      { title: 'Babolat Pure Drive Tennis Racket', basePrice: 150, url: 'https://loremflickr.com/800/600/tennis?lock=1' },
      { title: 'Lululemon Reversible Yoga Mat', basePrice: 50, url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
      { title: 'NordicTrack Commercial Treadmill', basePrice: 1200, url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
      { title: 'Callaway Edge Golf Club Set', basePrice: 450, url: 'https://loremflickr.com/800/600/golf?lock=1' },
      { title: 'Everlast Pro Style Boxing Gloves', basePrice: 35, url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80' },
      { title: 'Coleman 4-Person Camping Tent', basePrice: 90, url: 'https://loremflickr.com/800/600/tent?lock=1' },
      { title: 'Burton Custom Snowboard with Bindings', basePrice: 400, url: 'https://loremflickr.com/800/600/snowboard?lock=1' },
      { title: 'Spalding Portable Basketball Hoop', basePrice: 220, url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' }
    ],
    Books: [
      { title: 'The Great Gatsby - F. Scott Fitzgerald', basePrice: 10, url: 'https://loremflickr.com/800/600/book?lock=10' },
      { title: '1984 by George Orwell', basePrice: 15, url: 'https://loremflickr.com/800/600/book?lock=11' },
      { title: 'To Kill a Mockingbird', basePrice: 12, url: 'https://loremflickr.com/800/600/book?lock=12' },
      { title: 'The Hobbit by J.R.R. Tolkien', basePrice: 18, url: 'https://loremflickr.com/800/600/book?lock=13' },
      { title: 'Dune by Frank Herbert', basePrice: 20, url: 'https://loremflickr.com/800/600/book?lock=14' },
      { title: 'Pride and Prejudice', basePrice: 10, url: 'https://loremflickr.com/800/600/book?lock=15' },
      { title: 'Atomic Habits by James Clear', basePrice: 22, url: 'https://loremflickr.com/800/600/book?lock=16' },
      { title: 'The Alchemist - Paulo Coelho', basePrice: 14, url: 'https://loremflickr.com/800/600/book?lock=17' }
    ],
    Other: [
      { title: 'Collection of 50 Vintage Vinyl Records', basePrice: 200, url: 'https://loremflickr.com/800/600/vinyl?lock=1' },
      { title: 'Catan and Ticket to Ride Board Games', basePrice: 60, url: 'https://loremflickr.com/800/600/boardgame?lock=1' },
      { title: 'Yamaha FG800 Acoustic Guitar', basePrice: 180, url: 'https://loremflickr.com/800/600/guitar?lock=1' },
      { title: 'LEGO Star Wars Millennium Falcon 75192', basePrice: 700, url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { title: 'DJI Mini 3 Pro Drone with Controller', basePrice: 650, url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80' },
      { title: 'Antique Brass Telescope', basePrice: 250, url: 'https://loremflickr.com/800/600/telescope?lock=1' },
      { title: 'Sony a7III Camera Body Only', basePrice: 1400, url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' }
    ]
  };

  const adjs = ['Excellent', 'Beautiful', 'Slightly used', 'Perfect condition', 'Gently loved', 'Brand new in box', 'Great value', 'Amazing deal'];
  const descPrefixes = [
    'Selling my beloved item because I am upgrading. ',
    'Got this as a gift but never really used it. ',
    'Priced to sell! Works perfectly and looks great. ',
    'Clearing out space in the apartment. ',
    'Used carefully over the last few months. ',
    'Absolute bargain, well maintained and clean. '
  ];

  let allProducts = [];

  for (const cat of categories) {
    const templates = productTemplates[cat];
    for (const t of templates) {
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const adj = adjs[Math.floor(Math.random() * adjs.length)];
      const prefix = descPrefixes[Math.floor(Math.random() * descPrefixes.length)];
      
      const priceVariation = 0.85 + (Math.random() * 0.3);
      const price = Math.round(t.basePrice * priceVariation);

      const imageUrl = t.url;

      allProducts.push({
        title: t.title,
        description: `${prefix} ${adj} ${t.title}. Please message me if you have any questions or want to see it in person! Local pickup preferred.`,
        price: price,
        category: cat,
        condition: condition,
        location: location,
        images: [imageUrl],
        status: 'Available'
      });
    }
  }

  // Shuffle the products randomly
  return allProducts.sort(() => 0.5 - Math.random());
};

const seedDB = async () => {
  try {
    console.log('Connecting to database...', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    
    console.log('Clearing existing products and dummy users...');
    // We clear the products, and clear specifically the seeded users to avoid cluttering 
    await Product.deleteMany({});
    await mongoose.model('Message').deleteMany({});
    await User.deleteMany({ email: { $in: ['seed1@example.com', 'seed2@example.com', 'seed3@example.com'] } });

    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    const users = await User.insertMany([
      { username: 'JohnDoeUser', email: 'seed1@example.com', password, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { username: 'JaneSmithSeller', email: 'seed2@example.com', password, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { username: 'TechEnthusiast99', email: 'seed3@example.com', password, avatar: 'https://randomuser.me/api/portraits/men/85.jpg' }
    ]);

    console.log(`Created ${users.length} users.`);

    const productsData = generateProducts();
    console.log(`Generated ${productsData.length} product entries.`);

    // Assign sellers randomly
    const populatedProducts = productsData.map(p => ({
      ...p,
      seller: users[Math.floor(Math.random() * users.length)]._id
    }));

    await Product.insertMany(populatedProducts);
    console.log(`Successfully added ${populatedProducts.length} products to database.`);

    console.log('Database seeding completed successfully ✅');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
