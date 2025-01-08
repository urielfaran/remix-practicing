import { LogOut } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";

function Logout() {
  return (
    <Form method="post" action="/action/logout">
      <Button type="submit" variant={'ghost'} className="px-0.5">
        <LogOut />
        {"log out"}
      </Button>
    </Form>
  );
}

export default Logout;
