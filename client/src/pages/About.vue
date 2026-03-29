<template>
  <div class="about">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">About Our School</h1>
        <p class="hero-tagline">Discover our legacy of excellence and commitment to education</p>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">🏫</div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <h2>Our Mission</h2>
        <div class="mission-content">
          <div class="mission-text">
            <p>
              Our mission is to provide quality education that nurtures intellectual growth,
              fosters creativity, and develops well-rounded individuals who are prepared to
              contribute positively to society.
            </p>
            <p>
              We believe in creating a supportive learning environment where every student
              can discover their potential and achieve academic excellence while developing
              essential life skills.
            </p>
          </div>
          <div class="mission-image">
            <div class="image-placeholder">🎯</div>
          </div>
        </div>
      </div>
    </section>

    <!-- History Section -->
    <section class="history-section">
      <div class="container">
        <h2>Our History</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-marker">📅</div>
            <div class="timeline-content">
              <h3>2000 - Foundation</h3>
              <p>Founded in 2000, our school began with a vision to provide exceptional education to the community.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">🏆</div>
            <div class="timeline-content">
              <h3>2010 - Recognition</h3>
              <p>Achieved national recognition for academic excellence and innovative teaching methods.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">🌟</div>
            <div class="timeline-content">
              <h3>2020 - Digital Transformation</h3>
              <p>Embraced technology with smart classrooms and modern learning facilities.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">🎓</div>
            <div class="timeline-content">
              <h3>2026 - Today</h3>
              <p>Continuing our legacy of excellence with over 1000 students and state-of-the-art facilities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <h2>Our Core Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🏆</div>
            <h3>Excellence</h3>
            <p>Striving for the highest standards in education and personal development.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>Integrity</h3>
            <p>Building character through honesty, responsibility, and ethical behavior.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>Embracing new ideas and creative approaches to learning.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🌍</div>
            <h3>Community</h3>
            <p>Fostering a supportive environment for students, parents, and staff.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership Section -->
    <section class="leadership-section">
      <div class="container">
        <h2>Leadership Team</h2>
        <div class="leadership-grid">
          <div class="leader-card">
            <div class="leader-image">
              <div class="image-placeholder">👨‍🏫</div>
            </div>
            <h3>Dr. Sarah Johnson</h3>
            <p class="leader-title">Principal</p>
            <p>Leading our institution with vision and dedication for over 15 years.</p>
          </div>
          <div class="leader-card">
            <div class="leader-image">
              <div class="image-placeholder">👩‍🏫</div>
            </div>
            <h3>Ms. Maria Rodriguez</h3>
            <p class="leader-title">Vice Principal</p>
            <p>Overseeing academic programs and student development initiatives.</p>
          </div>
          <div class="leader-card">
            <div class="leader-image">
              <div class="image-placeholder">👨‍💼</div>
            </div>
            <h3>Mr. David Chen</h3>
            <p class="leader-title">Head of Operations</p>
            <p>Managing school operations and ensuring smooth daily functioning.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.about {
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
  min-height: 400px;
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

/* Mission Section */
.mission-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.mission-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.mission-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.mission-text p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.image-placeholder {
  font-size: 6rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* History Section */
.history-section {
  padding: 4rem 2rem;
}

.history-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 2rem;
  top: 4rem;
  bottom: -2rem;
  width: 2px;
  background: #667eea;
}

.timeline-marker {
  font-size: 2rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.timeline-content h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.timeline-content p {
  color: #666;
  line-height: 1.6;
}

/* Values Section */
.values-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.values-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-8px);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.value-card p {
  color: #666;
  line-height: 1.6;
}

/* Leadership Section */
.leadership-section {
  padding: 4rem 2rem;
}

.leadership-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.leadership-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.leader-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.leader-image {
  margin-bottom: 1.5rem;
}

.leader-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.leader-title {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
}

.leader-card p {
  color: #666;
  line-height: 1.6;
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

  .mission-content,
  .timeline-item {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .values-grid,
  .leadership-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item:not(:last-child)::after {
    display: none;
  }
}
</style>
