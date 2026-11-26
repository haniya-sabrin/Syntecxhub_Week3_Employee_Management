import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/employees";

const emptyForm = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  salary: "",
  joiningDate: "",
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (employee) => {
    setForm({
      ...employee,
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
    });
    setEditingId(employee._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    } catch {
      alert("Unable to delete employee.");
    }
  };

  const departments = [
    "All",
    ...new Set(employees.map((e) => e.department).filter(Boolean)),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      `${employee.name} ${employee.email} ${employee.employeeId} ${employee.department} ${employee.designation}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All" ||
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const initials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const colors = ["mint", "blue", "orange", "purple", "pink"];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-symbol">E</div>
          <div>
            <h2>EmployEase</h2>
            <span>PEOPLE MANAGEMENT</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav className="side-nav">
          <div className="nav-item active">
            <span>▦</span> Dashboard
          </div>
          <div className="nav-item">
            <span>♙</span> Employees
            <span className="nav-count">{employees.length}</span>
          </div>
          <div className="nav-item">
            <span>▤</span> Departments
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>People first.</strong>
            <p>Build a better workplace, one employee at a time.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>HR Manager</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
          <div className="header-right">
            <span className="system-status"><i></i> System Online</span>
            <div className="header-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          <section className="hero-section">
            <div>
              <div className="date-label">PEOPLE & CULTURE</div>
              <h1>Your people, <span>your strength.</span></h1>
              <p>Get a complete overview of your workforce and manage your team effortlessly.</p>
            </div>

            <button className="primary-button" onClick={openAddForm}>
              <span>＋</span> Add New Employee
            </button>
          </section>

          <section className="stats-grid">
            <div className="metric-card metric-dark">
              <div className="metric-top">
                <span>Total Employees</span>
                <span className="metric-icon">♙</span>
              </div>
              <h2>{employees.length.toString().padStart(2, "0")}</h2>
              <div className="metric-bottom">People in your organization</div>
              <div className="metric-decoration"></div>
            </div>

            <div className="metric-card">
              <div className="metric-top">
                <span>Departments</span>
                <span className="metric-icon icon-mint">▦</span>
              </div>
              <h2>{new Set(employees.map((e) => e.department)).size.toString().padStart(2, "0")}</h2>
              <div className="metric-bottom">Different working teams</div>
            </div>

            <div className="metric-card">
              <div className="metric-top">
                <span>Monthly Payroll</span>
                <span className="metric-icon icon-orange">₹</span>
              </div>
              <h2 className="payroll-value">
                ₹{employees.reduce((total, e) => total + (Number(e.salary) || 0), 0).toLocaleString("en-IN")}
              </h2>
              <div className="metric-bottom">Combined employee salaries</div>
            </div>

            <div className="metric-card">
              <div className="metric-top">
                <span>Directory Status</span>
                <span className="metric-icon icon-blue">✓</span>
              </div>
              <h2 className="status-value">Active</h2>
              <div className="metric-bottom">Employee records available</div>
            </div>
          </section>

          <section className="directory-panel">
            <div className="panel-heading">
              <div>
                <div className="section-kicker">YOUR ORGANIZATION</div>
                <h2>Employee Directory</h2>
                <p>All your people, organized in one place.</p>
              </div>
              <div className="employee-total">
                <strong>{filteredEmployees.length}</strong>
                <span> RECORDS</span>
              </div>
            </div>

            <div className="directory-toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  placeholder="Search name, ID, email or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="department-filter"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department === "All" ? "All Departments" : department}
                  </option>
                ))}
              </select>
            </div>

            <div className="employee-table-wrap">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>EMPLOYEE ID</th>
                    <th>DEPARTMENT</th>
                    <th>DESIGNATION</th>
                    <th>MONTHLY SALARY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="empty-state">Loading employee records...</td>
                    </tr>
                  ) : filteredEmployees.map((employee, index) => (
                    <tr key={employee._id}>
                      <td>
                        <div className="employee-cell">
                          <div className={`employee-avatar ${colors[index % colors.length]}`}>
                            {initials(employee.name)}
                          </div>
                          <div className="employee-info">
                            <strong>{employee.name}</strong>
                            <span>{employee.email}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="employee-id">{employee.employeeId}</span></td>
                      <td><span className="department-tag">{employee.department}</span></td>
                      <td className="designation-cell">{employee.designation}</td>
                      <td className="salary-cell">₹{Number(employee.salary).toLocaleString("en-IN")}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-edit" onClick={() => handleEdit(employee)}>Edit</button>
                          <button className="action-delete" onClick={() => handleDelete(employee._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-icon">♙</div>
                        <strong>No employees found</strong>
                        <p>Try another search or add your first employee.</p>
                        <button className="empty-add" onClick={openAddForm}>＋ Add Employee</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="page-footer">
            <span>EMPLOYEASE © 2026</span>
            <span>Designed for better workplaces <b>✦</b></span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <form className="employee-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <div className="form-heading">
              <div>
                <div className="section-kicker">EMPLOYEE DETAILS</div>
                <h2>{editingId ? "Update employee" : "Add new employee"}</h2>
                <p>Fill in the details below to manage your team.</p>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="form-grid">
              {[
                ["employeeId", "Employee ID", "text"],
                ["name", "Full Name", "text"],
                ["email", "Email Address", "email"],
                ["phone", "Phone Number", "tel"],
                ["department", "Department", "text"],
                ["designation", "Designation", "text"],
                ["salary", "Monthly Salary (₹)", "number"],
                ["joiningDate", "Joining Date", "date"],
              ].map(([name, label, type]) => (
                <label key={name}>
                  <span>{label}</span>
                  <input
                    name={name}
                    type={type}
                    value={form[name] || ""}
                    onChange={handleChange}
                    min={name === "salary" ? "0" : undefined}
                    required
                  />
                </label>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="submit-btn" type="submit">
                {editingId ? "Save Changes →" : "Create Employee →"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;