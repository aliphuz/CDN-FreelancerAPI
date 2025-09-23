import styles from '../styles/FreelancerTable.module.css';

const FreelancerTable = ({ freelancers, onEdit, onDelete }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <table className={styles.table}>
      <thead className={styles.tableHeader}>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Skills</th>
          <th>Hobbies</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {freelancers.map((freelancer) => (
          <tr key={freelancer.id} className={styles.tableRow}>
            <td className={styles.tableCell}>{freelancer.username}</td>
            <td className={styles.tableCell}>{freelancer.email}</td>
            <td className={styles.tableCell}>{freelancer.skillsets?.map(s => s.skillName || s).join(', ') || 'No skills'}</td>
            <td className={styles.tableCell}>{freelancer.hobbies?.map(h => h.hobbyName || h).join(', ') || 'No hobbies'}</td>
            <td className={styles.tableCell}>
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => onEdit(freelancer)}
              >
                Edit
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleDelete(freelancer.id, freelancer.username)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FreelancerTable;