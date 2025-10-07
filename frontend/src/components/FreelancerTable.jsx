import styles from '../styles/FreelancerTable.module.css';
import { freelancerApi } from '../services/api';

const FreelancerTable = ({ freelancers, onEdit, onDelete, onArchive, userId,role }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  const handleArchive = async (id, isArchived) => {
    try {
      await freelancerApi.archive(id, !isArchived);
      window.location.reload();
    } catch (error) {
      console.error('Error archiving:', error);
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
            <td className={styles.tableCell}>
              {freelancer.skillsets?.map(s => s.skillName || s).join(', ') || 'No skills'}
            </td>
            <td className={styles.tableCell}>
              {freelancer.hobbies?.map(h => h.hobbyName || h).join(', ') || 'No hobbies'}
            </td>
            <td className={styles.tableCell}>
              {(role === 'Admin' || freelancer.userId == userId) && (
              <button           
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => onEdit(freelancer)}
              >
                Edit
              </button>
              )}
              {(role === 'Admin' || freelancer.userId == userId) && (
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleDelete(freelancer.id, freelancer.username)}
              >
                Delete
              </button>
              )}
              {(role === 'Admin' || freelancer.userId == userId) && ( 
              <button
                onClick={() => handleArchive(freelancer.id, freelancer.isArchived)}
                className={`${styles.actionButton} ${styles.archiveButton}`}
              >
                {freelancer.isArchived ? 'Unarchive' : 'Archive'}
              </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FreelancerTable;
