const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const rawProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraped_products.json'), 'utf8'));

const products = rawProducts.map((p) => {
  let category = p.category;
  if (category === 'Unisex') {
    category = 'Women';
  }
  if (p.id.includes('girls') || p.id.includes('bunny') || p.name.toLowerCase().includes('kids')) {
    category = 'Kids';
  }
  if (p.id.includes('socks') || p.id.includes('shawl') || p.name.toLowerCase().includes('shawl')) {
    category = 'Accessories';
  }

  return {
    id: p.id,
    name: p.name,
    price: p.price,
    category: category,
    image: p.image,
    stock: 50,
  };
});

async function main() {
  console.log(`Seeding ${products.length} products into database...`);
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
