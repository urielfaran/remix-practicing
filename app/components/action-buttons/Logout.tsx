import { Form } from "react-router";
import { Button } from "~/components/ui/button";

function Logout() {
  return (
    <Form method="post" action="/action/logout">
      <Button type="submit" className="w-32">
        {"log out"}
      </Button>
    </Form>
  );
}

export default Logout;
