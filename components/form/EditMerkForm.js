import React, { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";

const EditMerkForm = ({ item, onEdit, onClose }) => {
  const [name, setName] = useState(item ? item.nama : "");

  useEffect(() => {
    if (item) {
      setName(item.nama);
    }
  }, [item]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }
    onEdit({ ...item, nama: name });
    onClose();
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditMerkForm;
