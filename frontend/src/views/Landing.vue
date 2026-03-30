<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <strong>🤖 AI School Management</strong>
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
            <li class="nav-item"><a class="nav-link" href="#ai-solutions">AI Solutions</a></li>
            <li class="nav-item"><a class="nav-link" href="#security">Security Hub</a></li>
            <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
            <li class="nav-item"><router-link to="/login" class="nav-link">Admin Login</router-link></li>
            <li class="nav-item"><router-link to="/student-login" class="nav-link">Student Login</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Animated Background -->
    <section class="hero-section text-white py-5">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6" data-aos="fade-right">
            <h1 class="display-4 fw-bold mb-4">
              AI-Powered <span class="highlight">School Intelligence</span>
            </h1>
            <p class="lead mb-4">
              Revolutionizing education management with cutting-edge AI: Facial recognition, 
              automated attendance, exam proctoring, and smart analytics — all in one platform.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link to="/login" class="btn btn-gradient btn-lg">🚀 Launch Admin Portal</router-link>
              <router-link to="/student-login" class="btn btn-outline-light btn-lg">👩‍🎓 Student Login</router-link>
              <a href="#demo" class="btn btn-outline-light btn-lg">▶ Watch Demo</a>
            </div>
            <div class="mt-5 d-flex gap-4 stats">
              <div><span class="counter">500+</span> Schools</div>
              <div><span class="counter">2M+</span> Students</div>
              <div><span class="counter">99.9%</span> Accuracy</div>
            </div>
          </div>
          <div class="col-lg-6 text-center" data-aos="fade-left">
            <div class="hero-image">
              <div class="floating-ai">🧠 AI</div>
              <div class="floating-cam">📸</div>
              <div class="floating-analytics">📊</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Integration Section - Main Attraction -->
    <section id="ai-solutions" class="ai-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <span class="badge bg-primary mb-3">Next-Gen AI Integration</span>
          <h2 class="display-5 fw-bold">Intelligent Systems for Modern Education</h2>
          <p class="lead">Experience the power of artificial intelligence transforming every corner of your institution</p>
        </div>

        <!-- AI Cards Grid -->
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="100">
            <div class="ai-card">
              <div class="ai-icon">🤖</div>
              <h3>AI Attendance System</h3>
              <p>Automated attendance using facial recognition with 99.9% accuracy. Real-time tracking, instant reports, and parent notifications.</p>
              <ul class="feature-list">
                <li>✓ Multi-face detection</li>
                <li>✓ Temperature screening</li>
                <li>✓ Real-time sync to portal</li>
                <li>✓ Auto-report generation</li>
              </ul>
              <div class="ai-stats">⚡ 0.5s per student | 🎯 99.9% accuracy</div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="200">
            <div class="ai-card">
              <div class="ai-icon">👤</div>
              <h3>Facial Recognition Hub</h3>
              <p>Advanced biometric identification for secure entry, library access, and cafeteria payments. Liveness detection prevents spoofing.</p>
              <ul class="feature-list">
                <li>✓ Liveness detection</li>
                <li>✓ Mask detection alerts</li>
                <li>✓ VIP/Visitor identification</li>
                <li>✓ Access logs & analytics</li>
              </ul>
              <div class="ai-stats">🔒 ISO 27001 | 🧬 128-point mapping</div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="300">
            <div class="ai-card">
              <div class="ai-icon">👣</div>
              <h3>Smart Footfall Analytics</h3>
              <p>Real-time crowd monitoring, heatmaps of high-traffic areas, peak hour analysis, and social distancing alerts.</p>
              <ul class="feature-list">
                <li>✓ Occupancy heatmaps</li>
                <li>✓ Peak time prediction</li>
                <li>✓ Social distancing alerts</li>
                <li>✓ Emergency evacuation insights</li>
              </ul>
              <div class="ai-stats">📊 24/7 live dashboard | 🚨 instant alerts</div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="400">
            <div class="ai-card">
              <div class="ai-icon">📝</div>
              <h3>AI Exam Monitoring</h3>
              <p>Remote proctoring with eye-tracking, suspicious movement detection, and automated violation logging.</p>
              <ul class="feature-list">
                <li>✓ Eye-tracking & gaze detection</li>
                <li>✓ Multiple device detection</li>
                <li>✓ Audio anomaly detection</li>
                <li>✓ Automated violation reports</li>
              </ul>
              <div class="ai-stats">🎥 4K recording | 🤖 AI flagging system</div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="500">
            <div class="ai-card">
              <div class="ai-icon">🗣️</div>
              <h3>AI Voice Assistant</h3>
              <p>24/7 voice-enabled helpdesk for parents & students. Answer queries, send notices, and automate parent-teacher communication.</p>
              <ul class="feature-list">
                <li>✓ Multilingual support</li>
                <li>✓ Fee reminders via voice</li>
                <li>✓ Homework help bot</li>
                <li>✓ Voice-command reports</li>
              </ul>
              <div class="ai-stats">🌐 12+ languages | ⏱️ instant responses</div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="600">
            <div class="ai-card">
              <div class="ai-icon">📈</div>
              <h3>Predictive Analytics</h3>
              <p>Machine learning models predict student performance, dropout risks, and recommend personalized interventions.</p>
              <ul class="feature-list">
                <li>✓ Student success prediction</li>
                <li>✓ Dropout risk alerts</li>
                <li>✓ Personalized learning paths</li>
                <li>✓ Resource optimization</li>
              </ul>
              <div class="ai-stats">🧠 ML models | 📈 95% prediction accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Security & Surveillance Section -->
    <section id="security" class="security-section py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6" data-aos="fade-right">
            <span class="badge bg-danger mb-3">24/7 Intelligent Surveillance</span>
            <h2 class="display-5 fw-bold">Complete Campus Security</h2>
            <p class="lead">AI-powered CCTV analytics for proactive threat detection and response.</p>
            <div class="security-features mt-4">
              <div class="security-item"><span>🔍</span> Real-time weapon detection & alerts</div>
              <div class="security-item"><span>🏃</span> Unusual behavior detection (running, fighting)</div>
              <div class="security-item"><span>🚗</span> License plate recognition for vehicles</div>
              <div class="security-item"><span>⚠️</span> Geo-fencing & instant perimeter alerts</div>
            </div>
            <button class="btn btn-dark mt-4">Request Security Demo →</button>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <div class="security-visual">
              <div class="camera-feed">
                <div class="scan-line"></div>
                <div class="detection-box">⚠️ Motion detected</div>
                <div class="detection-box-2">🧑‍🤝‍🧑 Crowd analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section (Enhanced) -->
    <section id="features" class="features-section py-5">
      <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
          <h2 class="display-5 fw-bold">Comprehensive School Management</h2>
          <p class="lead">Everything you need to run an institution efficiently, powered by AI</p>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" data-aos="flip-left">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">👨‍🎓</div>
                <h5>Student Information System</h5>
                <p>Centralized digital records, health data, and academic history</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3" data-aos="flip-left" data-aos-delay="100">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">💰</div>
                <h5>AI Fee Management</h5>
                <p>Smart payment reminders, late fee prediction, online collection</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3" data-aos="flip-left" data-aos-delay="200">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">📢</div>
                <h5>Smart Notifications</h5>
                <p>AI-personalized announcements via SMS, email, and app</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3" data-aos="flip-left" data-aos-delay="300">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon display-4">📚</div>
                <h5>Digital Library</h5>
                <p>AI recommendations, e-books, and automated check-in/out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section / Video Placeholder -->
    <section id="demo" class="demo-section py-5 bg-dark text-white">
      <div class="container text-center">
        <h2 class="display-5 fw-bold mb-4">See AI in Action</h2>
        <p class="lead mb-5">Watch how our AI solutions streamline attendance, security, and exam monitoring</p>
        <div class="video-placeholder" data-aos="zoom-in">
          <div class="play-button">▶</div>
          <p class="mt-3">Interactive Demo Video (Click to play)</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials py-5">
      <div class="container">
        <h2 class="text-center mb-5">Trusted by Leading Institutions</h2>
        <div class="row g-4">
          <div class="col-md-4" data-aos="fade-up">
            <div class="testimonial-card">
              <p>"The facial recognition attendance saved us 20+ hours weekly. AI proctoring is a game-changer!"</p>
              <div class="mt-3"><strong>— Principal, Delhi Public School</strong></div>
            </div>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div class="testimonial-card">
              <p>"Footfall analytics helped us optimize bus routes and reduce crowding by 40%."</p>
              <div class="mt-3"><strong>— Operations Head, Global Academy</strong></div>
            </div>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div class="testimonial-card">
              <p>"Parents love the real-time security alerts and attendance updates."</p>
              <div class="mt-3"><strong>— Parent Association, Springdale School</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section text-white py-5">
      <div class="container text-center">
        <h2 class="mb-4">Ready to Transform Your School?</h2>
        <p class="lead mb-4">Join 500+ schools already using AI-powered management</p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <router-link to="/login" class="btn btn-light btn-lg">Start Free Trial</router-link>
          <a href="#" class="btn btn-outline-light btn-lg">Schedule AI Consultation</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer bg-dark text-white py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5>🤖 AI School Management</h5>
            <p class="text-muted">Intelligent education, secured by AI</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a href="#features" class="text-muted text-decoration-none">Features</a></li>
              <li><a href="#ai-solutions" class="text-muted text-decoration-none">AI Solutions</a></li>
              <li><a href="#security" class="text-muted text-decoration-none">Security Hub</a></li>
            </ul>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Contact AI Support</h5>
            <p class="text-muted">📧 ai-support@schoolmgmt.com</p>
            <p class="text-muted">📞 +1 (888) AI-SCHOOL</p>
          </div>
        </div>
        <hr />
        <div class="text-center text-muted">
          <p>&copy; 2025 AI School Management System. All rights reserved. Powered by Next-Gen AI.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  mounted() {
    // Load AOS library if not already (assumes you have AOS installed via CDN or npm)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.landing-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Navigation */
.navbar {
  background: linear-gradient(90deg, #1a2a3a 0%, #2c3e50 100%) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,20 L25,30 Z M70,70 L80,70 L75,80 Z M40,80 L50,80 L45,90 Z"/></svg>') repeat;
  pointer-events: none;
}
.highlight {
  background: linear-gradient(120deg, #ffd89b, #c7e9fb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.btn-gradient {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  transition: transform 0.3s;
}
.btn-gradient:hover {
  transform: translateY(-3px);
  color: white;
}
.stats {
  font-size: 1.2rem;
  font-weight: 600;
}
.counter {
  font-size: 1.8rem;
  font-weight: 800;
  margin-right: 0.5rem;
}
.hero-image {
  position: relative;
  height: 300px;
}
.floating-ai, .floating-cam, .floating-analytics {
  position: absolute;
  font-size: 4rem;
  animation: float 4s infinite;
}
.floating-ai { top: 20%; left: 20%; animation-delay: 0s; }
.floating-cam { top: 50%; right: 20%; animation-delay: 1s; }
.floating-analytics { bottom: 20%; left: 40%; animation-delay: 2s; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* AI Cards */
.ai-section {
  background: white;
}
.ai-card {
  background: white;
  border-radius: 28px;
  padding: 2rem;
  box-shadow: 0 20px 35px -15px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0,0,0,0.05);
  height: 100%;
}
.ai-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 45px -20px rgba(0,0,0,0.2);
}
.ai-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.feature-list {
  list-style: none;
  padding-left: 0;
  margin-top: 1rem;
}
.feature-list li {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
.ai-stats {
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px dashed #dee2e6;
  font-size: 0.85rem;
  color: #2c3e50;
  font-weight: 500;
}

/* Security Section */
.security-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%);
}
.security-visual {
  background: #1e2a3a;
  border-radius: 32px;
  padding: 2rem;
  min-height: 300px;
  position: relative;
  overflow: hidden;
}
.camera-feed {
  background: #000;
  height: 100%;
  border-radius: 20px;
  position: relative;
  background-image: linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px);
  background-size: 100% 20px;
}
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00ff99, transparent);
  animation: scan 2s linear infinite;
}
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
.detection-box {
  position: absolute;
  top: 30%;
  left: 20%;
  background: rgba(255,0,0,0.7);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  animation: pulse 1s infinite;
}
.detection-box-2 {
  position: absolute;
  bottom: 20%;
  right: 15%;
  background: rgba(0,255,0,0.7);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}
.security-item {
  margin: 1rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Feature Cards */
.feature-card {
  border: none;
  border-radius: 24px;
  transition: all 0.3s;
  background: white;
}
.feature-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 30px -10px rgba(0,0,0,0.15);
}

/* Video Placeholder */
.demo-section .video-placeholder {
  background: linear-gradient(45deg, #2c3e50, #1a2a3a);
  border-radius: 32px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}
.video-placeholder:hover {
  transform: scale(1.02);
}
.play-button {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}
.play-button:hover {
  background: rgba(255,255,255,0.4);
  transform: scale(1.1);
}

/* Testimonials */
.testimonial-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  font-style: italic;
  border-left: 4px solid #4ecdc4;
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, #2c3e50, #1a2a3a);
}

/* Responsive */
@media (max-width: 768px) {
  .ai-card, .feature-card {
    margin-bottom: 1rem;
  }
  .hero-section .display-4 {
    font-size: 2rem;
  }
  .stats {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>