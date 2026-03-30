<template>
  <div class="dashboard-home">
    <div class="page-header mb-5">
      <h1>Dashboard</h1>
      <p class="text-muted">Welcome back! Here's your school overview.</p>
    </div>

    <!-- Statistics Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-6 col-lg-3">
        <div class="stat-card card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Total Students</p>
                <h3 class="mb-0">1,250</h3>
              </div>
              <span class="display-6">👨‍🎓</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Classes</p>
                <h3 class="mb-0">45</h3>
              </div>
              <span class="display-6">📚</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Pending Fees</p>
                <h3 class="mb-0">₹45,000</h3>
              </div>
              <span class="display-6">💰</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Notice Boards</p>
                <h3 class="mb-0">28</h3>
              </div>
              <span class="display-6">📢</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Fee Collection This Month</h5>
          </div>
          <div class="card-body">
            <div id="feeChart" class="chart-placeholder">
              <p class="text-muted text-center py-5">📊 Chart rendering area</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Student Enrollment Trend</h5>
          </div>
          <div class="card-body">
            <div id="enrollmentChart" class="chart-placeholder">
              <p class="text-muted text-center py-5">📊 Chart rendering area</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="row g-4 mt-4">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Recent Students</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Raj Kumar</td>
                    <td>10-A</td>
                    <td><span class="badge bg-success">Active</span></td>
                  </tr>
                  <tr>
                    <td>Priya Singh</td>
                    <td>9-B</td>
                    <td><span class="badge bg-success">Active</span></td>
                  </tr>
                  <tr>
                    <td>Arjun Patel</td>
                    <td>11-C</td>
                    <td><span class="badge bg-danger">Inactive</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Pending Payments</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Raj Kumar</td>
                    <td>₹5,000</td>
                    <td>2024-04-15</td>
                  </tr>
                  <tr>
                    <td>Priya Singh</td>
                    <td>₹10,000</td>
                    <td>2024-04-20</td>
                  </tr>
                  <tr>
                    <td>Arjun Patel</td>
                    <td>₹5,500</td>
                    <td>2024-04-10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardHome',
  data() {
    return {
      stats: {
        totalStudents: 1250,
        classes: 45,
        pendingFees: 45000,
        noticeBoards: 28
      }
    };
  }
};
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #3498db;
  padding-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-card {
  border: none;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-card .card-body {
  padding: 1.5rem;
}

.chart-placeholder {
  background-color: #f8f9fa;
  border-radius: 8px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}
</style>
