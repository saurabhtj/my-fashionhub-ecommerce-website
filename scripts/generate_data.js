const fs = require('fs');
const path = require('path');

const rawProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraped_products.json'), 'utf8'));

// Refine products
const products = rawProducts.map((p, index) => {
  let category = p.category;
  if (category === 'Unisex') {
    if (p.name.includes('Top') || p.name.includes('Kurta') || p.name.includes('Co-ord') || p.name.includes('Gown')) {
      category = 'Women';
    } else {
      category = 'Women';
    }
  }
  if (p.id.includes('girls') || p.id.includes('bunny') || p.name.toLowerCase().includes('kids')) {
    category = 'Kids';
  }
  if (p.id.includes('socks') || p.id.includes('shawl') || p.name.toLowerCase().includes('shawl')) {
    category = 'Accessories';
  }

  // Tags & Original Prices
  let isSale = false;
  let originalPrice = undefined;
  let tag = undefined;
  let isNew = false;

  if (p.id.includes('combo') || p.id.includes('set') || index % 4 === 1) {
    isSale = true;
    originalPrice = Math.round(p.price * 1.25);
  }
  if (p.id.includes('saree') || p.id.includes('gown') || p.id.includes('abaya') || index % 5 === 0) {
    tag = 'Best Seller';
  } else if (index % 3 === 0) {
    tag = 'Trending';
  }
  if (index < 8 || p.name.toLowerCase().includes('new')) {
    isNew = true;
  }

  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice,
    image: p.image,
    category,
    tag,
    isNew,
    isSale,
    description: p.description
  };
});

// Category splits
const featuredProducts = products.filter(p => p.tag === 'Best Seller').slice(0, 8);
const newArrivals = products.filter(p => p.isNew).slice(0, 8);
const trendingProducts = products.filter(p => p.tag === 'Trending').slice(0, 8);
const mensCollection = products.filter(p => p.category === 'Men');
const womensCollection = products.filter(p => p.category === 'Women');
const kidsProducts = products.filter(p => p.category === 'Kids');
const saleProducts = products.filter(p => p.isSale);
const allProducts = products;

const reviews = [
  {
    id: "r1",
    name: "Ananya Nair",
    rating: 5,
    text: "The traditional Kanjivaram silk saree exceeded all my expectations! Exquisite craftsmanship, authentic Kerala temple borders, and lightning-fast delivery. Oruma Fashion Hub is my absolute favorite store for wedding wear.",
    date: "2 weeks ago",
    avatar: "https://picsum.photos/id/64/100/100",
  },
  {
    id: "r2",
    name: "Rahul Menon",
    rating: 5,
    text: "Got the cool Khakis denim combo and formal shirts. The fabric feel and tailoring are top-notch. Truly modern menswear with great durability.",
    date: "1 month ago",
    avatar: "https://picsum.photos/id/65/100/100",
  },
  {
    id: "r3",
    name: "Fatima Zahra",
    rating: 5,
    text: "The plum textured abaya set and Chikankari co-ord set are breathtaking! High quality modest wear with elegant finishing.",
    date: "3 weeks ago",
    avatar: "https://picsum.photos/id/91/100/100",
  },
  {
    id: "r4",
    name: "Siddharth V.",
    rating: 5,
    text: "Three floors of genuine quality now accessible online. The kidswear collection for our daughter was adorable and super soft.",
    date: "Just now",
    avatar: "https://picsum.photos/id/1025/100/100",
  }
];

const tsFileContent = `// Product data copied from Oruma Fashion Hub (https://orumaweddings.com/)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tag?: string;
  isNew?: boolean;
  isSale?: boolean;
  description?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export const featuredProducts: Product[] = ${JSON.stringify(featuredProducts, null, 2)};

export const newArrivals: Product[] = ${JSON.stringify(newArrivals, null, 2)};

export const trendingProducts: Product[] = ${JSON.stringify(trendingProducts, null, 2)};

export const mensCollection: Product[] = ${JSON.stringify(mensCollection, null, 2)};

export const womensCollection: Product[] = ${JSON.stringify(womensCollection, null, 2)};

export const kidsProducts: Product[] = ${JSON.stringify(kidsProducts, null, 2)};

export const saleProducts: Product[] = ${JSON.stringify(saleProducts, null, 2)};

export const allProducts: Product[] = ${JSON.stringify(allProducts, null, 2)};

export const reviews: Review[] = ${JSON.stringify(reviews, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/data.ts'), tsFileContent);
console.log('src/lib/data.ts generated successfully with ' + allProducts.length + ' products.');
