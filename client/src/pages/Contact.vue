<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Contact Us</h1>
        <p class="hero-tagline">Get in touch with our school community</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToContact">
            <i class="bi bi-envelope"></i>
            Send Message
          </button>
          <button class="btn btn-secondary" @click="scrollToMap">
            <i class="bi bi-geo-alt"></i>
            Find Us
          </button>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">📞</div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="contact-info-section">
      <div class="container">
        <h2>Get In Touch</h2>
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">📍</div>
            <h3>Address</h3>
            <p>Jahangira, Jalkaura, Khagaria, Bihar - 851204<br>India</p>
            <a href="#" class="contact-link">
              <i class="bi bi-geo-alt"></i>
              Get Directions
            </a>
          </div>

          <div class="contact-card">
            <div class="contact-icon">📞</div>
            <h3>Phone</h3>
            <p>Main Office: +1 (555) 123-4567<br>Admissions: +1 (555) 123-4568<br>Emergency: +1 (555) 123-4569</p>
            <a href="tel:+15551234567" class="contact-link">
              <i class="bi bi-telephone"></i>
              Call Now
            </a>
          </div>

          <div class="contact-card">
            <div class="contact-icon">✉️</div>
            <h3>Email</h3>
            <p>General: info@school.edu<br>Admissions: admissions@school.edu<br>Support: support@school.edu</p>
            <a href="mailto:info@school.edu" class="contact-link">
              <i class="bi bi-envelope"></i>
              Send Email
            </a>
          </div>

          <div class="contact-card">
            <div class="contact-icon">🕒</div>
            <h3>Office Hours</h3>
            <p>Monday - Friday: 8:00 AM - 5:00 PM<br>Saturday: 9:00 AM - 1:00 PM<br>Sunday: Closed</p>
            <span class="status-badge">Currently Open</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <!-- <section class="contact-form-section" ref="contactSection">
      <div class="container">
        <div class="form-container">
          <div class="form-header">
            <h2>Send us a Message</h2>
            <p>We'd love to hear from you. Fill out the form below and we'll get back to you soon.</p>
          </div>

          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">
                  <i class="bi bi-person"></i>
                  First Name *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  id="firstName"
                  placeholder="Your first name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="lastName">
                  <i class="bi bi-person"></i>
                  Last Name *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  id="lastName"
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">
                  <i class="bi bi-envelope"></i>
                  Email Address *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div class="form-group">
                <label for="phone">
                  <i class="bi bi-telephone"></i>
                  Phone Number
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="subject">
                <i class="bi bi-tag"></i>
                Subject *
              </label>
              <select v-model="form.subject" id="subject" required>
                <option value="">Select a subject</option>
                <option value="admissions">Admissions Inquiry</option>
                <option value="academic">Academic Information</option>
                <option value="fees">Fees & Payments</option>
                <option value="facilities">Facilities & Resources</option>
                <option value="complaint">Complaint/Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">
                <i class="bi bi-chat-text"></i>
                Message *
              </label>
              <textarea
                v-model="form.message"
                id="message"
                rows="6"
                placeholder="Please enter your message here..."
                required
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <i class="bi bi-send"></i>
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
              <button type="button" @click="resetForm" class="reset-btn">
                <i class="bi bi-arrow-counterclockwise"></i>
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </section> -->

    <!-- Map Section -->
    <section class="map-section" ref="mapSection">
      <div class="container">
        <h2>Find Our Location</h2>
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.123456789012!2d86.3696621!3d25.5055189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f1fb30c498404d%3A0x519d958dc8de8e99!2sDr%20R.S.%20Central%20school!5e0!3m2!1sen!2s!4v1711795200000!5m2!1sen!2s"
            width="100%"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Dr R.S. Central School Location">
          </iframe>
        </div>
      </div>
    </section>

    <!-- Quick Contact -->
    <!-- <section class="quick-contact-section">
      <div class="container">
        <h2>Need Immediate Help?</h2>
        <div class="quick-contact-grid">
          <div class="quick-contact-card">
            <div class="contact-icon">🎓</div>
            <h3>Student Support</h3>
            <p>For current students and academic inquiries</p>
            <a href="tel:+15551234567" class="quick-contact-btn">
              <i class="bi bi-telephone"></i>
              Call Support
            </a>
          </div>

          <div class="quick-contact-card">
            <div class="contact-icon">👨‍👩‍👧‍👦</div>
            <h3>Parent Portal</h3>
            <p>Access grades, announcements, and more</p>
            <router-link to="/admin/login" class="quick-contact-btn">
              <i class="bi bi-person-circle"></i>
              Parent Login
            </router-link>
          </div>

          <div class="quick-contact-card">
            <div class="contact-icon">📚</div>
            <h3>Library</h3>
            <p>Research assistance and book reservations</p>
            <a href="mailto:library@school.edu" class="quick-contact-btn">
              <i class="bi bi-envelope"></i>
              Contact Library
            </a>
          </div>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      isSubmitting: false
    }
  },
  methods: {
    scrollToContact() {
      this.$refs.contactSection?.scrollIntoView({ behavior: 'smooth' })
    },
    scrollToMap() {
      this.$refs.mapSection?.scrollIntoView({ behavior: 'smooth' })
    },
    async submitForm() {
      this.isSubmitting = true

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      alert('Thank you for your message! We will get back to you within 24 hours.')
      this.resetForm()
      this.isSubmitting = false
    },
    resetForm() {
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.contact-page {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(
    to right,
    #FF671F 0%,
    #FFD6BF 25%,
    #FFFFFF 50%,
    #CFE8D9 75%,
    #046A38 100%
  );
  color: black;
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
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* Contact Info Section */
.contact-info-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-info-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.contact-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.contact-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Contact Form Section */
.contact-form-section {
  padding: 4rem 2rem;
}

.contact-form-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 1.1rem;
}

.contact-form {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group label i {
  color: #667eea;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafbfc;
  color: #333;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.submit-btn {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-btn {
  padding: 1rem 3rem;
  background: transparent;
  color: #6b7280;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

/* Map Section */
.map-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.map-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.map-container {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-container iframe {
  width: 100%;
  height: 450px;
  border: 0;
  border-radius: 12px;
}

/* Quick Contact Section */
.quick-contact-section {
  padding: 4rem 2rem;
}

.quick-contact-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.quick-contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.quick-contact-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.quick-contact-card:hover {
  transform: translateY(-4px);
}

.quick-contact-card .contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.quick-contact-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.quick-contact-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.quick-contact-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.quick-contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
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

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-form {
    padding: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .reset-btn {
    width: 100%;
  }

  .quick-contact-grid {
    grid-template-columns: 1fr;
  }

  .map-container iframe {
    height: 300px;
  }
}
</style>