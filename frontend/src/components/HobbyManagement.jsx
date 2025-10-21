import { useEffect, useState } from "react";
import styles from "../styles/HobbyManagement.module.css";
import { hobbyApi } from "../services/api";
import { useNavigate } from 'react-router-dom';


const HobbyManagement = () => {
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState({ hobbyName: "", hobbyDescription: "" });
  const [editingHobby, setEditingHobby] = useState(null); // for modal
  const role = localStorage.getItem("role");
  const navigate = useNavigate();


  useEffect(() => {
    loadHobbies();
  }, []);

  const loadHobbies = async () => {
    try {
      const res = await hobbyApi.getHobby();
      setHobbies(res.data);
    } catch (err) {
      console.error("Error loading hobbies:", err);
    }
  };

  const handleback = () => {
    navigate('/');
  }
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await hobbyApi.CreateHobby({
        name: newHobby.hobbyName,
        hobbyDescription: newHobby.hobbyDescription,
      });
      setNewHobby({ hobbyName: "", hobbyDescription: "" });
      await loadHobbies();
    } catch (err) {
      alert("Failed to create hobby");
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await hobbyApi.updateHobby(editingHobby.id, {
        hobbyName: editingHobby.hobbyName,
        hobbyDescription: editingHobby.hobbyDescription,
      });
      setEditingHobby(null);
      await loadHobbies();
    } catch (err) {
      alert("Failed to update hobby");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hobby?")) return;
    try {
      await hobbyApi.DeleteHobby(id);
      await loadHobbies();
    } catch (err) {
      alert("Failed to delete hobby");
    }
  };

  if (role !== "Admin") {
    return <div className={styles.notAllowed}>Access Denied — Admins Only</div>;
  }

  return (
    <div className={styles.container}>
        <button onClick={handleback} className={styles.backButton}>← Back to Dashboard</button>
      <h2>🎯 Hobby Management</h2>

      <form className={styles.form} onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Hobby Name"
          value={newHobby.hobbyName}
          onChange={(e) => setNewHobby({ ...newHobby, hobbyName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Hobby Description"
          value={newHobby.hobbyDescription}
          onChange={(e) => setNewHobby({ ...newHobby, hobbyDescription: e.target.value })}
        />
        <button type="submit">Add Hobby</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hobby Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hobbies.map((hobby) => (
            <tr key={hobby.id}>
              <td>{hobby.id}</td>
              <td>{hobby.hobbyName}</td>
              <td>{hobby.hobbyDescription || "—"}</td>
              <td>
                <button
                  onClick={() => setEditingHobby(hobby)}
                  className={styles.updateButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hobby.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Edit Modal */}
      {editingHobby && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Hobby</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editingHobby.hobbyName}
                onChange={(e) =>
                  setEditingHobby({ ...editingHobby, hobbyName: e.target.value })
                }
                required
              />
              <textarea
                value={editingHobby.hobbyDescription}
                onChange={(e) =>
                  setEditingHobby({ ...editingHobby, hobbyDescription: e.target.value })
                }
                placeholder="Hobby description"
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingHobby(null)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HobbyManagement;
