import styles from '../styles/FreelancerTable.module.css';
import { freelancerApi } from '../services/api';

const FreelancerTable = ({ freelancers, onEdit, onDelete, onArchive, userId, role }) => {
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

  const renderTagList = (items, labelFn) => {
    if (!items || items.length === 0) return 'None';
    const visible = items.slice(0, 3);
    const hiddenCount = items.length - visible.length;

    return (
      <div className={styles.tagContainer}>
        {visible.map((item, i) => (
          <span key={i} className={styles.tag}>
            {labelFn(item)}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className={styles.moreTag}>+{hiddenCount} more</span>
        )}
      </div>
    );
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
              {renderTagList(
                freelancer.skillsets,
                (s) => s.skillDescription ? `${s.skillName} (${s.skillDescription})` : s.skillName
              )}
            </td>
            <td className={styles.tableCell}>
              {renderTagList(
                freelancer.hobbies,
                (h) => h.hobbyDescription ? `${h.hobbyName} (${h.hobbyDescription})` : h.hobbyName
              )}
            </td>
            <td className={`${styles.tableCell} ${styles.actions}`}>
              {(role === 'Admin' || freelancer.userId == userId) && (
                <>
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
                  <button
                    onClick={() => handleArchive(freelancer.id, freelancer.isArchived)}
                    className={`${styles.actionButton} ${styles.archiveButton}`}
                  >
                    {freelancer.isArchived ? 'Unarchive' : 'Archive'}
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FreelancerTable;
