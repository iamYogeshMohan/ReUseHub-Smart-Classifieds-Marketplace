const fs = require('fs');

const urls = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
  'https://images.unsplash.com/photo-1612282130134-49b827e8a939?w=800&q=80',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
  'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
  'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
  'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80',
  'https://images.unsplash.com/photo-1532298229144-0ec0c5715138?w=800&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
  'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
  'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800&q=80',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
  'https://images.unsplash.com/photo-1594620302200-9a762220a9c4?w=800&q=80',
  'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=800&q=80',
  'https://images.unsplash.com/photo-1601760561441-16420502c7e0?w=800&q=80',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
  'https://images.unsplash.com/photo-1551028719-001dd5c317ad?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
  'https://images.unsplash.com/photo-1605020420620-20c943cc4669?w=800&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  'https://images.unsplash.com/photo-1622279457486-640c4cb7ddcb?w=800&q=80',
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'https://images.unsplash.com/photo-1535136192305-adacbdfb29ce?w=800&q=80',
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
  'https://images.unsplash.com/photo-1504280502846-fb4c82c695bb?w=800&q=80',
  'https://images.unsplash.com/photo-1523423714275-81fae5e786b3?w=800&q=80',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  'https://images.unsplash.com/photo-1535551325150-1c390a3de07c?w=800&q=80',
  'https://images.unsplash.com/photo-1610890716171-ec5af7476eac?w=800&q=80',
  'https://images.unsplash.com/photo-1510915361894-faa8b2d18d45?w=800&q=80',
  'https://images.unsplash.com/photo-1524578502599-4dffcbf1103c?w=800&q=80',
  'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80',
  'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80',
  'https://images.unsplash.com/photo-1596796414961-c1155985bbbf?w=800&q=80'
];

async function run() {
  let log = "";
  for (const url of urls) {
    try {
      const resp = await fetch(url, { method: 'HEAD' });
      if (resp.status !== 200) {
        log += `BROKEN [${resp.status}]: ${url}\n`;
      }
    } catch (err) {
      log += `ERROR: ${url} - ${err.message}\n`;
    }
  }
  if (log === "") log = "ALL OK";
  fs.writeFileSync('test-out.txt', log);
}
run();
