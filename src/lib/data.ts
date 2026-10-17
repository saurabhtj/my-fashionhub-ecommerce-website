// Product data copied from Oruma Fashion Hub (https://orumaweddings.com/)
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
  stock?: number;
  isArchived?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export const featuredProducts: Product[] = [
  {
    "id": "mens-denim-shirts-combo",
    "name": "Mens-Brand cool Khakis Quality Denim Double size",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F039a825c-e11b-4567-a2e4-5f8b93cb5f7b.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this trendy set of 3 men's denim shirts in light blue, navy, and charcoal colors. Each shirt features durable stitching, full sleeves, and classic collars, perfect for casual or semi-formal occasions. Enjoy style, comfort, and versatility in every piece!"
  },
  {
    "id": "floral-print-summer-dress",
    "name": "Aliya Cut Blossom Print Short Kurti",
    "price": 450,
    "originalPrice": 563,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e4c1482f-4d8c-48a3-9c72-5d0eb6c97919.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Step out in style with this charming white summer dress featuring delicate green and pink floral prints. Designed with flowy short sleeves and a comfortable, breathable fabric, it's perfect for casual outings or brunch dates. The flattering waistline and gentle pleats add a touch of femininity. P..."
  },
  {
    "id": "embroidered-shimmer-gown-",
    "name": "Embroidered Shimmer Gown",
    "price": 1545,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/1c7fc29d-a2f0-4849-be8e-c44bc566b046.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Embroidered Shimmer Gown"
  },
  {
    "id": "check-frock-gown",
    "name": "Check Long Gown",
    "price": 1160,
    "originalPrice": 1450,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/b0b07207-be89-431c-ac41-8080868f72f2.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "kanchi-cotton-silk-saree",
    "name": "Kanchi Cotton Silk Saree",
    "price": 595,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/0b85f998-a979-4031-ac3a-2489474054a7.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Kanchi Cotton Silk Saree with Maroon Border"
  },
  {
    "id": "traditional-kanjivaram-silk-saree",
    "name": "Traditional Kanjivaram Silk Saree",
    "price": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/a131a91d-50ea-485e-a36c-4bc1529e1bbe.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Perfect for weddings, festivals, and formal gatherings. Made from premium quality silk, it combines cultural heritage with timeless elegance, ensuring you stand out at any celebration."
  },
  {
    "id": "ladies-gown",
    "name": "Ladies Gown",
    "price": 1080,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/4b420ca5-e53d-4b48-aa6b-60f5e7cca934.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Imported material Gown with print work"
  },
  {
    "id": "kanchi-cotton-silk-saree-with-rose-gold-saree-border",
    "name": "Kanchi cotton Silk Saree",
    "price": 750,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/441be2f2-8b62-4f81-ab45-024573619808.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Turn heads at your next special occasion with this luxurious Kanchi cotton silk saree featuring a breathtaking rose gold Saree border. The intricate woven patterns lend a timeless elegance, making it an ideal choice for weddings, festivals, and celebrations. Soft, comfortable, and easy to drape, ..."
  }
];

export const newArrivals: Product[] = [
  {
    "id": "mens-denim-shirts-combo",
    "name": "Mens-Brand cool Khakis Quality Denim Double size",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F039a825c-e11b-4567-a2e4-5f8b93cb5f7b.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this trendy set of 3 men's denim shirts in light blue, navy, and charcoal colors. Each shirt features durable stitching, full sleeves, and classic collars, perfect for casual or semi-formal occasions. Enjoy style, comfort, and versatility in every piece!"
  },
  {
    "id": "mens-printed-cotton-shirts",
    "name": "Mens-Brand cool khakis Quality check print",
    "price": 655,
    "originalPrice": 819,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fea956c5c-1871-4a24-9ad8-cfb61534cbdb.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Elevate your wardrobe with our exclusive collection of men's printed cotton shirts. Featuring a variety of vibrant patterns and colors, these shirts are crafted for comfort and style—perfect for formal events, casual outings, or festive celebrations. Made from high-quality, breathable cotton fabr..."
  },
  {
    "id": "mens-solid-formal-shirts",
    "name": "Mens-Brand cool Khakis Quality Imported material",
    "price": 880,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F2f8940ca-127f-49c2-8cc3-fe83a4c37961.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": false,
    "description": "Upgrade your wardrobe with these high-quality men's solid formal shirts, available in beige, maroon, and pink. Perfect for office wear or smart casual outings, these shirts offer a comfortable fit and sleek design with premium stitching. Made from durable, soft fabric and featuring a classic coll..."
  },
  {
    "id": "mens-cotton-casual-shirts",
    "name": "Mens-Brand cool Khakis Quality Salfer Plain",
    "price": 1020,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F75dee969-ecfb-47db-9beb-8e4b284367d3.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Discover our latest collection of men's cotton casual shirts, available in six trendy colors: navy blue, black, sky blue, grey, olive green, and mustard yellow. Perfect for both office and casual outings, these shirts are crafted from high-quality cotton, ensuring comfort, breathability, and a pe..."
  },
  {
    "id": "mens-formal-shirts-combo",
    "name": "Mens-Brand cool khakis imported satin",
    "price": 850,
    "originalPrice": 1063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fe89dc2c2-f4b3-4b73-99b3-6989aea8860e.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo of 5 premium men's formal shirts. Featuring versatile colors including white, beige, maroon, brown, and navy blue, these shirts are crafted for office wear or formal occasions. Breathable fabric ensures all-day comfort, while the modern fit offers a sharp and..."
  },
  {
    "id": "floral-print-summer-dress",
    "name": "Aliya Cut Blossom Print Short Kurti",
    "price": 450,
    "originalPrice": 563,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e4c1482f-4d8c-48a3-9c72-5d0eb6c97919.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Step out in style with this charming white summer dress featuring delicate green and pink floral prints. Designed with flowy short sleeves and a comfortable, breathable fabric, it's perfect for casual outings or brunch dates. The flattering waistline and gentle pleats add a touch of femininity. P..."
  },
  {
    "id": "mint-green-long-top",
    "name": "Imported Long Top",
    "price": 1160,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/3517238c-00da-4e8a-a8a4-61ece39e65aa.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Elegant Long Sleeve Imported Dress"
  },
  {
    "id": "embroidered-cotton-kurta",
    "name": "Embroidered Imported Long Kurta",
    "price": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/4c135447-d454-4557-b63d-fb2657ee7bea.jpg",
    "category": "Women",
    "isNew": true,
    "isSale": false,
    "description": "Embroidered Cotton Kurta"
  }
];

export const trendingProducts: Product[] = [
  {
    "id": "mens-cotton-casual-shirts",
    "name": "Mens-Brand cool Khakis Quality Salfer Plain",
    "price": 1020,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F75dee969-ecfb-47db-9beb-8e4b284367d3.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Discover our latest collection of men's cotton casual shirts, available in six trendy colors: navy blue, black, sky blue, grey, olive green, and mustard yellow. Perfect for both office and casual outings, these shirts are crafted from high-quality cotton, ensuring comfort, breathability, and a pe..."
  },
  {
    "id": "mint-green-long-top",
    "name": "Imported Long Top",
    "price": 1160,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/3517238c-00da-4e8a-a8a4-61ece39e65aa.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Elegant Long Sleeve Imported Dress"
  },
  {
    "id": "mens-floral-print-casual-shirts",
    "name": "Kids full sleeve shirt brand achus",
    "price": 300,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F48ea1358-b0f2-410c-be28-02125bb5425f.jpg",
    "category": "Kids",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your style with these men's floral print casual shirts, crafted from high-quality cotton for all-day comfort. Available in a variety of elegant floral patterns and colors, these shirts are perfect for casual outings, parties, or daily wear. The vibrant prints and classic fit make them a m..."
  },
  {
    "id": "hand-embroidered-chikankari-co-ord-set",
    "name": "Hand-Embroidered Chikankari Co-ord Set",
    "price": 1650,
    "originalPrice": 2063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/302bece0-d25f-4270-aec7-72801beb6318.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Material: RayonSize: M to 2XLColor: Green, Peach, Chikku, Ash"
  },
  {
    "id": "chikankari-with-palazzo-set",
    "name": "Chikankari with Palazzo Set",
    "price": 1370,
    "originalPrice": 1713,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e63a53d8-a519-482c-8b06-e06ebc7f51f3.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "denim-shirts-for-men",
    "name": "Mens-Denim Shirts for boys",
    "price": 370,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F4d31e738-9ff2-4e98-bdf3-6e42385bc1d1.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your wardrobe with these versatile denim shirts, perfect for both casual and semi-formal occasions. Crafted from premium quality denim, these shirts ensure durability and comfort all day long. Available in various shades of blue, each shirt offers a stylish fit and easy pairing with jeans..."
  },
  {
    "id": "moja-cotton-socks-combo-pack",
    "name": "Ladies-Moja organza shimmer shawl",
    "price": 295,
    "originalPrice": 369,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd4ace685-b2f9-4494-bf26-32c3ce64da13.jpg",
    "category": "Accessories",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your sock drawer with this Moja Cotton Socks Combo Pack featuring a wide range of vibrant colors. These premium quality cotton socks are soft, breathable and provide excellent comfort for everyday use. Perfect for all ages, this value pack keeps feet fresh, dry, and stylish. Ideal for gif..."
  },
  {
    "id": "trendy-wide-leg-jeans-collection",
    "name": "Mens Brand Alfred",
    "price": 690,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6964d45d-3d8c-4b3c-bad1-ef1304a8d206.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with our trendy wide-leg jeans collection, featuring a range of washes from classic blue to modern grey. Designed for maximum comfort and a chic look, these jeans are perfect for both casual and semi-formal occasions. Made from high-quality durable denim, they ensure long-la..."
  }
];

export const mensCollection: Product[] = [
  {
    "id": "mens-denim-shirts-combo",
    "name": "Mens-Brand cool Khakis Quality Denim Double size",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F039a825c-e11b-4567-a2e4-5f8b93cb5f7b.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this trendy set of 3 men's denim shirts in light blue, navy, and charcoal colors. Each shirt features durable stitching, full sleeves, and classic collars, perfect for casual or semi-formal occasions. Enjoy style, comfort, and versatility in every piece!"
  },
  {
    "id": "mens-printed-cotton-shirts",
    "name": "Mens-Brand cool khakis Quality check print",
    "price": 655,
    "originalPrice": 819,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fea956c5c-1871-4a24-9ad8-cfb61534cbdb.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Elevate your wardrobe with our exclusive collection of men's printed cotton shirts. Featuring a variety of vibrant patterns and colors, these shirts are crafted for comfort and style—perfect for formal events, casual outings, or festive celebrations. Made from high-quality, breathable cotton fabr..."
  },
  {
    "id": "mens-solid-formal-shirts",
    "name": "Mens-Brand cool Khakis Quality Imported material",
    "price": 880,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F2f8940ca-127f-49c2-8cc3-fe83a4c37961.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": false,
    "description": "Upgrade your wardrobe with these high-quality men's solid formal shirts, available in beige, maroon, and pink. Perfect for office wear or smart casual outings, these shirts offer a comfortable fit and sleek design with premium stitching. Made from durable, soft fabric and featuring a classic coll..."
  },
  {
    "id": "mens-cotton-casual-shirts",
    "name": "Mens-Brand cool Khakis Quality Salfer Plain",
    "price": 1020,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F75dee969-ecfb-47db-9beb-8e4b284367d3.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Discover our latest collection of men's cotton casual shirts, available in six trendy colors: navy blue, black, sky blue, grey, olive green, and mustard yellow. Perfect for both office and casual outings, these shirts are crafted from high-quality cotton, ensuring comfort, breathability, and a pe..."
  },
  {
    "id": "mens-formal-shirts-combo",
    "name": "Mens-Brand cool khakis imported satin",
    "price": 850,
    "originalPrice": 1063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fe89dc2c2-f4b3-4b73-99b3-6989aea8860e.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo of 5 premium men's formal shirts. Featuring versatile colors including white, beige, maroon, brown, and navy blue, these shirts are crafted for office wear or formal occasions. Breathable fabric ensures all-day comfort, while the modern fit offers a sharp and..."
  },
  {
    "id": "cat-branded-collar-t-shirts-for-men",
    "name": "Brand RIDEOFF",
    "price": 475,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd5d723dd-7c82-4ac0-a5cf-79d7b719d1e6.jpg",
    "category": "Men",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your casual wardrobe with these stylish CAT branded collar T-shirts, available in classic black, rich brown, and beige. Featuring a contemporary zipper on the collar, bold CAT logo, and soft cotton-rich fabric for all-day comfort. Perfect for everyday wear or smart-casual outings. Each pa..."
  },
  {
    "id": "denim-shirts-for-men",
    "name": "Mens-Denim Shirts for boys",
    "price": 370,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F4d31e738-9ff2-4e98-bdf3-6e42385bc1d1.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your wardrobe with these versatile denim shirts, perfect for both casual and semi-formal occasions. Crafted from premium quality denim, these shirts ensure durability and comfort all day long. Available in various shades of blue, each shirt offers a stylish fit and easy pairing with jeans..."
  },
  {
    "id": "trendy-wide-leg-jeans-collection",
    "name": "Mens Brand Alfred",
    "price": 690,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6964d45d-3d8c-4b3c-bad1-ef1304a8d206.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with our trendy wide-leg jeans collection, featuring a range of washes from classic blue to modern grey. Designed for maximum comfort and a chic look, these jeans are perfect for both casual and semi-formal occasions. Made from high-quality durable denim, they ensure long-la..."
  },
  {
    "id": "mens-striped-formal-shirts",
    "name": "Mens-Brand cool khakis quality dobby stripes",
    "price": 860,
    "originalPrice": 1075,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Ff2f30d86-f05b-4181-b9b3-bb729e8578a5.jpg",
    "category": "Men",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your wardrobe with these elegant men's striped formal shirts crafted from a high-quality cotton blend for maximum comfort and durability. Ideal for office wear or special occasions, each shirt features a stylish striped design and a perfect tailored fit. Available in various colors to sui..."
  },
  {
    "id": "mens-checked-cotton-shirts-combo",
    "name": "Mens-Brand cool khakis Linen checked",
    "price": 950,
    "originalPrice": 1188,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Ffb8b26b2-186d-48a0-81cb-705be7591515.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo pack of six premium cotton shirts for men, featuring timeless checked patterns in a variety of classic colors. Perfect for both formal and casual occasions, these shirts offer comfort, durability, and a modern fit. Easy to mix and match, they are ideal for of..."
  }
];

export const womensCollection: Product[] = [
  {
    "id": "floral-print-summer-dress",
    "name": "Aliya Cut Blossom Print Short Kurti",
    "price": 450,
    "originalPrice": 563,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e4c1482f-4d8c-48a3-9c72-5d0eb6c97919.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Step out in style with this charming white summer dress featuring delicate green and pink floral prints. Designed with flowy short sleeves and a comfortable, breathable fabric, it's perfect for casual outings or brunch dates. The flattering waistline and gentle pleats add a touch of femininity. P..."
  },
  {
    "id": "mint-green-long-top",
    "name": "Imported Long Top",
    "price": 1160,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/3517238c-00da-4e8a-a8a4-61ece39e65aa.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Elegant Long Sleeve Imported Dress"
  },
  {
    "id": "embroidered-cotton-kurta",
    "name": "Embroidered Imported Long Kurta",
    "price": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/4c135447-d454-4557-b63d-fb2657ee7bea.jpg",
    "category": "Women",
    "isNew": true,
    "isSale": false,
    "description": "Embroidered Cotton Kurta"
  },
  {
    "id": "embroidered-shimmer-gown-",
    "name": "Embroidered Shimmer Gown",
    "price": 1545,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/1c7fc29d-a2f0-4849-be8e-c44bc566b046.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Embroidered Shimmer Gown"
  },
  {
    "id": "check-frock-gown",
    "name": "Check Long Gown",
    "price": 1160,
    "originalPrice": 1450,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/b0b07207-be89-431c-ac41-8080868f72f2.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "kanchi-cotton-silk-saree",
    "name": "Kanchi Cotton Silk Saree",
    "price": 595,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/0b85f998-a979-4031-ac3a-2489474054a7.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Kanchi Cotton Silk Saree with Maroon Border"
  },
  {
    "id": "traditional-kanjivaram-silk-saree",
    "name": "Traditional Kanjivaram Silk Saree",
    "price": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/a131a91d-50ea-485e-a36c-4bc1529e1bbe.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Perfect for weddings, festivals, and formal gatherings. Made from premium quality silk, it combines cultural heritage with timeless elegance, ensuring you stand out at any celebration."
  },
  {
    "id": "sleeveless-floral-dress",
    "name": "Sleeveless Floral Dress",
    "price": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/3e175806-74f2-4b7a-aae2-cfb0899e7ad4.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": "Elegant Sleeveless Floral Dress"
  },
  {
    "id": "ladies-gown",
    "name": "Ladies Gown",
    "price": 1080,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/4b420ca5-e53d-4b48-aa6b-60f5e7cca934.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Imported material Gown with print work"
  },
  {
    "id": "muslin-cotton-co-ord-set",
    "name": "Muslin Cotton Co-ord Set",
    "price": 910,
    "originalPrice": 1138,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/91770828-50a1-4ae6-babf-6e7f3b100181.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Muslin Cotton Co-ord Set printed top & Plain Pant"
  },
  {
    "id": "floral-skirt-and-top-",
    "name": "Floral Skirt & Top",
    "price": 1750,
    "originalPrice": 2188,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/0a15bc11-43d7-40a7-825c-0c507cc730ab.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "floral embroidery and a matching skirt. Perfect for casual gatherings or festive occasions, it offers comfort with a touch of grace and sophistication. The lightweight fabric and earthy tones make it versatile for all-day wear."
  },
  {
    "id": "hand-embroidered-chikankari-co-ord-set",
    "name": "Hand-Embroidered Chikankari Co-ord Set",
    "price": 1650,
    "originalPrice": 2063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/302bece0-d25f-4270-aec7-72801beb6318.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Material: RayonSize: M to 2XLColor: Green, Peach, Chikku, Ash"
  },
  {
    "id": "western-top",
    "name": "Western Top",
    "price": 925,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/2fe7d981-5a7e-480c-9648-be3f0ab094a9.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": ""
  },
  {
    "id": "kanchi-cotton-silk-saree-with-rose-gold-saree-border",
    "name": "Kanchi cotton Silk Saree",
    "price": 750,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/441be2f2-8b62-4f81-ab45-024573619808.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Turn heads at your next special occasion with this luxurious Kanchi cotton silk saree featuring a breathtaking rose gold Saree border. The intricate woven patterns lend a timeless elegance, making it an ideal choice for weddings, festivals, and celebrations. Soft, comfortable, and easy to drape, ..."
  },
  {
    "id": "chikankari-with-palazzo-set",
    "name": "Chikankari with Palazzo Set",
    "price": 1370,
    "originalPrice": 1713,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e63a53d8-a519-482c-8b06-e06ebc7f51f3.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "silk-saree-with-silver-border",
    "name": "Silk Saree with Silver Border",
    "price": 1260,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/7ea7d3a0-446d-48dd-aa9f-33527b5b6054.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": ""
  },
  {
    "id": "floral-sleeveless-maxi-dress",
    "name": "Floral Sleeveless Maxi Dress",
    "price": 765,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/57875177-fa2b-41b6-a6cf-aba1444028d1.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": ""
  },
  {
    "id": "elegant-plum-textured-abaya-set",
    "name": "Elegant Plum Textured Abaya Set",
    "price": 1920,
    "originalPrice": 2400,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/bc40b5e7-df47-480a-a704-8e55a9ffffa4.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "embroidered-3-piece-kurta-pant-set",
    "name": "Embroidered 3-Piece Kurta Pant Set",
    "price": 1875,
    "originalPrice": 2344,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/315e2cd4-8c80-4977-aa39-20bd1f0e9d94.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "cotton-printed-kurtis-combo-set-of-9",
    "name": "Ladies-Top Kurtis",
    "price": 495,
    "originalPrice": 619,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F9cb757f3-b6ab-4597-9512-171d613947a9.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Brighten your wardrobe with this exclusive set of 9 cotton printed kurtis. Each kurti showcases unique prints, embroidery, and a variety of colors, making them perfect for daily wear, office, or casual outings. Comfortable cotton fabric ensures all-day comfort, and the diverse designs allow you t..."
  },
  {
    "id": "assorted-mens-jeans-collection",
    "name": "Ladies jeans,pant",
    "price": 735,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fbc2715e7-92c0-48aa-acda-a8b1b0756a79.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with this assorted collection of men's jeans featuring a variety of trendy colors and washes. Perfect for both casual and semi-formal looks, these jeans provide comfort, durability, and style. Each pair is made with high-quality denim and comes with original tags. Ideal for ..."
  },
  {
    "id": "ladies-innerwear-collection",
    "name": "Ladies' Innerwear Collection",
    "price": 299,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fcd02f280-2faf-4262-a4a7-9ae5a73b96cf.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": "Discover our extensive collection of ladies' innerwear, expertly curated to provide both comfort and style. From premium cotton briefs to elegant lace options, our assortment features trusted brands and a range of sizes. Perfect for daily wear, these innerwear essentials are made from high-qualit..."
  },
  {
    "id": "elegant-embroidered-kurtis-set",
    "name": "Ladies-Pakistani Churidar material",
    "price": 2280,
    "originalPrice": 2850,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fc63c571c-6991-433b-9bd9-a5df26df2e57.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Experience elegance and comfort with our collection of embroidered Kurtis sets, available in soft pastel shades. Each set includes beautifully crafted kurtis with intricate embroidery and matching dupattas, perfect for festive occasions or special gatherings. Soft fabric ensures comfort for all-d..."
  },
  {
    "id": "blue-cotton-kurti",
    "name": "Ladies Brand Diya",
    "price": 765,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd4c9bb15-7f6b-4683-a6a7-13b81b4be66a.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with this elegant blue cotton kurti, designed for both comfort and style. Featuring a classic V-neck, three-quarter sleeves, and delicate golden lace detailing, this kurti is perfect for daily wear or casual outings. The soft cotton fabric ensures breathability and all-day c..."
  },
  {
    "id": "designer-embroidered-kurtis-set",
    "name": "Ladies-K Kumar churidar",
    "price": 1500,
    "originalPrice": 1875,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F321f2a9e-67f4-48f5-ba8a-5ad1b00eda2f.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your ethnic wardrobe with this stunning set of 9 designer embroidered kurtis. Featuring a vibrant mix of colors and intricate embroidery, each kurti is crafted for optimal comfort and style. Perfect for festive occasions, parties, or casual outings, these kurtis offer versatility and eleg..."
  },
  {
    "id": "traditional-kerala-kasavu-saree-collection",
    "name": "Ladies-Mul cotton saree",
    "price": 920,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F834b8090-8b76-4a70-949c-390a82d2e23f.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Discover the charm of Kerala with this exclusive collection of traditional Kasavu sarees. Each piece is crafted from premium cotton, featuring classic off-white fabric, intricate zari work, and vibrant borders with playful tassels. Ideal for festive occasions and celebrations, these sarees add gr..."
  },
  {
    "id": "striped-cotton-pajama-sets",
    "name": "Ladies Co-ord  set",
    "price": 1870,
    "originalPrice": 2338,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6f62e7d5-96cf-47dd-a6eb-fb4127fd9db5.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Experience ultimate comfort with these soft cotton pajama sets, available in a variety of muted striped colors. Perfect for lounging or sleeping, each set comes with a matching top and pants, designed for a relaxed and cozy fit. Ideal for daily wear, these pajamas are breathable and easy to care ..."
  },
  {
    "id": "elegant-long-maxi-dresses",
    "name": "Pardha Kafthan brand Haira",
    "price": 1000,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fa0dec389-527a-4baa-be11-ef4a57a5cc9d.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": "Discover elegance and comfort with these long maxi dresses, available in stunning shades of blue, black, brown, maroon, and more. Made from soft, breathable fabrics, these dresses feature a flowing silhouette that flatters every figure. Perfect for any occasion—be it parties, formal gatherings, o..."
  }
];

export const kidsProducts: Product[] = [
  {
    "id": "mens-floral-print-casual-shirts",
    "name": "Kids full sleeve shirt brand achus",
    "price": 300,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F48ea1358-b0f2-410c-be28-02125bb5425f.jpg",
    "category": "Kids",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your style with these men's floral print casual shirts, crafted from high-quality cotton for all-day comfort. Available in a variety of elegant floral patterns and colors, these shirts are perfect for casual outings, parties, or daily wear. The vibrant prints and classic fit make them a m..."
  },
  {
    "id": "girls-denim-dress-with-jacket-set",
    "name": "Kids Ladies Brand Diya",
    "price": 660,
    "originalPrice": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F861a2b13-bec4-469f-a234-1efd8cf7463a.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": true,
    "description": "This trendy girls' set includes a fashionable denim dress paired with a matching detachable jacket. Perfect for every season, its classic look makes it ideal for both casual and party wear. Durable fabric ensures lasting comfort, while button details add a chic touch. Available in multiple sizes ..."
  },
  {
    "id": "girls-denim-dress",
    "name": "Ladies-Brand Diya",
    "price": 660,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F1eb98f91-79ce-43ec-b36c-9a9ea7a7a249.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your child's style with this fashionable denim shirt dress, perfect for everyday wear or special outings. Featuring a classic collar, button-down front, and an easy-fit waist, this dress offers both comfort and style. The quality denim fabric ensures durability, while the playful design m..."
  },
  {
    "id": "girls-floral-cotton-dress",
    "name": "Kids Brand Pink One",
    "price": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F910e16b3-1c5b-46b2-8d66-dc8e96bbbe4f.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": false,
    "description": "This adorable girls' dress features a floral print on comfortable, lightweight cotton, perfect for warm weather. Available in vibrant pink and cool blue, each dress comes with a buttoned front, adjustable waist tie, and playful ruffle hem. Ideal for everyday outings or special occasions, it keeps..."
  },
  {
    "id": "yellow-cotton-kurti-set",
    "name": "Kids Brand Diya",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6082abc2-aeec-4b04-9f66-24b60709fcde.jpg",
    "category": "Kids",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Enhance your ethnic wardrobe with this beautiful yellow cotton kurti set, perfect for festive occasions or everyday style. The set features a flattering, flowy kurti with intricate lace detailing and comfortable sleeves. Available in multiple sizes with complimentary matching pants. Soft, breatha..."
  },
  {
    "id": "pink-floral-bunny-dress-for-girls",
    "name": "Kids-Brand rich baby",
    "price": 610,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F4f9bb5b7-efbb-445a-8148-580efeace205.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": false,
    "description": "This charming pink floral dress features playful ruffle sleeves and a cute bunny applique, perfect for little girls on special occasions and parties. The soft fabric and vibrant colors ensure comfort and style, making it an ideal choice for birthdays or festive events."
  }
];

export const saleProducts: Product[] = [
  {
    "id": "mens-denim-shirts-combo",
    "name": "Mens-Brand cool Khakis Quality Denim Double size",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F039a825c-e11b-4567-a2e4-5f8b93cb5f7b.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this trendy set of 3 men's denim shirts in light blue, navy, and charcoal colors. Each shirt features durable stitching, full sleeves, and classic collars, perfect for casual or semi-formal occasions. Enjoy style, comfort, and versatility in every piece!"
  },
  {
    "id": "mens-printed-cotton-shirts",
    "name": "Mens-Brand cool khakis Quality check print",
    "price": 655,
    "originalPrice": 819,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fea956c5c-1871-4a24-9ad8-cfb61534cbdb.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Elevate your wardrobe with our exclusive collection of men's printed cotton shirts. Featuring a variety of vibrant patterns and colors, these shirts are crafted for comfort and style—perfect for formal events, casual outings, or festive celebrations. Made from high-quality, breathable cotton fabr..."
  },
  {
    "id": "mens-formal-shirts-combo",
    "name": "Mens-Brand cool khakis imported satin",
    "price": 850,
    "originalPrice": 1063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fe89dc2c2-f4b3-4b73-99b3-6989aea8860e.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo of 5 premium men's formal shirts. Featuring versatile colors including white, beige, maroon, brown, and navy blue, these shirts are crafted for office wear or formal occasions. Breathable fabric ensures all-day comfort, while the modern fit offers a sharp and..."
  },
  {
    "id": "floral-print-summer-dress",
    "name": "Aliya Cut Blossom Print Short Kurti",
    "price": 450,
    "originalPrice": 563,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e4c1482f-4d8c-48a3-9c72-5d0eb6c97919.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Step out in style with this charming white summer dress featuring delicate green and pink floral prints. Designed with flowy short sleeves and a comfortable, breathable fabric, it's perfect for casual outings or brunch dates. The flattering waistline and gentle pleats add a touch of femininity. P..."
  },
  {
    "id": "check-frock-gown",
    "name": "Check Long Gown",
    "price": 1160,
    "originalPrice": 1450,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/b0b07207-be89-431c-ac41-8080868f72f2.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "girls-denim-dress-with-jacket-set",
    "name": "Kids Ladies Brand Diya",
    "price": 660,
    "originalPrice": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F861a2b13-bec4-469f-a234-1efd8cf7463a.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": true,
    "description": "This trendy girls' set includes a fashionable denim dress paired with a matching detachable jacket. Perfect for every season, its classic look makes it ideal for both casual and party wear. Durable fabric ensures lasting comfort, while button details add a chic touch. Available in multiple sizes ..."
  },
  {
    "id": "muslin-cotton-co-ord-set",
    "name": "Muslin Cotton Co-ord Set",
    "price": 910,
    "originalPrice": 1138,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/91770828-50a1-4ae6-babf-6e7f3b100181.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Muslin Cotton Co-ord Set printed top & Plain Pant"
  },
  {
    "id": "floral-skirt-and-top-",
    "name": "Floral Skirt & Top",
    "price": 1750,
    "originalPrice": 2188,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/0a15bc11-43d7-40a7-825c-0c507cc730ab.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "floral embroidery and a matching skirt. Perfect for casual gatherings or festive occasions, it offers comfort with a touch of grace and sophistication. The lightweight fabric and earthy tones make it versatile for all-day wear."
  },
  {
    "id": "hand-embroidered-chikankari-co-ord-set",
    "name": "Hand-Embroidered Chikankari Co-ord Set",
    "price": 1650,
    "originalPrice": 2063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/302bece0-d25f-4270-aec7-72801beb6318.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Material: RayonSize: M to 2XLColor: Green, Peach, Chikku, Ash"
  },
  {
    "id": "chikankari-with-palazzo-set",
    "name": "Chikankari with Palazzo Set",
    "price": 1370,
    "originalPrice": 1713,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e63a53d8-a519-482c-8b06-e06ebc7f51f3.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "elegant-plum-textured-abaya-set",
    "name": "Elegant Plum Textured Abaya Set",
    "price": 1920,
    "originalPrice": 2400,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/bc40b5e7-df47-480a-a704-8e55a9ffffa4.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "embroidered-3-piece-kurta-pant-set",
    "name": "Embroidered 3-Piece Kurta Pant Set",
    "price": 1875,
    "originalPrice": 2344,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/315e2cd4-8c80-4977-aa39-20bd1f0e9d94.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "cotton-printed-kurtis-combo-set-of-9",
    "name": "Ladies-Top Kurtis",
    "price": 495,
    "originalPrice": 619,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F9cb757f3-b6ab-4597-9512-171d613947a9.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Brighten your wardrobe with this exclusive set of 9 cotton printed kurtis. Each kurti showcases unique prints, embroidery, and a variety of colors, making them perfect for daily wear, office, or casual outings. Comfortable cotton fabric ensures all-day comfort, and the diverse designs allow you t..."
  },
  {
    "id": "elegant-embroidered-kurtis-set",
    "name": "Ladies-Pakistani Churidar material",
    "price": 2280,
    "originalPrice": 2850,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fc63c571c-6991-433b-9bd9-a5df26df2e57.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Experience elegance and comfort with our collection of embroidered Kurtis sets, available in soft pastel shades. Each set includes beautifully crafted kurtis with intricate embroidery and matching dupattas, perfect for festive occasions or special gatherings. Soft fabric ensures comfort for all-d..."
  },
  {
    "id": "moja-cotton-socks-combo-pack",
    "name": "Ladies-Moja organza shimmer shawl",
    "price": 295,
    "originalPrice": 369,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd4ace685-b2f9-4494-bf26-32c3ce64da13.jpg",
    "category": "Accessories",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your sock drawer with this Moja Cotton Socks Combo Pack featuring a wide range of vibrant colors. These premium quality cotton socks are soft, breathable and provide excellent comfort for everyday use. Perfect for all ages, this value pack keeps feet fresh, dry, and stylish. Ideal for gif..."
  },
  {
    "id": "yellow-cotton-kurti-set",
    "name": "Kids Brand Diya",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6082abc2-aeec-4b04-9f66-24b60709fcde.jpg",
    "category": "Kids",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Enhance your ethnic wardrobe with this beautiful yellow cotton kurti set, perfect for festive occasions or everyday style. The set features a flattering, flowy kurti with intricate lace detailing and comfortable sleeves. Available in multiple sizes with complimentary matching pants. Soft, breatha..."
  },
  {
    "id": "mens-striped-formal-shirts",
    "name": "Mens-Brand cool khakis quality dobby stripes",
    "price": 860,
    "originalPrice": 1075,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Ff2f30d86-f05b-4181-b9b3-bb729e8578a5.jpg",
    "category": "Men",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your wardrobe with these elegant men's striped formal shirts crafted from a high-quality cotton blend for maximum comfort and durability. Ideal for office wear or special occasions, each shirt features a stylish striped design and a perfect tailored fit. Available in various colors to sui..."
  },
  {
    "id": "premium-cotton-hijab-scarves-set-of-20",
    "name": "Ladies-Moja Maftha shawl",
    "price": 255,
    "originalPrice": 319,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F2242af5e-08ae-4d41-a6fa-57b88d8aabd8.jpg",
    "category": "Accessories",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Add a splash of color to your wardrobe with this set of 20 premium cotton hijab scarves. Each scarf comes in a unique, vibrant shade, perfect for any occasion and outfit. Made from soft, breathable cotton for all-day comfort and style. Ideal for gifting or personal use."
  },
  {
    "id": "designer-embroidered-kurtis-set",
    "name": "Ladies-K Kumar churidar",
    "price": 1500,
    "originalPrice": 1875,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F321f2a9e-67f4-48f5-ba8a-5ad1b00eda2f.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your ethnic wardrobe with this stunning set of 9 designer embroidered kurtis. Featuring a vibrant mix of colors and intricate embroidery, each kurti is crafted for optimal comfort and style. Perfect for festive occasions, parties, or casual outings, these kurtis offer versatility and eleg..."
  },
  {
    "id": "striped-cotton-pajama-sets",
    "name": "Ladies Co-ord  set",
    "price": 1870,
    "originalPrice": 2338,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6f62e7d5-96cf-47dd-a6eb-fb4127fd9db5.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Experience ultimate comfort with these soft cotton pajama sets, available in a variety of muted striped colors. Perfect for lounging or sleeping, each set comes with a matching top and pants, designed for a relaxed and cozy fit. Ideal for daily wear, these pajamas are breathable and easy to care ..."
  },
  {
    "id": "mens-checked-cotton-shirts-combo",
    "name": "Mens-Brand cool khakis Linen checked",
    "price": 950,
    "originalPrice": 1188,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Ffb8b26b2-186d-48a0-81cb-705be7591515.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo pack of six premium cotton shirts for men, featuring timeless checked patterns in a variety of classic colors. Perfect for both formal and casual occasions, these shirts offer comfort, durability, and a modern fit. Easy to mix and match, they are ideal for of..."
  }
];

export const allProducts: Product[] = [
  {
    "id": "mens-denim-shirts-combo",
    "name": "Mens-Brand cool Khakis Quality Denim Double size",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F039a825c-e11b-4567-a2e4-5f8b93cb5f7b.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this trendy set of 3 men's denim shirts in light blue, navy, and charcoal colors. Each shirt features durable stitching, full sleeves, and classic collars, perfect for casual or semi-formal occasions. Enjoy style, comfort, and versatility in every piece!"
  },
  {
    "id": "mens-printed-cotton-shirts",
    "name": "Mens-Brand cool khakis Quality check print",
    "price": 655,
    "originalPrice": 819,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fea956c5c-1871-4a24-9ad8-cfb61534cbdb.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Elevate your wardrobe with our exclusive collection of men's printed cotton shirts. Featuring a variety of vibrant patterns and colors, these shirts are crafted for comfort and style—perfect for formal events, casual outings, or festive celebrations. Made from high-quality, breathable cotton fabr..."
  },
  {
    "id": "mens-solid-formal-shirts",
    "name": "Mens-Brand cool Khakis Quality Imported material",
    "price": 880,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F2f8940ca-127f-49c2-8cc3-fe83a4c37961.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": false,
    "description": "Upgrade your wardrobe with these high-quality men's solid formal shirts, available in beige, maroon, and pink. Perfect for office wear or smart casual outings, these shirts offer a comfortable fit and sleek design with premium stitching. Made from durable, soft fabric and featuring a classic coll..."
  },
  {
    "id": "mens-cotton-casual-shirts",
    "name": "Mens-Brand cool Khakis Quality Salfer Plain",
    "price": 1020,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F75dee969-ecfb-47db-9beb-8e4b284367d3.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Discover our latest collection of men's cotton casual shirts, available in six trendy colors: navy blue, black, sky blue, grey, olive green, and mustard yellow. Perfect for both office and casual outings, these shirts are crafted from high-quality cotton, ensuring comfort, breathability, and a pe..."
  },
  {
    "id": "mens-formal-shirts-combo",
    "name": "Mens-Brand cool khakis imported satin",
    "price": 850,
    "originalPrice": 1063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fe89dc2c2-f4b3-4b73-99b3-6989aea8860e.jpg",
    "category": "Men",
    "isNew": true,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo of 5 premium men's formal shirts. Featuring versatile colors including white, beige, maroon, brown, and navy blue, these shirts are crafted for office wear or formal occasions. Breathable fabric ensures all-day comfort, while the modern fit offers a sharp and..."
  },
  {
    "id": "floral-print-summer-dress",
    "name": "Aliya Cut Blossom Print Short Kurti",
    "price": 450,
    "originalPrice": 563,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e4c1482f-4d8c-48a3-9c72-5d0eb6c97919.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": true,
    "isSale": true,
    "description": "Step out in style with this charming white summer dress featuring delicate green and pink floral prints. Designed with flowy short sleeves and a comfortable, breathable fabric, it's perfect for casual outings or brunch dates. The flattering waistline and gentle pleats add a touch of femininity. P..."
  },
  {
    "id": "mint-green-long-top",
    "name": "Imported Long Top",
    "price": 1160,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/3517238c-00da-4e8a-a8a4-61ece39e65aa.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": true,
    "isSale": false,
    "description": "Elegant Long Sleeve Imported Dress"
  },
  {
    "id": "embroidered-cotton-kurta",
    "name": "Embroidered Imported Long Kurta",
    "price": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/4c135447-d454-4557-b63d-fb2657ee7bea.jpg",
    "category": "Women",
    "isNew": true,
    "isSale": false,
    "description": "Embroidered Cotton Kurta"
  },
  {
    "id": "embroidered-shimmer-gown-",
    "name": "Embroidered Shimmer Gown",
    "price": 1545,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/1c7fc29d-a2f0-4849-be8e-c44bc566b046.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Embroidered Shimmer Gown"
  },
  {
    "id": "check-frock-gown",
    "name": "Check Long Gown",
    "price": 1160,
    "originalPrice": 1450,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/b0b07207-be89-431c-ac41-8080868f72f2.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "kanchi-cotton-silk-saree",
    "name": "Kanchi Cotton Silk Saree",
    "price": 595,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/0b85f998-a979-4031-ac3a-2489474054a7.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Kanchi Cotton Silk Saree with Maroon Border"
  },
  {
    "id": "traditional-kanjivaram-silk-saree",
    "name": "Traditional Kanjivaram Silk Saree",
    "price": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/a131a91d-50ea-485e-a36c-4bc1529e1bbe.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Perfect for weddings, festivals, and formal gatherings. Made from premium quality silk, it combines cultural heritage with timeless elegance, ensuring you stand out at any celebration."
  },
  {
    "id": "mens-floral-print-casual-shirts",
    "name": "Kids full sleeve shirt brand achus",
    "price": 300,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F48ea1358-b0f2-410c-be28-02125bb5425f.jpg",
    "category": "Kids",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your style with these men's floral print casual shirts, crafted from high-quality cotton for all-day comfort. Available in a variety of elegant floral patterns and colors, these shirts are perfect for casual outings, parties, or daily wear. The vibrant prints and classic fit make them a m..."
  },
  {
    "id": "girls-denim-dress-with-jacket-set",
    "name": "Kids Ladies Brand Diya",
    "price": 660,
    "originalPrice": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F861a2b13-bec4-469f-a234-1efd8cf7463a.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": true,
    "description": "This trendy girls' set includes a fashionable denim dress paired with a matching detachable jacket. Perfect for every season, its classic look makes it ideal for both casual and party wear. Durable fabric ensures lasting comfort, while button details add a chic touch. Available in multiple sizes ..."
  },
  {
    "id": "sleeveless-floral-dress",
    "name": "Sleeveless Floral Dress",
    "price": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/3e175806-74f2-4b7a-aae2-cfb0899e7ad4.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": "Elegant Sleeveless Floral Dress"
  },
  {
    "id": "ladies-gown",
    "name": "Ladies Gown",
    "price": 1080,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/4b420ca5-e53d-4b48-aa6b-60f5e7cca934.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Imported material Gown with print work"
  },
  {
    "id": "muslin-cotton-co-ord-set",
    "name": "Muslin Cotton Co-ord Set",
    "price": 910,
    "originalPrice": 1138,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/91770828-50a1-4ae6-babf-6e7f3b100181.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Muslin Cotton Co-ord Set printed top & Plain Pant"
  },
  {
    "id": "floral-skirt-and-top-",
    "name": "Floral Skirt & Top",
    "price": 1750,
    "originalPrice": 2188,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/0a15bc11-43d7-40a7-825c-0c507cc730ab.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "floral embroidery and a matching skirt. Perfect for casual gatherings or festive occasions, it offers comfort with a touch of grace and sophistication. The lightweight fabric and earthy tones make it versatile for all-day wear."
  },
  {
    "id": "hand-embroidered-chikankari-co-ord-set",
    "name": "Hand-Embroidered Chikankari Co-ord Set",
    "price": 1650,
    "originalPrice": 2063,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/302bece0-d25f-4270-aec7-72801beb6318.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Material: RayonSize: M to 2XLColor: Green, Peach, Chikku, Ash"
  },
  {
    "id": "western-top",
    "name": "Western Top",
    "price": 925,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/2fe7d981-5a7e-480c-9648-be3f0ab094a9.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": ""
  },
  {
    "id": "kanchi-cotton-silk-saree-with-rose-gold-saree-border",
    "name": "Kanchi cotton Silk Saree",
    "price": 750,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/441be2f2-8b62-4f81-ab45-024573619808.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Turn heads at your next special occasion with this luxurious Kanchi cotton silk saree featuring a breathtaking rose gold Saree border. The intricate woven patterns lend a timeless elegance, making it an ideal choice for weddings, festivals, and celebrations. Soft, comfortable, and easy to drape, ..."
  },
  {
    "id": "chikankari-with-palazzo-set",
    "name": "Chikankari with Palazzo Set",
    "price": 1370,
    "originalPrice": 1713,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/e63a53d8-a519-482c-8b06-e06ebc7f51f3.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "silk-saree-with-silver-border",
    "name": "Silk Saree with Silver Border",
    "price": 1260,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/7ea7d3a0-446d-48dd-aa9f-33527b5b6054.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": ""
  },
  {
    "id": "floral-sleeveless-maxi-dress",
    "name": "Floral Sleeveless Maxi Dress",
    "price": 765,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/57875177-fa2b-41b6-a6cf-aba1444028d1.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": ""
  },
  {
    "id": "elegant-plum-textured-abaya-set",
    "name": "Elegant Plum Textured Abaya Set",
    "price": 1920,
    "originalPrice": 2400,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/bc40b5e7-df47-480a-a704-8e55a9ffffa4.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "embroidered-3-piece-kurta-pant-set",
    "name": "Embroidered 3-Piece Kurta Pant Set",
    "price": 1875,
    "originalPrice": 2344,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4/assets/315e2cd4-8c80-4977-aa39-20bd1f0e9d94.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": ""
  },
  {
    "id": "cat-branded-collar-t-shirts-for-men",
    "name": "Brand RIDEOFF",
    "price": 475,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd5d723dd-7c82-4ac0-a5cf-79d7b719d1e6.jpg",
    "category": "Men",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your casual wardrobe with these stylish CAT branded collar T-shirts, available in classic black, rich brown, and beige. Featuring a contemporary zipper on the collar, bold CAT logo, and soft cotton-rich fabric for all-day comfort. Perfect for everyday wear or smart-casual outings. Each pa..."
  },
  {
    "id": "denim-shirts-for-men",
    "name": "Mens-Denim Shirts for boys",
    "price": 370,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F4d31e738-9ff2-4e98-bdf3-6e42385bc1d1.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your wardrobe with these versatile denim shirts, perfect for both casual and semi-formal occasions. Crafted from premium quality denim, these shirts ensure durability and comfort all day long. Available in various shades of blue, each shirt offers a stylish fit and easy pairing with jeans..."
  },
  {
    "id": "girls-denim-dress",
    "name": "Ladies-Brand Diya",
    "price": 660,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F1eb98f91-79ce-43ec-b36c-9a9ea7a7a249.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": false,
    "description": "Elevate your child's style with this fashionable denim shirt dress, perfect for everyday wear or special outings. Featuring a classic collar, button-down front, and an easy-fit waist, this dress offers both comfort and style. The quality denim fabric ensures durability, while the playful design m..."
  },
  {
    "id": "cotton-printed-kurtis-combo-set-of-9",
    "name": "Ladies-Top Kurtis",
    "price": 495,
    "originalPrice": 619,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F9cb757f3-b6ab-4597-9512-171d613947a9.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Brighten your wardrobe with this exclusive set of 9 cotton printed kurtis. Each kurti showcases unique prints, embroidery, and a variety of colors, making them perfect for daily wear, office, or casual outings. Comfortable cotton fabric ensures all-day comfort, and the diverse designs allow you t..."
  },
  {
    "id": "assorted-mens-jeans-collection",
    "name": "Ladies jeans,pant",
    "price": 735,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fbc2715e7-92c0-48aa-acda-a8b1b0756a79.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with this assorted collection of men's jeans featuring a variety of trendy colors and washes. Perfect for both casual and semi-formal looks, these jeans provide comfort, durability, and style. Each pair is made with high-quality denim and comes with original tags. Ideal for ..."
  },
  {
    "id": "ladies-innerwear-collection",
    "name": "Ladies' Innerwear Collection",
    "price": 299,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fcd02f280-2faf-4262-a4a7-9ae5a73b96cf.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": "Discover our extensive collection of ladies' innerwear, expertly curated to provide both comfort and style. From premium cotton briefs to elegant lace options, our assortment features trusted brands and a range of sizes. Perfect for daily wear, these innerwear essentials are made from high-qualit..."
  },
  {
    "id": "elegant-embroidered-kurtis-set",
    "name": "Ladies-Pakistani Churidar material",
    "price": 2280,
    "originalPrice": 2850,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fc63c571c-6991-433b-9bd9-a5df26df2e57.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Experience elegance and comfort with our collection of embroidered Kurtis sets, available in soft pastel shades. Each set includes beautifully crafted kurtis with intricate embroidery and matching dupattas, perfect for festive occasions or special gatherings. Soft fabric ensures comfort for all-d..."
  },
  {
    "id": "moja-cotton-socks-combo-pack",
    "name": "Ladies-Moja organza shimmer shawl",
    "price": 295,
    "originalPrice": 369,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd4ace685-b2f9-4494-bf26-32c3ce64da13.jpg",
    "category": "Accessories",
    "tag": "Trending",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your sock drawer with this Moja Cotton Socks Combo Pack featuring a wide range of vibrant colors. These premium quality cotton socks are soft, breathable and provide excellent comfort for everyday use. Perfect for all ages, this value pack keeps feet fresh, dry, and stylish. Ideal for gif..."
  },
  {
    "id": "girls-floral-cotton-dress",
    "name": "Kids Brand Pink One",
    "price": 825,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F910e16b3-1c5b-46b2-8d66-dc8e96bbbe4f.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": false,
    "description": "This adorable girls' dress features a floral print on comfortable, lightweight cotton, perfect for warm weather. Available in vibrant pink and cool blue, each dress comes with a buttoned front, adjustable waist tie, and playful ruffle hem. Ideal for everyday outings or special occasions, it keeps..."
  },
  {
    "id": "yellow-cotton-kurti-set",
    "name": "Kids Brand Diya",
    "price": 840,
    "originalPrice": 1050,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6082abc2-aeec-4b04-9f66-24b60709fcde.jpg",
    "category": "Kids",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Enhance your ethnic wardrobe with this beautiful yellow cotton kurti set, perfect for festive occasions or everyday style. The set features a flattering, flowy kurti with intricate lace detailing and comfortable sleeves. Available in multiple sizes with complimentary matching pants. Soft, breatha..."
  },
  {
    "id": "trendy-wide-leg-jeans-collection",
    "name": "Mens Brand Alfred",
    "price": 690,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6964d45d-3d8c-4b3c-bad1-ef1304a8d206.jpg",
    "category": "Men",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with our trendy wide-leg jeans collection, featuring a range of washes from classic blue to modern grey. Designed for maximum comfort and a chic look, these jeans are perfect for both casual and semi-formal occasions. Made from high-quality durable denim, they ensure long-la..."
  },
  {
    "id": "mens-striped-formal-shirts",
    "name": "Mens-Brand cool khakis quality dobby stripes",
    "price": 860,
    "originalPrice": 1075,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Ff2f30d86-f05b-4181-b9b3-bb729e8578a5.jpg",
    "category": "Men",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your wardrobe with these elegant men's striped formal shirts crafted from a high-quality cotton blend for maximum comfort and durability. Ideal for office wear or special occasions, each shirt features a stylish striped design and a perfect tailored fit. Available in various colors to sui..."
  },
  {
    "id": "pink-floral-bunny-dress-for-girls",
    "name": "Kids-Brand rich baby",
    "price": 610,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F4f9bb5b7-efbb-445a-8148-580efeace205.jpg",
    "category": "Kids",
    "isNew": false,
    "isSale": false,
    "description": "This charming pink floral dress features playful ruffle sleeves and a cute bunny applique, perfect for little girls on special occasions and parties. The soft fabric and vibrant colors ensure comfort and style, making it an ideal choice for birthdays or festive events."
  },
  {
    "id": "blue-cotton-kurti",
    "name": "Ladies Brand Diya",
    "price": 765,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fd4c9bb15-7f6b-4683-a6a7-13b81b4be66a.jpg",
    "category": "Women",
    "tag": "Trending",
    "isNew": false,
    "isSale": false,
    "description": "Upgrade your wardrobe with this elegant blue cotton kurti, designed for both comfort and style. Featuring a classic V-neck, three-quarter sleeves, and delicate golden lace detailing, this kurti is perfect for daily wear or casual outings. The soft cotton fabric ensures breathability and all-day c..."
  },
  {
    "id": "premium-cotton-hijab-scarves-set-of-20",
    "name": "Ladies-Moja Maftha shawl",
    "price": 255,
    "originalPrice": 319,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F2242af5e-08ae-4d41-a6fa-57b88d8aabd8.jpg",
    "category": "Accessories",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Add a splash of color to your wardrobe with this set of 20 premium cotton hijab scarves. Each scarf comes in a unique, vibrant shade, perfect for any occasion and outfit. Made from soft, breathable cotton for all-day comfort and style. Ideal for gifting or personal use."
  },
  {
    "id": "designer-embroidered-kurtis-set",
    "name": "Ladies-K Kumar churidar",
    "price": 1500,
    "originalPrice": 1875,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F321f2a9e-67f4-48f5-ba8a-5ad1b00eda2f.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your ethnic wardrobe with this stunning set of 9 designer embroidered kurtis. Featuring a vibrant mix of colors and intricate embroidery, each kurti is crafted for optimal comfort and style. Perfect for festive occasions, parties, or casual outings, these kurtis offer versatility and eleg..."
  },
  {
    "id": "traditional-kerala-kasavu-saree-collection",
    "name": "Ladies-Mul cotton saree",
    "price": 920,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F834b8090-8b76-4a70-949c-390a82d2e23f.jpg",
    "category": "Women",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": false,
    "description": "Discover the charm of Kerala with this exclusive collection of traditional Kasavu sarees. Each piece is crafted from premium cotton, featuring classic off-white fabric, intricate zari work, and vibrant borders with playful tassels. Ideal for festive occasions and celebrations, these sarees add gr..."
  },
  {
    "id": "striped-cotton-pajama-sets",
    "name": "Ladies Co-ord  set",
    "price": 1870,
    "originalPrice": 2338,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2F6f62e7d5-96cf-47dd-a6eb-fb4127fd9db5.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": true,
    "description": "Experience ultimate comfort with these soft cotton pajama sets, available in a variety of muted striped colors. Perfect for lounging or sleeping, each set comes with a matching top and pants, designed for a relaxed and cozy fit. Ideal for daily wear, these pajamas are breathable and easy to care ..."
  },
  {
    "id": "elegant-long-maxi-dresses",
    "name": "Pardha Kafthan brand Haira",
    "price": 1000,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Fa0dec389-527a-4baa-be11-ef4a57a5cc9d.jpg",
    "category": "Women",
    "isNew": false,
    "isSale": false,
    "description": "Discover elegance and comfort with these long maxi dresses, available in stunning shades of blue, black, brown, maroon, and more. Made from soft, breathable fabrics, these dresses feature a flowing silhouette that flatters every figure. Perfect for any occasion—be it parties, formal gatherings, o..."
  },
  {
    "id": "mens-checked-cotton-shirts-combo",
    "name": "Mens-Brand cool khakis Linen checked",
    "price": 950,
    "originalPrice": 1188,
    "image": "https://cdn.zyrosite.com/cdn-ecommerce/store_01M2WY3YH60NZ8R1GD3114FRG4%2Fassets%2Ffb8b26b2-186d-48a0-81cb-705be7591515.jpg",
    "category": "Men",
    "tag": "Best Seller",
    "isNew": false,
    "isSale": true,
    "description": "Upgrade your wardrobe with this combo pack of six premium cotton shirts for men, featuring timeless checked patterns in a variety of classic colors. Perfect for both formal and casual occasions, these shirts offer comfort, durability, and a modern fit. Easy to mix and match, they are ideal for of..."
  }
];

export const reviews: Review[] = [
  {
    "id": "r1",
    "name": "Ananya Nair",
    "rating": 5,
    "text": "The traditional Kanjivaram silk saree exceeded all my expectations! Exquisite craftsmanship, authentic Kerala temple borders, and lightning-fast delivery. Oruma Fashion Hub is my absolute favorite store for wedding wear.",
    "date": "2 weeks ago",
    "avatar": "https://picsum.photos/id/64/100/100"
  },
  {
    "id": "r2",
    "name": "Rahul Menon",
    "rating": 5,
    "text": "Got the cool Khakis denim combo and formal shirts. The fabric feel and tailoring are top-notch. Truly modern menswear with great durability.",
    "date": "1 month ago",
    "avatar": "https://picsum.photos/id/65/100/100"
  },
  {
    "id": "r3",
    "name": "Fatima Zahra",
    "rating": 5,
    "text": "The plum textured abaya set and Chikankari co-ord set are breathtaking! High quality modest wear with elegant finishing.",
    "date": "3 weeks ago",
    "avatar": "https://picsum.photos/id/91/100/100"
  },
  {
    "id": "r4",
    "name": "Siddharth V.",
    "rating": 5,
    "text": "Three floors of genuine quality now accessible online. The kidswear collection for our daughter was adorable and super soft.",
    "date": "Just now",
    "avatar": "https://picsum.photos/id/1025/100/100"
  }
];
