.chipContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 12px;
  border-radius: 16px;
  background: #eee;
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
}

.chip:hover {
  background: #ddd;
}

.chip.selected {
  background: #ff6b35;
  color: white;
  font-weight: bold;
}
