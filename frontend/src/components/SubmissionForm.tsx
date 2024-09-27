import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SubmissionForm() {
  const { register, handleSubmit } = useForm();
  const [formData, setFormData] = useState<any>(null);

  const onSubmit = (data: any) => {
    setFormData(data);  // Set the form data to display it or send it somewhere
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">Title</label>
        <input
          {...register("title")}
          placeholder="Title"
          defaultValue="" // Default value to avoid uncontrolled input warning
        />
        <p>
          <label htmlFor="authors">Authors</label>
          <input
            {...register("authors")}
            placeholder="Authors"
            defaultValue="" // Default value
          />
        </p>
        <p>
          <label htmlFor="source">Source</label>
          <input
            {...register("source")}
            placeholder="Source"
            defaultValue="" // Default value
          />
        </p>
        <p>
          <label htmlFor="pubyear">Publication Year</label>
          <input
            {...register("pubyear")}
            placeholder="Publication Year"
            defaultValue="" // Default value
            type="number" // Ensures this field only accepts numbers
          />
        </p>
        <p>
          <label htmlFor="doi">DOI</label>
          <input
            {...register("doi")}
            placeholder="DOI"
            defaultValue="" // Default value
          />
        </p>
        <p>
          <label htmlFor="linked_discussion">Linked SE Practice</label>
          <select {...register("linked_discussion")} defaultValue="">
            <option value="">Select SE practice...</option>
            <option value="TDD">TDD</option>
            <option value="Mob Programming">Mob Programming</option>
          </select>
        </p>
        <input type="submit" />
      </form>

      {/* Display the submitted form data */}
      {formData && (
        <div>
          <h2>Form Submission Data:</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
