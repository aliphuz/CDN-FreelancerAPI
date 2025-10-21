import { useEffect, useState } from "react";
import styles from "../styles/HobbyManagement.module.css";
import { skillsetApi } from "../services/api";
import { useNavigate } from 'react-router-dom';

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", skillDescription: "" });
  const role = localStorage.getItem("role");
  const [editingSkill, setEditingSkill] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await skillsetApi.getSkillset();
      setSkills(res.data);
    } catch (err) {
      console.error("Error loading skills:", err);
    }
  };

    const handleback = () => {
    navigate('/');
  }

  const handleCreate = async (e) => {
    e.preventDefault(); 

    try {
      await skillsetApi.create({
        name: newSkill.name,
        skillDescription: newSkill.skillDescription,
      });

      await loadSkills();
      setNewSkill({ name: "", skillDescription: "" });
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  };
  const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        await skillsetApi.update(editingSkill.id, {
          skillName: editingSkill.skillName,
          skillDescription: editingSkill.skillDescription,
        });
        setEditingSkill(null);
        await loadSkills();
      } catch (err) {
        alert("Failed to update skill");
        console.error(err);
      }
    };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await skillsetApi.delete(id);
      await loadSkills();
    } catch (err) {
      alert("Failed to delete skill");
    }
  };

  if (role !== "Admin") {
    return <div className={styles.notAllowed}>Access Denied — Admins Only</div>;
  }

  return (
    <div className={styles.container}>
        <button onClick={handleback} className={styles.backButton}>← Back to Dashboard</button>
      <h2>🎯 Skill Management</h2>

      <form className={styles.form} onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Skill Name"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Skill Description"
          value={newSkill.skillDescription}
          onChange={(e) =>
            setNewSkill({ ...newSkill, skillDescription: e.target.value })
          }
        />
        <button type="submit">Add Skill</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Skill Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.id}</td>
              <td>{skill.skillName}</td>
              <td>{skill.skillDescription || "—"}</td>
              <td>
                <button
                onClick={() => setEditingSkill(skill)}
                className={styles.updateButton}
                >
                Edit
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
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
            {editingSkill && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h3>Edit Skill</h3>
                  <form onSubmit={handleUpdate}>
                    <input
                      type="text"
                      value={editingSkill.skillName}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, skillName: e.target.value })
                      }
                      required
                    />
                    <textarea
                      value={editingSkill.skillDescription}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, skillDescription: e.target.value })
                      }
                      placeholder="Skill description"
                    />
                    <div className={styles.modalActions}>
                      <button type="submit" className={styles.saveButton}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSkill(null)}
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

export default SkillManagement;
