import { Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "~/components/ui/dialog";
import { ComponentType, PropsWithChildren } from "react";


/**
 * `EditDialog` is a reusable component that displays a modal dialog for editing a user. 
 * It wraps a form component passed as a prop, which handles the form fields and submission.
 * The dialog opens when the user clicks the "edit" button (represented by an edit icon).
 * 
 * This component is intended for scenarios where you need a modal to edit data, such as user information, 
 * by rendering a provided form component inside a modal dialog.
 * 
 * @template C - The type of the form component being used (e.g., a form to edit a user).
 * 
 * @param {EditDialogProps<C>} props - The properties for the dialog.
 * @param {C} props.FormComponent - The form component that will be rendered inside the dialog.
 * @param {React.ComponentProps<C>} props.formComponentProps - The props to pass to the form component.
 * 
 * @returns {JSX.Element} The rendered `EditDialog` component, which includes the edit button 
 * and the dialog content.
 * 
 * @example
 * ```tsx
 * <EditDialog
 *   FormComponent={UserForm}
 *   formComponentProps={{ userData, onSubmit: handleSubmit }}
 * />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface EditDialogProps<C extends ComponentType<any>>
  extends PropsWithChildren {
  FormComponent: C;
  formComponentProps: React.ComponentProps<C>;
}
/**
 * `EditDialog` component to render a modal dialog with an editable form.
 *
 * @param {EditDialogProps<C>} props - The properties for the dialog, including the form component and its props.
 * @returns The rendered dialog with the form.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditDialog<C extends ComponentType<any>>({
  FormComponent,
  formComponentProps,
}: EditDialogProps<C>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button key="edit" variant={"ghost"} className="rounded-full">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">ערוך משתמש</DialogTitle>
        </DialogHeader>
        <FormComponent {...formComponentProps} />
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
