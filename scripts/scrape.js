const fs = require('fs');

async function scrapeAll() {
  const sitemapRes = await fetch('https://orumaweddings.com/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const urls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  
  const ignore = [
    'https://orumaweddings.com/httpsorumaweddingscomoruma-fashion-blog',
    'https://orumaweddings.com',
    'https://orumaweddings.com/httpsorumaweddingscomoruma-fashion',
    'https://orumaweddings.com/kids-wear-oruma-fashion',
    'https://orumaweddings.com/mens-wear',
    'https://orumaweddings.com/buy-ladies-wear-sarees-online',
    'https://orumaweddings.com/httpsorumaweddingscomoruma-fashion-hub',
    'https://orumaweddings.com/wedding-search',
    'https://orumaweddings.com/httpsorumaweddingscomwedding-clothing-brands',
    'https://orumaweddings.com/oruma-fashion-hub',
    'https://orumaweddings.com/contact-oruma-fashion-hub',
    'https://orumaweddings.com/oruma-fashion-reviews'
  ];

  const productUrls = urls.filter(u => !ignore.includes(u));
  console.log('Total product URLs found:', productUrls.length);

  const products = [];
  for (const url of productUrls) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
      if (match) {
        const json = JSON.parse(match[1]);
        if (json['@type'] === 'Product') {
          // Categorize based on url / name
          const slug = url.replace('https://orumaweddings.com/', '');
          const lowerName = json.name.toLowerCase();
          const lowerDesc = (json.description || '').toLowerCase();
          
          let category = 'Unisex';
          if (
            slug.includes('men') || lowerName.includes('men') || lowerDesc.includes('men') ||
            lowerName.includes('chinos') || lowerName.includes('shirt')
          ) {
            category = 'Men';
          }
          if (
            slug.includes('girl') || slug.includes('kid') || lowerName.includes('girls') ||
            lowerName.includes('kid') || lowerName.includes('frock') || lowerName.includes('bunny')
          ) {
            category = 'Kids';
          }
          if (
            slug.includes('ladies') || slug.includes('saree') || slug.includes('kurti') ||
            slug.includes('dress') || slug.includes('abaya') || slug.includes('gown') ||
            slug.includes('skirt') || slug.includes('chikankari') || slug.includes('palazzo') ||
            lowerName.includes('saree') || lowerName.includes('kurti') || lowerName.includes('dress') ||
            lowerName.includes('ladies') || lowerName.includes('gown') || lowerName.includes('abaya')
          ) {
            if (category !== 'Kids') {
              category = 'Women';
            }
          }
          if (slug.includes('sock') || slug.includes('scarves') || slug.includes('hijab') || lowerName.includes('sock') || lowerName.includes('hijab')) {
            category = 'Accessories';
          }

          products.push({
            id: slug,
            name: json.name.trim(),
            description: json.description ? json.description.trim() : '',
            image: json.image,
            price: parseFloat(json.offers?.price || '0'),
            currency: (json.offers?.priceCurrency || 'INR').toUpperCase(),
            category,
            url
          });
          console.log(`[${category}] ${json.name.trim()} -> ${json.offers?.priceCurrency || 'INR'} ${json.offers?.price}`);
        }
      }
    } catch (err) {
      console.error('Error on', url, err.message);
    }
  }

  console.log(`Successfully scraped ${products.length} products.`);
  fs.writeFileSync('scraped_products.json', JSON.stringify(products, null, 2));
}

scrapeAll();
