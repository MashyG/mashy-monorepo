import { useFormStatus } from "react-dom";

type SaveButtonProps = {
  formAction: (formdata: FormData) => void;
};
export default function EditButton({ formAction }: SaveButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      className="note-editor-done"
      type="submit"
      formAction={formAction}
      disabled={pending}
      role="menuitem"
    >
      <img
        src="/checkmark.svg"
        width="14px"
        height="10px"
        alt=""
        role="presentation"
      />
      {pending ? "Saving" : "Done"}
    </button>
  );
}
