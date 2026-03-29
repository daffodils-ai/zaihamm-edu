<template>
  <div class="admission">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Join Our School</h1>
        <p class="hero-tagline">Begin your journey towards excellence and success</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToForm">Apply Now</button>
          <button class="btn btn-secondary">Download Form</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">🎓</div>
      </div>
    </section>

    <!-- Process Overview -->
    <section class="process-section">
      <div class="container">
        <h2>Admission Process</h2>
        <div class="process-steps">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>Application</h3>
            <p>Submit your application form with required documents</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>Assessment</h3>
            <p>Entrance test and interview (grade-specific)</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>Review</h3>
            <p>Application review by admission committee</p>
          </div>
          <div class="step-card">
            <div class="step-number">4</div>
            <h3>Decision</h3>
            <p>Admission decision and enrollment</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Eligibility Section -->
    <section class="eligibility-section">
      <div class="container">
        <h2>Eligibility Criteria</h2>
        <div class="eligibility-content">
          <div class="eligibility-info">
            <div class="info-card">
              <h3>Age Requirements</h3>
              <ul>
                <li><strong>Nursery:</strong> 3-4 years</li>
                <li><strong>Kindergarten:</strong> 4-5 years</li>
                <li><strong>Primary (Grades 1-5):</strong> 5-10 years</li>
                <li><strong>Middle School (Grades 6-8):</strong> 10-13 years</li>
                <li><strong>High School (Grades 9-10):</strong> 13-15 years</li>
                <li><strong>Senior Secondary (Grades 11-12):</strong> 15-17 years</li>
              </ul>
            </div>
            <div class="info-card">
              <h3>Academic Requirements</h3>
              <ul>
                <li>Previous school transcripts</li>
                <li>Transfer certificate (if applicable)</li>
                <li>Medical fitness certificate</li>
                <li>Character certificate</li>
                <li>Birth certificate</li>
              </ul>
            </div>
          </div>
          <div class="eligibility-image">
            <div class="image-placeholder">📚</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documents Section -->
    <section class="documents-section">
      <div class="container">
        <h2>Required Documents</h2>
        <div class="documents-grid">
          <div class="document-card">
            <div class="document-icon">📄</div>
            <h3>Application Form</h3>
            <p>Completed admission application form</p>
          </div>
          <div class="document-card">
            <div class="document-icon">📋</div>
            <h3>Academic Records</h3>
            <p>Report cards from previous 2 years</p>
          </div>
          <div class="document-card">
            <div class="document-icon">🆔</div>
            <h3>ID Proof</h3>
            <p>Parent and student identification</p>
          </div>
          <div class="document-card">
            <div class="document-icon">🏠</div>
            <h3>Address Proof</h3>
            <p>Utility bills or residence proof</p>
          </div>
          <div class="document-card">
            <div class="document-icon">💉</div>
            <h3>Medical Certificate</h3>
            <p>Doctor's fitness certificate</p>
          </div>
          <div class="document-card">
            <div class="document-icon">📸</div>
            <h3>Photographs</h3>
            <p>Recent passport-size photos</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Important Dates -->
    <section class="dates-section">
      <div class="container">
        <h2>Important Dates</h2>
        <div class="dates-grid">
          <div class="date-card">
            <div class="date-icon">📅</div>
            <h3>Application Period</h3>
            <p class="date">January 1 - March 31, 2026</p>
            <p>Submit applications for next academic year</p>
          </div>
          <div class="date-card">
            <div class="date-icon">✏️</div>
            <h3>Entrance Test</h3>
            <p class="date">April 15, 2026</p>
            <p>Written assessment for eligible candidates</p>
          </div>
          <div class="date-card">
            <div class="date-icon">🎤</div>
            <h3>Interviews</h3>
            <p class="date">April 20-25, 2026</p>
            <p>Parent and student interviews</p>
          </div>
          <div class="date-card">
            <div class="date-icon">📢</div>
            <h3>Results</h3>
            <p class="date">May 1, 2026</p>
            <p>Admission decisions announced</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Form Section -->
    <section class="form-section" ref="formSection">
      <div class="container">
        <h2>Apply Now</h2>
        <div class="form-container">
          <form @submit.prevent="submitApplication" class="application-form">
            <div class="form-row">
              <div class="form-group">
                <label for="studentName">Student Full Name *</label>
                <input v-model="form.studentName" type="text" id="studentName" required />
              </div>
              <div class="form-group">
                <label for="dob">Date of Birth *</label>
                <input v-model="form.dob" type="date" id="dob" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="grade">Applying for Grade *</label>
                <select v-model="form.grade" id="grade" required>
                  <option value="">Select Grade</option>
                  <option value="nursery">Nursery</option>
                  <option value="kg">Kindergarten</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
              <div class="form-group">
                <label for="gender">Gender *</label>
                <select v-model="form.gender" id="gender" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="fatherName">Father's Name *</label>
                <input v-model="form.fatherName" type="text" id="fatherName" required />
              </div>
              <div class="form-group">
                <label for="motherName">Mother's Name *</label>
                <input v-model="form.motherName" type="text" id="motherName" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input v-model="form.email" type="email" id="email" required />
              </div>
              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input v-model="form.phone" type="tel" id="phone" required />
              </div>
            </div>

            <div class="form-group full-width">
              <label for="address">Address *</label>
              <textarea v-model="form.address" id="address" rows="3" required></textarea>
            </div>

            <div class="form-group full-width">
              <label for="previousSchool">Previous School (if any)</label>
              <input v-model="form.previousSchool" type="text" id="previousSchool" />
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn">Submit Application</button>
              <button type="button" @click="resetForm" class="reset-btn">Reset Form</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h3>What is the admission fee?</h3>
            <p>The admission fee varies by grade. Please contact the admission office for detailed fee structure.</p>
          </div>
          <div class="faq-item">
            <h3>Is there an entrance test for all grades?</h3>
            <p>Entrance tests are conducted for Grades 1 and above. Nursery and Kindergarten admissions are based on interaction and availability.</p>
          </div>
          <div class="faq-item">
            <h3>Can I apply for multiple grades?</h3>
            <p>Each application is for a specific grade. Multiple applications can be submitted if needed.</p>
          </div>
          <div class="faq-item">
            <h3>What is the acceptance rate?</h3>
            <p>Our acceptance rate varies by grade and availability. We strive to accommodate all eligible candidates.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Admission',
  data() {
    return {
      form: {
        studentName: '',
        dob: '',
        grade: '',
        gender: '',
        fatherName: '',
        motherName: '',
        email: '',
        phone: '',
        address: '',
        previousSchool: ''
      }
    }
  },
  methods: {
    scrollToForm() {
      this.$refs.formSection?.scrollIntoView({ behavior: 'smooth' })
    },
    submitApplication() {
      // Handle form submission
      alert('Application submitted successfully! We will contact you soon.')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        studentName: '',
        dob: '',
        grade: '',
        gender: '',
        fatherName: '',
        motherName: '',
        email: '',
        phone: '',
        address: '',
        previousSchool: ''
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.admission {
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

/* Process Section */
.process-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.process-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.step-number {
  width: 50px;
  height: 50px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.step-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.step-card p {
  color: #666;
  line-height: 1.6;
}

/* Eligibility Section */
.eligibility-section {
  padding: 4rem 2rem;
}

.eligibility-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.eligibility-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.eligibility-info {
  display: grid;
  gap: 2rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.info-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-card li {
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.image-placeholder {
  font-size: 6rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Documents Section */
.documents-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.documents-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.document-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.document-card:hover {
  transform: translateY(-4px);
}

.document-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.document-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.document-card p {
  color: #666;
  line-height: 1.6;
}

/* Dates Section */
.dates-section {
  padding: 4rem 2rem;
}

.dates-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.dates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.date-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.date-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.date-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.date {
  color: #667eea;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.date-card p {
  color: #666;
  line-height: 1.6;
}

/* Form Section */
.form-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.form-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.application-form {
  background: white;
  padding: 3rem;
  border-radius: 8px;
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

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  color: #333;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.submit-btn {
  padding: 1rem 3rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.reset-btn {
  padding: 1rem 3rem;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #667eea;
  color: white;
}

/* FAQ Section */
.faq-section {
  padding: 4rem 2rem;
}

.faq-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.faq-item h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.faq-item p {
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

  .process-steps,
  .documents-grid,
  .dates-grid,
  .faq-grid {
    grid-template-columns: 1fr;
  }

  .eligibility-content {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .application-form {
    padding: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .reset-btn {
    width: 100%;
  }
}
</style>
