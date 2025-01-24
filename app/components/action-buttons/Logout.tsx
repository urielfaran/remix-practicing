import { LogOut } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";

function Logout() {
  return (
    <Form method="post" action="/action/logout">
      <Button
        type="submit"
        variant="ghost"
        className="w-full flex items-center justify-start p-0.5"
      >
        <LogOut />
        <span>log out</span>
      </Button>
    </Form>
  );
}

export default Logout;
