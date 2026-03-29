<template>
  <div class="manage-fees-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-icon">💰</div>
        <h1 class="hero-title">Fee Management</h1>
        <p class="hero-tagline">Track and manage student fee payments</p>
      </div>
      <div class="hero-actions">
        <button @click="showForm = true" class="add-fee-btn">
          <i class="bi bi-plus-circle"></i>
          Add New Fee
        </button>
      </div>
    </section>

    <!-- Form Section -->
    <section v-if="showForm" class="form-section">
      <div class="container">
        <div class="form-card">
          <div class="form-header">
            <h2>{{ editingId ? 'Edit Fee Record' : 'Create New Fee Record' }}</h2>
            <button @click="cancelEdit" class="close-btn">
              <i class="bi bi-x"></i>
            </button>
          </div>

          <form @submit.prevent="saveFee" class="fee-form">
            <div class="form-row">
              <div class="form-group">
                <label for="studentName">
                  <i class="bi bi-person"></i>
                  Student Name *
                </label>
                <input
                  v-model="form.studentName"
                  type="text"
                  id="studentName"
                  placeholder="Enter student full name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="studentId">
                  <i class="bi bi-card-text"></i>
                  Student ID *
                </label>
                <input
                  v-model="form.studentId"
                  type="text"
                  id="studentId"
                  placeholder="e.g., STU001"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="feeType">
                  <i class="bi bi-tag"></i>
                  Fee Type *
                </label>
                <select v-model="form.feeType" id="feeType" required>
                  <option value="">Select Fee Type</option>
                  <option value="tuition">Tuition Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="uniform">Uniform Fee</option>
                  <option value="activity">Activity Fee</option>
                  <option value="exam">Exam Fee</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="amount">
                  <i class="bi bi-cash"></i>
                  Amount ($) *
                </label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dueDate">
                  <i class="bi bi-calendar"></i>
                  Due Date *
                </label>
                <input v-model="form.dueDate" type="date" id="dueDate" required />
              </div>
              <div class="form-group">
                <label for="status">
                  <i class="bi bi-check-circle"></i>
                  Payment Status *
                </label>
                <select v-model="form.status" id="status" required>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="partial">Partial Payment</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="notes">
                <i class="bi bi-sticky"></i>
                Additional Notes
              </label>
              <textarea
                v-model="form.notes"
                id="notes"
                rows="3"
                placeholder="Any additional information about this fee..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">
                <i class="bi bi-check-circle"></i>
                {{ editingId ? 'Update Fee' : 'Create Fee Record' }}
              </button>
              <button type="button" @click="cancelEdit" class="cancel-btn">
                <i class="bi bi-x-circle"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Summary Section -->
    <section class="summary-section">
      <div class="container">
        <h2>Fee Overview</h2>
        <div class="summary-grid">
          <div class="summary-card total">
            <div class="card-icon">💰</div>
            <div class="card-content">
              <h3>Total Fees</h3>
              <p class="amount">${{ totalFees.toLocaleString() }}</p>
              <span class="card-label">All fee records</span>
            </div>
          </div>

          <div class="summary-card paid">
            <div class="card-icon">✅</div>
            <div class="card-content">
              <h3>Paid</h3>
              <p class="amount">${{ paidFees.toLocaleString() }}</p>
              <span class="card-label">{{ paidPercentage.toFixed(1) }}% of total</span>
            </div>
          </div>

          <div class="summary-card pending">
            <div class="card-icon">⏳</div>
            <div class="card-content">
              <h3>Pending</h3>
              <p class="amount">${{ pendingFees.toLocaleString() }}</p>
              <span class="card-label">{{ pendingCount }} records</span>
            </div>
          </div>

          <div class="summary-card overdue">
            <div class="card-icon">⚠️</div>
            <div class="card-content">
              <h3>Overdue</h3>
              <p class="amount">${{ overdueFees.toLocaleString() }}</p>
              <span class="card-label">{{ overdueCount }} urgent</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fees List Section -->
    <section class="fees-section">
      <div class="container">
        <div class="section-header">
          <h2>All Fee Records</h2>
          <div class="filters">
            <select v-model="filterStatus" @change="applyFilter">
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        </div>

        <div class="fees-grid">
          <div
            v-for="fee in filteredFees"
            :key="fee.id"
            class="fee-card"
            :class="`status-${fee.status}`"
          >
            <div class="fee-header">
              <div class="student-info">
                <h3>{{ fee.studentName }}</h3>
                <p class="student-id">{{ fee.studentId }}</p>
              </div>
              <div class="fee-actions">
                <span class="status-badge" :class="fee.status">
                  <i :class="getStatusIcon(fee.status)"></i>
                  {{ fee.status.charAt(0).toUpperCase() + fee.status.slice(1) }}
                </span>
                <div class="action-buttons">
                  <button @click="editFee(fee)" class="edit-btn" title="Edit">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteFee(fee.id)" class="delete-btn" title="Delete">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="fee-details">
              <div class="detail-item">
                <span class="label">Fee Type:</span>
                <span class="value">{{ getFeeTypeLabel(fee.feeType) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Amount:</span>
                <span class="value amount">${{ fee.amount.toFixed(2) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Due Date:</span>
                <span class="value" :class="{ 'overdue-text': isOverdue(fee.dueDate) }">
                  {{ formatDate(fee.dueDate) }}
                </span>
              </div>
            </div>

            <div v-if="fee.notes" class="fee-notes">
              <p>{{ fee.notes }}</p>
            </div>
          </div>
        </div>

        <div v-if="filteredFees.length === 0" class="empty-state">
          <div class="empty-icon">💰</div>
          <h3>No fee records found</h3>
          <p>{{ filterStatus ? `No ${filterStatus} fees found` : 'Create your first fee record to get started' }}</p>
          <button @click="showForm = true" class="add-fee-btn">
            <i class="bi bi-plus-circle"></i>
            Create First Fee Record
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ManageFees',
  data() {
    return {
      fees: [
        {
          id: 1,
          studentName: 'John Doe',
          studentId: 'STU001',
          feeType: 'tuition',
          amount: 5000,
          dueDate: '2026-04-15',
          status: 'paid',
          notes: 'Full payment received'
        },
        {
          id: 2,
          studentName: 'Jane Smith',
          studentId: 'STU002',
          feeType: 'transport',
          amount: 1000,
          dueDate: '2026-04-15',
          status: 'pending',
          notes: ''
        },
        {
          id: 3,
          studentName: 'Bob Johnson',
          studentId: 'STU003',
          feeType: 'uniform',
          amount: 500,
          dueDate: '2026-03-20',
          status: 'overdue',
          notes: 'Payment reminder sent'
        }
      ],
      showForm: false,
      editingId: null,
      filterStatus: '',
      form: {
        studentName: '',
        studentId: '',
        feeType: '',
        amount: '',
        dueDate: '',
        status: 'pending',
        notes: ''
      }
    }
  },
  computed: {
    totalFees() {
      return this.fees.reduce((sum, fee) => sum + fee.amount, 0)
    },
    paidFees() {
      return this.fees
        .filter(fee => fee.status === 'paid')
        .reduce((sum, fee) => sum + fee.amount, 0)
    },
    pendingFees() {
      return this.fees
        .filter(fee => fee.status === 'pending' || fee.status === 'partial')
        .reduce((sum, fee) => sum + fee.amount, 0)
    },
    overdueFees() {
      return this.fees
        .filter(fee => fee.status === 'overdue')
        .reduce((sum, fee) => sum + fee.amount, 0)
    },
    paidPercentage() {
      return this.totalFees > 0 ? (this.paidFees / this.totalFees) * 100 : 0
    },
    pendingCount() {
      return this.fees.filter(fee => fee.status === 'pending' || fee.status === 'partial').length
    },
    overdueCount() {
      return this.fees.filter(fee => fee.status === 'overdue').length
    },
    filteredFees() {
      if (!this.filterStatus) return this.fees
      return this.fees.filter(fee => fee.status === this.filterStatus)
    }
  },
  methods: {
    saveFee() {
      if (this.editingId) {
        const fee = this.fees.find(f => f.id === this.editingId)
        if (fee) {
          Object.assign(fee, this.form)
        }
      } else {
        this.fees.push({
          id: Date.now(),
          ...this.form
        })
      }
      this.cancelEdit()
    },
    editFee(fee) {
      this.editingId = fee.id
      this.form = { ...fee }
      this.showForm = true
    },
    deleteFee(id) {
      if (confirm('Are you sure you want to delete this fee record?')) {
        this.fees = this.fees.filter(f => f.id !== id)
      }
    },
    cancelEdit() {
      this.showForm = false
      this.editingId = null
      this.form = {
        studentName: '',
        studentId: '',
        feeType: '',
        amount: '',
        dueDate: '',
        status: 'pending',
        notes: ''
      }
    },
    applyFilter() {
      // Filter is applied automatically via computed property
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    isOverdue(dueDate) {
      return new Date(dueDate) < new Date() && this.form.status !== 'paid'
    },
    getStatusIcon(status) {
      const icons = {
        paid: 'bi bi-check-circle-fill',
        pending: 'bi bi-clock',
        overdue: 'bi bi-exclamation-triangle-fill',
        partial: 'bi bi-dash-circle-fill'
      }
      return icons[status] || 'bi bi-circle'
    },
    getFeeTypeLabel(feeType) {
      const labels = {
        tuition: 'Tuition Fee',
        transport: 'Transport Fee',
        uniform: 'Uniform Fee',
        activity: 'Activity Fee',
        exam: 'Exam Fee',
        other: 'Other'
      }
      return labels[feeType] || feeType
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.manage-fees-page {
  width: 100%;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 300px;
}

.hero-content {
  flex: 1;
  animation: fadeInLeft 0.8s ease-out;
}

.hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.hero-actions {
  flex-shrink: 0;
}

.add-fee-btn {
  padding: 0.875rem 2rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.add-fee-btn:hover {
  background-color: white;
  color: #667eea;
  transform: translateY(-2px);
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

/* Form Section */
.form-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.fee-form {
  padding: 2rem;
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
.form-group select::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.cancel-btn {
  padding: 1rem 2rem;
  background: transparent;
  color: #6b7280;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

/* Summary Section */
.summary-section {
  padding: 4rem 2rem;
}

.summary-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.summary-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
}

.summary-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-card.paid {
  border-left: 4px solid #10b981;
}

.summary-card.pending {
  border-left: 4px solid #f59e0b;
}

.summary-card.overdue {
  border-left: 4px solid #dc2626;
}

.card-icon {
  font-size: 3rem;
  opacity: 0.9;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
}

.card-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Fees Section */
.fees-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  color: #333;
  font-size: 2.5rem;
  margin: 0;
}

.filters select {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
}

.fees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.fee-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  border-left: 4px solid #e5e7eb;
}

.fee-card:hover {
  transform: translateY(-4px);
}

.fee-card.status-paid {
  border-left-color: #10b981;
}

.fee-card.status-pending {
  border-left-color: #f59e0b;
}

.fee-card.status-overdue {
  border-left-color: #dc2626;
}

.fee-card.status-partial {
  border-left-color: #8b5cf6;
}

.fee-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e5e7eb;
}

.student-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.2rem;
}

.student-id {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.fee-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.paid {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.overdue {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.partial {
  background-color: #e9d5ff;
  color: #6b21a8;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #f3f4f6;
  color: #667eea;
}

.edit-btn:hover {
  background-color: #667eea;
  color: white;
}

.delete-btn {
  background-color: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #dc2626;
  color: white;
}

.fee-details {
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #6b7280;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
}

.value.amount {
  color: #667eea;
  font-size: 1.1rem;
}

.overdue-text {
  color: #dc2626 !important;
}

.fee-notes {
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.fee-notes p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .fees-grid {
    grid-template-columns: 1fr;
  }

  .fee-header {
    flex-direction: column;
    gap: 1rem;
  }

  .fee-actions {
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
