<template>
  <div class="facilities-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Our Facilities</h1>
        <p class="hero-tagline">State-of-the-art learning environments designed for excellence</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">25+</span>
            <span class="stat-label">Classrooms</span>
          </div>
          <div class="stat">
            <span class="stat-number">8</span>
            <span class="stat-label">Labs</span>
          </div>
          <div class="stat">
            <span class="stat-number">2</span>
            <span class="stat-label">Auditoriums</span>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">🏫</div>
      </div>
    </section>

    <!-- Academic Facilities -->
    <section class="facilities-section">
      <div class="container">
        <h2>Academic Facilities</h2>
        <div class="facilities-grid">
          <div class="facility-card">
            <div class="facility-image">
              <div class="image-placeholder">📚</div>
            </div>
            <div class="facility-content">
              <h3>Modern Classrooms</h3>
              <p>Spacious, well-lit classrooms equipped with interactive whiteboards, multimedia projectors, and comfortable seating for optimal learning.</p>
              <ul class="facility-features">
                <li>Interactive whiteboards</li>
                <li>Multimedia projectors</li>
                <li>Air-conditioned environment</li>
                <li>Capacity: 30-35 students</li>
              </ul>
            </div>
          </div>

          <div class="facility-card">
            <div class="facility-image">
              <div class="image-placeholder">🔬</div>
            </div>
            <div class="facility-content">
              <h3>Science Laboratories</h3>
              <p>Well-equipped science labs for physics, chemistry, and biology with modern apparatus and safety measures for hands-on learning.</p>
              <ul class="facility-features">
                <li>Physics, Chemistry & Biology labs</li>
                <li>Modern laboratory equipment</li>
                <li>Safety protocols & first aid</li>
                <li>Experienced lab assistants</li>
              </ul>
            </div>
          </div>

          <div class="facility-card">
            <div class="facility-image">
              <div class="image-placeholder">💻</div>
            </div>
            <div class="facility-content">
              <h3>Computer Lab</h3>
              <p>Advanced computer lab with latest hardware and software, high-speed internet, and dedicated IT support for digital learning.</p>
              <ul class="facility-features">
                <li>60 high-performance computers</li>
                <li>Latest software & programming tools</li>
                <li>High-speed internet</li>
                <li>24/7 IT support</li>
              </ul>
            </div>
          </div>

          <div class="facility-card">
            <div class="facility-image">
              <div class="image-placeholder">📖</div>
            </div>
            <div class="facility-content">
              <h3>Library</h3>
              <p>Extensive collection of books, journals, and digital resources with comfortable reading areas and research facilities.</p>
              <ul class="facility-features">
                <li>50,000+ books collection</li>
                <li>Digital library access</li>
                <li>Reading rooms & study areas</li>
                <li>Online research databases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'Facilities'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.facilities-page {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  min-height: 500px;
}

.hero-content {
  animation: fadeInLeft 0.8s ease-out;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
}

.hero-placeholder {
  background: rgba(255, 255, 255, 0.2);
  padding: 4rem;
  border-radius: 8px;
  text-align: center;
  font-size: 4rem;
  font-weight: bold;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Facilities Section */
.facilities-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.facilities-section h2,
.sports-section h2,
.arts-section h2,
.campus-section h2,
.tour-section h2,
.booking-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.facility-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.facility-card:hover {
  transform: translateY(-4px);
}

.facility-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 4rem;
  color: white;
}

.facility-content {
  padding: 2rem;
}

.facility-content h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.facility-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.facility-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.facility-features li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.facility-features li::before {
  content: "✓";
  color: #10b981;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Sports Section */
.sports-section {
  padding: 4rem 2rem;
}

.sports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.sport-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.sport-card:hover {
  transform: translateY(-4px);
}

.sport-image {
  height: 150px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sport-content {
  padding: 1.5rem;
  text-align: center;
}

.sport-content h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.sport-content p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Arts Section */
.arts-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.arts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.art-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.art-card:hover {
  transform: translateY(-4px);
}

.art-image {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
}

.art-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.art-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Campus Section */
.campus-section {
  padding: 4rem 2rem;
}

.campus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.campus-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.campus-card:hover {
  transform: translateY(-4px);
}

.campus-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.campus-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.campus-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Tour Section */
.tour-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.tour-container {
  max-width: 800px;
  margin: 0 auto;
}

.tour-placeholder {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.tour-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.tour-placeholder h3 {
  color: #333;
  margin-bottom: 1rem;
}

.tour-placeholder p {
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

/* Booking Section */
.booking-section {
  padding: 4rem 2rem;
}

.booking-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
}

.booking-info h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.booking-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.booking-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.booking-features li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.booking-features li::before {
  content: "✓";
  color: #10b981;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.booking-image {
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-stats {
    justify-content: center;
  }

  .facilities-grid {
    grid-template-columns: 1fr;
  }

  .sports-grid,
  .arts-grid,
  .campus-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .booking-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .tour-placeholder {
    padding: 2rem 1rem;
  }
}
</style>