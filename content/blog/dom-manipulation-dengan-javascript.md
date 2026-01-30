---
title: "DOM Manipulation dengan JavaScript"
date: "2026-02-04T00:00:00.000Z"
description: "Tutorial lengkap manipulasi DOM JavaScript mulai dari seleksi elemen, mengubah konten, styling, event handling, hingga teknik lanjutan dalam bahasa Indonesia"
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# DOM Manipulation dengan JavaScript

Document Object Model (DOM) adalah representasi berbasis objek dari struktur dokumen HTML atau XML. DOM memungkinkan JavaScript untuk mengakses dan memanipulasi konten, struktur, dan style dari halaman web secara dinamis. Artikel ini akan membahas berbagai teknik manipulasi DOM dari yang dasar hingga lanjutan.

## Memahami DOM

DOM mengubah dokumen HTML menjadi struktur tree di mana setiap elemen, atribut, dan teks menjadi node yang dapat diakses dan dimanipulasi.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Contoh DOM</title>
  </head>
  <body>
    <div id="container">
      <h1 class="judul">Selamat Datang</h1>
      <p>Ini adalah paragraf.</p>
    </div>
  </body>
</html>
```

Struktur DOM di atas:
```
Document
└── html
    ├── head
    │   └── title
    └── body
        └── div#container
            ├── h1.judul
            └── p
```

## Seleksi Elemen

### getElementById()

Metode paling cepat untuk seleksi elemen berdasarkan ID unik.

```javascript
// HTML: <div id="header">...</div>
const header = document.getElementById('header');
console.log(header); // <div id="header">...</div>

// Mengubah konten
header.textContent = 'Header Baru';
```

### getElementsByClassName()

Mengembalikan HTMLCollection (live) dari elemen dengan class tertentu.

```javascript
// HTML: <div class="item">Item 1</div>
//       <div class="item">Item 2</div>
const items = document.getElementsByClassName('item');
console.log(items.length); // 2

// Iterasi (HTMLCollection bukan array, tapi bisa di-loop)
for (let i = 0; i < items.length; i++) {
  items[i].style.color = 'blue';
}

// Convert ke array untuk menggunakan array methods
Array.from(items).forEach(item => {
  item.addEventListener('click', handleClick);
});
```

### getElementsByTagName()

Mengembalikan HTMLCollection dari elemen dengan tag tertentu.

```javascript
// Mendapatkan semua paragraf
const paragraphs = document.getElementsByTagName('p');

// Mendapatkan semua div di dalam container
const container = document.getElementById('container');
const divs = container.getElementsByTagName('div');
```

### querySelector()

Mengembalikan elemen pertama yang cocok dengan selector CSS.

```javascript
// Selector ID
const header = document.querySelector('#header');

// Selector class
const firstItem = document.querySelector('.item');

// Selector tag
const firstParagraph = document.querySelector('p');

// Selector complex
const navLink = document.querySelector('nav ul li a');

// Selector dengan pseudo-class
const firstChild = document.querySelector('.container :first-child');
const oddItems = document.querySelectorAll('.list-item:nth-child(odd)');
```

### querySelectorAll()

Mengembalikan NodeList (static) dari semua elemen yang cocok.

```javascript
// Semua elemen dengan class 'btn'
const buttons = document.querySelectorAll('.btn');

// Semua link di dalam nav
const navLinks = document.querySelectorAll('nav a');

// NodeList mendukung forEach
buttons.forEach((btn, index) => {
  btn.textContent = `Tombol ${index + 1}`;
});

// Convert ke array
const buttonsArray = [...buttons];
```

## Mengubah Konten Elemen

### textContent vs innerText vs innerHTML

```javascript
const element = document.getElementById('demo');

// textContent - mengambil/mengubah semua teks (termasuk yang hidden)
element.textContent = 'Teks baru dengan <b>HTML</b> tidak diproses';

// innerText - mengambil/mengubah teks yang visible saja
element.innerText = 'Teks yang terlihat saja';

// innerHTML - mengambil/mengubah HTML (berbahaya jika tidak disanitasi)
element.innerHTML = '<strong>Teks tebal</strong> dan <em>miring</em>';

// Perbedaan performa
element.textContent = ''; // Lebih cepat untuk menghapus konten
element.innerHTML = '';   // Lebih lambat karena parsing HTML
```

### insertAdjacentHTML()

Menyisipkan HTML pada posisi tertentu relatif terhadap elemen.

```javascript
const container = document.getElementById('container');

// beforebegin - sebelum elemen
container.insertAdjacentHTML('beforebegin', '<p>Sebelum container</p>');

// afterbegin - di dalam elemen, sebelum first child
container.insertAdjacentHTML('afterbegin', '<h2>Judul di awal</h2>');

// beforeend - di dalam elemen, setelah last child
container.insertAdjacentHTML('beforeend', '<p>Paragraf di akhir</p>');

// afterend - setelah elemen
container.insertAdjacentHTML('afterend', '<footer>Footer</footer>');
```

## Manipulasi Atribut

### Mengakses dan Mengubah Atribut

```javascript
const link = document.getElementById('myLink');

// Method getAttribute/setAttribute
const href = link.getAttribute('href');
link.setAttribute('href', 'https://example.com');
link.setAttribute('target', '_blank');
link.setAttribute('data-id', '123');

// Property (lebih cepat untuk atribut standar)
link.href = 'https://example.com';
link.target = '_blank';
link.id = 'newId';
link.className = 'link-class';

// Boolean attributes
const checkbox = document.getElementById('agree');
checkbox.checked = true;
checkbox.disabled = false;

// Data attributes (dataset)
const userCard = document.querySelector('.user-card');
console.log(userCard.dataset.userId);    // Mengakses data-user-id
console.log(userCard.dataset.role);      // Mengakses data-role
userCard.dataset.status = 'active';      // Mengubah data-status
```

### Manipulasi Class

```javascript
const element = document.getElementById('box');

// className - string semua class
element.className = 'box active highlighted';

// classList - lebih fleksibel
// Menambah class
element.classList.add('active');
element.classList.add('large', 'rounded'); // Multiple class

// Menghapus class
element.classList.remove('hidden');
element.classList.remove('old', 'deprecated');

// Toggle class (tambah jika tidak ada, hapus jika ada)
element.classList.toggle('active');
element.classList.toggle('visible', condition); // Toggle berdasarkan condition

// Cek apakah punya class
if (element.classList.contains('active')) {
  console.log('Element sedang aktif');
}

// Replace class
element.classList.replace('old-class', 'new-class');
```

## Manipulasi Style

### Inline Styles

```javascript
const box = document.getElementById('box');

// Mengubah style individual (camelCase)
box.style.backgroundColor = '#3498db';
box.style.width = '200px';
box.style.height = '200px';
box.style.borderRadius = '10px';
box.style.display = 'flex';
box.style.justifyContent = 'center';
box.style.alignItems = 'center';

// Mengubah multiple styles sekaligus
Object.assign(box.style, {
  backgroundColor: '#e74c3c',
  padding: '20px',
  margin: '10px auto',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
});

// Mengakses computed style (nilai akhir setelah CSS diterapkan)
const computedStyle = window.getComputedStyle(box);
console.log(computedStyle.backgroundColor);
console.log(computedStyle.fontSize);
```

### CSS Custom Properties (Variables)

```javascript
// HTML: <div id="theme" style="--primary-color: #3498db;">
const theme = document.getElementById('theme');

// Mengakses custom property
const primaryColor = theme.style.getPropertyValue('--primary-color');

// Mengubah custom property
theme.style.setProperty('--primary-color', '#e74c3c');
theme.style.setProperty('--spacing', '20px');

// Mengubah di root (document level)
document.documentElement.style.setProperty('--font-size', '16px');
```

## Membuat dan Menghapus Elemen

### Membuat Elemen Baru

```javascript
// Membuat elemen baru
const newDiv = document.createElement('div');
newDiv.id = 'new-element';
newDiv.className = 'box highlighted';
newDiv.textContent = 'Elemen baru!';

// Menambah ke DOM
document.body.appendChild(newDiv);

// Membuat elemen kompleks
function createCard(title, description, imageUrl) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title;
  img.className = 'card-image';
  
  const content = document.createElement('div');
  content.className = 'card-content';
  
  const h3 = document.createElement('h3');
  h3.textContent = title;
  h3.className = 'card-title';
  
  const p = document.createElement('p');
  p.textContent = description;
  p.className = 'card-description';
  
  content.appendChild(h3);
  content.appendChild(p);
  card.appendChild(img);
  card.appendChild(content);
  
  return card;
}

const card = createCard(
  'Produk Baru',
  'Deskripsi produk yang menarik',
  'https://example.com/image.jpg'
);
document.getElementById('container').appendChild(card);
```

### Template Literal untuk Elemen

```javascript
function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
        <button class="btn-add-cart" onclick="addToCart(${product.id})">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  `;
}

const products = [
  { id: 1, name: 'Laptop', price: 10000000, image: 'laptop.jpg' },
  { id: 2, name: 'Mouse', price: 150000, image: 'mouse.jpg' }
];

const container = document.getElementById('products');
container.innerHTML = products.map(createProductCard).join('');
```

### Menyisipkan Elemen

```javascript
const parent = document.getElementById('parent');
const newElement = document.createElement('div');
const reference = document.getElementById('reference');

// appendChild - tambah di akhir
parent.appendChild(newElement);

// prepend - tambah di awal (modern)
parent.prepend(newElement);

// insertBefore - tambah sebelum elemen tertentu
parent.insertBefore(newElement, reference);

// insertAdjacentElement
parent.insertAdjacentElement('beforebegin', newElement);
parent.insertAdjacentElement('afterbegin', newElement);
parent.insertAdjacentElement('beforeend', newElement);
parent.insertAdjacentElement('afterend', newElement);

// append dan prepend (bisa multiple)
parent.append(element1, element2, 'Teks');
parent.prepend(element1, element2);
```

### Menghapus Elemen

```javascript
const element = document.getElementById('to-remove');

// Method remove (modern)
element.remove();

// removeChild (cara lama, masih didukung)
const parent = element.parentNode;
parent.removeChild(element);

// Menghapus semua child
const container = document.getElementById('container');
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Cara cepat menghapus semua konten
container.innerHTML = '';

// Cara modern dan efisien
container.replaceChildren();
```

## Traversing DOM

### Navigasi Parent dan Child

```javascript
const item = document.getElementById('item');

// Parent
const parent = item.parentNode;           // Bisa return text node
const parentElement = item.parentElement; // Selalu return element

// closest - cari ancestor terdekat yang cocok
const card = item.closest('.card');
const container = item.closest('#container');

// Children
const children = item.childNodes;         // Include text nodes
const childElements = item.children;      // Hanya element nodes
const firstChild = item.firstChild;       // Bisa text node
const firstElementChild = item.firstElementChild;
const lastChild = item.lastChild;
const lastElementChild = item.lastElementChild;

// Siblings
const nextSibling = item.nextSibling;           // Bisa text node
const nextElementSibling = item.nextElementSibling;
const previousSibling = item.previousSibling;
const previousElementSibling = item.previousElementSibling;
```

### Contoh Traversing

```javascript
// Menemukan semua sibling
function getAllSiblings(element) {
  const siblings = [];
  let sibling = element.parentNode.firstChild;
  
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== element) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  
  return siblings;
}

// Menemukan semua children dengan class tertentu
function findChildrenByClass(parent, className) {
  return Array.from(parent.children).filter(child => 
    child.classList.contains(className)
  );
}

// Menelusuri tree ke bawah
function findAllDescendants(element, selector) {
  return element.querySelectorAll(selector);
}
```

## Event Handling

### Menambah Event Listener

```javascript
const button = document.getElementById('myButton');

// addEventListener (bisa multiple)
button.addEventListener('click', function(event) {
  console.log('Tombol diklik!');
  console.log('Event:', event);
  console.log('Target:', event.target);
});

// Dengan arrow function
button.addEventListener('click', (e) => {
  e.preventDefault(); // Mencegah default behavior
  e.stopPropagation(); // Stop bubbling
  console.log('Klik dengan arrow function');
});

// Dengan named function (bisa remove nanti)
function handleClick(e) {
  console.log('Handled!');
}

button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);
```

### Event Delegation

```javascript
// ❌ Tanpa delegation - listener di setiap item
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', handleItemClick);
});

// ✅ Dengan delegation - satu listener di parent
const list = document.getElementById('list');
list.addEventListener('click', function(e) {
  // Cek apakah yang diklik adalah item
  if (e.target.classList.contains('item')) {
    handleItemClick(e);
  }
  
  // Atau dengan closest
  const item = e.target.closest('.item');
  if (item) {
    handleItemClick(e, item);
  }
});

function handleItemClick(event, item) {
  console.log('Item diklik:', item.textContent);
  item.classList.toggle('selected');
}
```

### Event Types Umum

```javascript
const input = document.getElementById('input');
const form = document.getElementById('form');

// Mouse events
button.addEventListener('click', e => console.log('Click'));
button.addEventListener('dblclick', e => console.log('Double click'));
button.addEventListener('mouseenter', e => console.log('Mouse enter'));
button.addEventListener('mouseleave', e => console.log('Mouse leave'));
button.addEventListener('mousemove', e => {
  console.log(`X: ${e.clientX}, Y: ${e.clientY}`);
});

// Keyboard events
input.addEventListener('keydown', e => console.log('Key down:', e.key));
input.addEventListener('keyup', e => console.log('Key up:', e.key));
input.addEventListener('keypress', e => console.log('Key press:', e.key));

// Form events
input.addEventListener('focus', e => console.log('Focused'));
input.addEventListener('blur', e => console.log('Blurred'));
input.addEventListener('input', e => console.log('Input:', e.target.value));
input.addEventListener('change', e => console.log('Changed:', e.target.value));

form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log('Submitted:', Object.fromEntries(formData));
});

// Window events
window.addEventListener('load', () => console.log('Page loaded'));
window.addEventListener('resize', () => {
  console.log(`Size: ${window.innerWidth}x${window.innerHeight}`);
});
window.addEventListener('scroll', () => {
  console.log('Scroll position:', window.scrollY);
});
```

## Teknik Lanjutan

### DocumentFragment

```javascript
// ❌ Tanpa DocumentFragment - multiple reflows
const list = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li); // Reflow setiap iterasi!
}

// ✅ Dengan DocumentFragment - satu reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment); // Satu reflow saja
```

### Intersection Observer

```javascript
// Lazy loading images
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img.lazy').forEach(img => {
  imageObserver.observe(img);
});

// Infinite scroll
const sentinel = document.getElementById('sentinel');
const contentObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreContent();
  }
});
contentObserver.observe(sentinel);
```

### Mutation Observer

```javascript
const targetNode = document.getElementById('container');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('Child nodes changed');
      console.log('Added:', mutation.addedNodes);
      console.log('Removed:', mutation.removedNodes);
    }
    if (mutation.type === 'attributes') {
      console.log(`Attribute ${mutation.attributeName} changed`);
    }
  });
});

observer.observe(targetNode, {
  childList: true,
  attributes: true,
  subtree: true
});

// Stop observing
// observer.disconnect();
```

## Best Practices

### 1. Cache DOM Queries

```javascript
// ❌ Query berulang kali
for (let i = 0; i < 100; i++) {
  document.getElementById('container').appendChild(item);
}

// ✅ Cache hasil query
const container = document.getElementById('container');
for (let i = 0; i < 100; i++) {
  container.appendChild(item);
}
```

### 2. Gunakan Event Delegation

```javascript
// ✅ Satu event listener untuk banyak elemen
document.getElementById('list').addEventListener('click', handleListClick);
```

### 3. Hindari innerHTML untuk User Input

```javascript
// ❌ Berisiko XSS
element.innerHTML = userInput;

// ✅ Gunakan textContent atau createElement
element.textContent = userInput;

// Atau sanitasi dulu
const sanitized = DOMPurify.sanitize(userInput);
element.innerHTML = sanitized;
```

### 4. Gunakan requestAnimationFrame untuk Animasi

```javascript
function animate() {
  // Update DOM
  element.style.transform = `translateX(${position}px)`;
  
  if (position < target) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

## Kesimpulan

Manipulasi DOM adalah keterampilan fundamental dalam pengembangan web frontend. Memahami berbagai metode seleksi, manipulasi konten, styling, dan event handling memungkinkan Anda membuat halaman web yang interaktif dan dinamis.

Beberapa poin penting:
- Gunakan metode seleksi yang paling spesifik untuk performa optimal
- Manfaatkan DocumentFragment untuk manipulasi massal
- Gunakan event delegation untuk efisiensi
- Selalu sanitasi input user sebelum memasukkan ke DOM
- Pertimbangkan modern APIs seperti Intersection Observer untuk use case spesifik

Dengan menguasai teknik-teknik ini, Anda dapat membuat aplikasi web yang responsif, efisien, dan mudah dipelihara.
