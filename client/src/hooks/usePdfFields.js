import { useState } from "react";

export function usePdfFields() {
  const [fields, setFields] = useState([]);

  const addField = (field) => {
    setFields((prev) => [...prev, field]);
  };

  const updateField = (id, partial) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...partial } : f))
    );
  };

  const clearFields = () => setFields([]);

  return { fields, addField, updateField, clearFields };
}
