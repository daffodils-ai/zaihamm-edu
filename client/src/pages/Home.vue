<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('home.hero.title') }}</h1>
        <p class="hero-tagline">{{ $t('home.hero.tagline') }}</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToAdmission">{{ $t('home.hero.applyNow') }}</button>
          <button class="btn btn-secondary" @click="scrollToHighlights">{{ $t('home.hero.explorePrograms') }}</button>
        </div>
      </div>
      <div class="hero-image">
        <img :src="heroImage" alt="School Campus" class="hero-img">
      </div>
    </section>

    <!-- Welcome Message -->
    <section class="welcome">
      <div class="welcome-container">
        <div class="principal-image">
          <div class="image-placeholder">
            <img :src="principalImage" alt="Principal" class="principal-img">
          </div>
        </div>
        <div class="welcome-content">
          <h2>{{ $t('home.welcome.title') }}</h2>
          <p>
            {{ $t('home.welcome.greeting') }}
          </p>
          <p>
            {{ $t('home.welcome.message1') }}
          </p>
          <p>
            {{ $t('home.welcome.message2') }}
          </p>
          <p>
            <strong>{{ $t('home.welcome.vision') }}</strong>
          </p>
          <p>
            <strong>{{ $t('home.welcome.mission') }}</strong>
          </p>
        </div>
      </div>
    </section>

    <!-- Quick Highlights -->
    <section class="highlights" ref="highlightsSection">
      <h2>{{ $t('home.highlights.title') }}</h2>
      <div class="highlights-grid">
        <div class="highlight-card">
          <div class="highlight-icon">👥</div>
          <h3>1000+</h3>
          <p>{{ $t('home.highlights.students') }}</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">🏆</div>
          <h3>8+</h3>
          <p>{{ $t('home.highlights.years') }}</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">🎓</div>
          <h3>95%</h3>
          <p>{{ $t('home.highlights.successRate') }}</p>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">🌟</div>
          <h3>20+</h3>
          <p>{{ $t('home.highlights.awards') }}</p>
        </div>
      </div>

      <!-- Programs -->
      <div class="programs-section">
        <h3>{{ $t('home.programs.title') }}</h3>
        <div class="programs-grid">
          <div class="program-card">
            <h4>{{ $t('home.programs.kindergarten.title') }}</h4>
            <p>{{ $t('home.programs.kindergarten.description') }}</p>
          </div>
          <div class="program-card">
            <h4>{{ $t('home.programs.primary.title') }}</h4>
            <p>{{ $t('home.programs.primary.description') }}</p>
          </div>
          <div class="program-card">
            <h4>{{ $t('home.programs.secondary.title') }}</h4>
            <p>{{ $t('home.programs.secondary.description') }}</p>
          </div>
          <div class="program-card">
            <h4>{{ $t('home.programs.extracurriculars.title') }}</h4>
            <p>{{ $t('home.programs.extracurriculars.description') }}</p>
          </div>
        </div>
      </div>

      <!-- Facilities -->
      <div class="facilities-section">
        <h3>{{ $t('home.facilities.title') }}</h3>
        <div class="facilities-grid">
          <div class="facility-item">✨ {{ $t('home.facilities.smartClassrooms') }}</div>
          <div class="facility-item">🏃 {{ $t('home.facilities.sportsComplex') }}</div>
          <div class="facility-item">📚 {{ $t('home.facilities.library') }}</div>
          <div class="facility-item">🔬 {{ $t('home.facilities.scienceLabs') }}</div>
          <div class="facility-item">🖥️ {{ $t('home.facilities.computerLab') }}</div>
          <div class="facility-item">🎭 {{ $t('home.facilities.auditorium') }}</div>
          <div class="facility-item">🍽️ {{ $t('home.facilities.cafeteria') }}</div>
          <div class="facility-item">🩺 {{ $t('home.facilities.medicalCenter') }}</div>
        </div>
      </div>
    </section>

    <!-- News & Events -->
    <section class="news-events">
      <h2>{{ $t('home.newsEvents.title') }}</h2>
      <div class="events-grid">
        <div class="event-card">
          <div class="event-badge">{{ $t('home.newsEvents.upcoming') }}</div>
          <h3>{{ $t('home.newsEvents.sportsMeet.title') }}</h3>
          <p class="event-date">📅 {{ $t('home.newsEvents.sportsMeet.date') }}</p>
          <p>{{ $t('home.newsEvents.sportsMeet.description') }}</p>
        </div>
        <div class="event-card">
          <div class="event-badge">{{ $t('home.newsEvents.upcoming') }}</div>
          <h3>{{ $t('home.newsEvents.scienceExhibition.title') }}</h3>
          <p class="event-date">📅 {{ $t('home.newsEvents.scienceExhibition.date') }}</p>
          <p>{{ $t('home.newsEvents.scienceExhibition.description') }}</p>
        </div>
        <div class="event-card">
          <div class="event-badge">{{ $t('home.newsEvents.recent') }}</div>
          <h3>{{ $t('home.newsEvents.debateWin.title') }}</h3>
          <p class="event-date">📅 {{ $t('home.newsEvents.debateWin.date') }}</p>
          <p>{{ $t('home.newsEvents.debateWin.description') }}</p>
        </div>
        <div class="event-card">
          <div class="event-badge">{{ $t('home.newsEvents.recent') }}</div>
          <h3>{{ $t('home.newsEvents.mathOlympiad.title') }}</h3>
          <p class="event-date">📅 {{ $t('home.newsEvents.mathOlympiad.date') }}</p>
          <p>{{ $t('home.newsEvents.mathOlympiad.description') }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <h2>{{ $t('home.testimonials.title') }}</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-text">
            "{{ $t('home.testimonials.parent.text') }}"
          </p>
          <p class="testimonial-author">- {{ $t('home.testimonials.parent.author') }}</p>
        </div>
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-text">
            "{{ $t('home.testimonials.alumni.text') }}"
          </p>
          <p class="testimonial-author">- {{ $t('home.testimonials.alumni.author') }}</p>
        </div>
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-text">
            "{{ $t('home.testimonials.student.text') }}"
          </p>
          <p class="testimonial-author">- {{ $t('home.testimonials.student.author') }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" ref="admissionSection">
      <h2>{{ $t('home.cta.title') }}</h2>
      <p>{{ $t('home.cta.description') }}</p>
      <div class="cta-buttons">
        <button class="cta-btn primary">
          <router-link to="/admission">{{ $t('home.cta.admissionsOpen') }}</router-link>
        </button>
        <button class="cta-btn secondary">{{ $t('home.cta.downloadProspectus') }}</button>
      </div>
    </section>
  </div>
</template>

<script>
import principalImage from '../assets/rohit.png'
import heroImage from '../assets/rscentralschimg.png'

export default {
  name: 'Home',
  data() {
    return {
      principalImage,
      heroImage
    }
  },
  methods: {
    scrollToAdmission() {
      this.$refs.admissionSection?.scrollIntoView({ behavior: 'smooth' })
    },
    scrollToHighlights() {
      this.$refs.highlightsSection?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home {
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

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: white;
  color: #667eea;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.hero-img {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

/* Welcome Section */
.welcome {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.welcome-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 3rem;
  align-items: start;
}

.principal-image {
  text-align: center;
}

.image-placeholder {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.principal-img {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  border-radius: 4px;
  object-fit: cover;
}

.welcome-content h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.welcome-content p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1rem;
}

/* Highlights Section */
.highlights {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.highlights h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.highlight-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-8px);
}

.highlight-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.highlight-card h3 {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.highlight-card p {
  color: #666;
}

/* Programs Section */
.programs-section {
  margin-top: 3rem;
}

.programs-section h3,
.facilities-section h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.programs-grid,
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.program-card {
  padding: 2rem;
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  border-radius: 8px;
}

.program-card h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.program-card p {
  color: #666;
  line-height: 1.6;
}

/* Facilities */
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.facility-item {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #ddd;
  font-weight: 500;
  transition: all 0.3s ease;
}

.facility-item:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* News & Events */
.news-events {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.news-events h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.event-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.event-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #667eea;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.event-card.recent .event-badge {
  background: #27ae60;
}

.event-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.event-date {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.event-card p {
  color: #666;
  line-height: 1.6;
}

/* Gallery Section */
.gallery {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
}

.gallery-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem;
  border-radius: 8px;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.gallery-item p {
  color: #333;
  font-weight: 500;
}

/* Testimonials */
.testimonials {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.testimonials h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stars {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.testimonial-text {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-style: italic;
}

.testimonial-author {
  color: #333;
  font-weight: 600;
}

/* CTA Section */
.cta-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background-color: white;
  color: #667eea;
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.cta-btn.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-btn.secondary:hover {
  background-color: white;
  color: #667eea;
}

.cta-btn.tertiary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.cta-btn.tertiary:hover {
  background-color: white;
  color: #667eea;
}

.cta-btn a {
  text-decoration: none;
  color: inherit;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    gap: 2rem;
    min-height: auto;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-img {
    max-height: 250px;
  }

  .welcome-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .highlights-grid,
  .programs-grid,
  .facilities-grid,
  .events-grid,
  .gallery-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-btn {
    width: 100%;
  }
}
</style>
