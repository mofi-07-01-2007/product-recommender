import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app">

    <header class="header">
      <div class="logo">🛍️ SmartPick</div>
      <p>Find the right product for your budget</p>
    </header>

    <main class="container">

      <section class="hero">
        <h1>Find Your Perfect Product</h1>
        <p>
          Tell us what you need, your budget, and your preferences.
          We'll find the best matches for you.
        </p>
      </section>

      <section class="recommendation-box">

        <div class="form-group">
          <label for="category">What are you looking for?</label>

          <select id="category">
            <option value="">Select a category</option>
            <option value="laptop">💻 Laptop</option>
            <option value="earbuds">🎧 Earbuds</option>
            <option value="tv">📺 TV</option>
            <option value="ac">❄️ Air Conditioner</option>
          </select>
        </div>

        <div class="form-group">
          <label for="budget">Your Budget (₹)</label>

          <input
            type="number"
            id="budget"
            placeholder="Example: 60000"
            min="1"
          />
        </div>

        <div class="form-group">
          <label for="spec">Preferred Specification</label>

          <select id="spec">
            <option value="">No preference</option>
          </select>
        </div>

        <button id="recommendBtn">
          🔍 Find My Recommendations
        </button>

      </section>

      <section id="results" class="results hidden">

        <div class="results-header">
          <h2>Recommended For You</h2>
          <p>Based on your budget and preferences</p>
        </div>

        <div id="productList" class="product-list"></div>

      </section>

    </main>

    <footer>
      <p>SmartPick • Product Recommendation System</p>
    </footer>

  </div>
`

const category = document.querySelector('#category')
const spec = document.querySelector('#spec')
const budget = document.querySelector('#budget')
const recommendBtn = document.querySelector('#recommendBtn')
const results = document.querySelector('#results')
const productList = document.querySelector('#productList')


/* Change specification options based on category */

category.addEventListener('change', () => {

  const selectedCategory = category.value

  spec.innerHTML = '<option value="">No preference</option>'

  if (selectedCategory === 'laptop') {
    spec.innerHTML += `
      <option value="8">8 GB RAM</option>
      <option value="16">16 GB RAM</option>
      <option value="32">32 GB RAM</option>
    `
  }

  if (selectedCategory === 'earbuds') {
    spec.innerHTML += `
      <option value="6">6+ hours battery</option>
      <option value="8">8+ hours battery</option>
      <option value="10">10+ hours battery</option>
    `
  }

  if (selectedCategory === 'tv') {
    spec.innerHTML += `
      <option value="43">43 inch</option>
      <option value="50">50 inch</option>
      <option value="55">55 inch</option>
    `
  }

  if (selectedCategory === 'ac') {
    spec.innerHTML += `
      <option value="1">1 Ton</option>
      <option value="1.5">1.5 Ton</option>
      <option value="2">2 Ton</option>
    `
  }
})


/* Get recommendations from backend */

recommendBtn.addEventListener('click', async () => {

  const selectedCategory = category.value
  const selectedBudget = budget.value
  const selectedSpec = spec.value

  if (!selectedCategory) {
    alert('Please select a product category.')
    return
  }

  if (!selectedBudget || Number(selectedBudget) <= 0) {
    alert('Please enter a valid budget.')
    return
  }

  results.classList.remove('hidden')

  productList.innerHTML = `
    <div class="empty-message">
      <div class="loading-icon">🔍</div>
      <h3>Finding the best products...</h3>
      <p>Please wait...</p>
    </div>
  `

  try {

    const url =
      `http://127.0.0.1:8000/recommend?category=${selectedCategory}&budget=${selectedBudget}&spec=${selectedSpec}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Could not connect to backend')
    }

    const data = await response.json()

    displayProducts(data.recommendations)

  } catch (error) {

    productList.innerHTML = `
      <div class="empty-message">
        <div class="loading-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>Could not connect to the recommendation server.</p>
      </div>
    `

    console.error(error)
  }
})


/* Display products */

function displayProducts(products) {

  if (products.length === 0) {

    productList.innerHTML = `
      <div class="empty-message">
        <div class="loading-icon">😕</div>
        <h3>No matching products found</h3>
        <p>Try increasing your budget or changing your preferences.</p>
      </div>
    `

    return
  }

  productList.innerHTML = products.map((product, index) => {

    let reason = "👍 Reliable option within your budget"

if (index === 0) {

  if (product.category === 'laptop') {
    reason = `🏆 Highest-rated laptop within your ₹${Number(budget.value).toLocaleString('en-IN')} budget`
  }

  else if (product.category === 'earbuds') {
    reason = `🏆 Highest-rated earbuds within your ₹${Number(budget.value).toLocaleString('en-IN')} budget`
  }

  else if (product.category === 'tv') {
    reason = `🏆 Highest-rated TV within your ₹${Number(budget.value).toLocaleString('en-IN')} budget`
  }

  else if (product.category === 'ac') {
    reason = `🏆 Highest-rated AC within your ₹${Number(budget.value).toLocaleString('en-IN')} budget`
  }

}

else if (index === 1) {
  reason = "⭐ Excellent balance of price and rating"
}

else {
  reason = "👍 Reliable option within your budget"
}
    return `
      <div class="product-card">

        <div class="rank">#${index + 1}</div>

        <div class="product-icon">
  ${
    product.category === 'laptop'
      ? '💻'
      : product.category === 'earbuds'
        ? '🎧'
        : product.category === 'tv'
          ? '📺'
          : '❄️'
  }
</div>

        <h3>${product.name}</h3>

        <p class="brand">${product.brand}</p>

        <div class="price">
          ₹${product.price.toLocaleString('en-IN')}
        </div>

        <div class="rating">
          ⭐ ${product.rating}
        </div>

        <div class="specs">

  ${
    product.category === 'laptop'
      ? `
        <span>${product.ram} GB RAM</span>
        <span>${product.storage}</span>
        <span>${product.processor}</span>
      `
      : ''
  }

  ${
    product.category === 'earbuds'
      ? `
        <span>${product.battery}+ hrs battery</span>
        <span>${product.feature}</span>
      `
      : ''
  }

  ${
    product.category === 'tv'
      ? `
        <span>${product.screen_size}"</span>
        <span>${product.resolution}</span>
      `
      : ''
  }

  ${
    product.category === 'ac'
      ? `
        <span>${product.tonnage} Ton</span>
        <span>${product.inverter}</span>
      `
      : ''
  }

</div>

        <p class="reason">${reason}</p>

      </div>
    `

  }).join('')
}