import { authenticator } from '~/auth/authenticator';
import type { Route } from './+types/logout';
import { redirect } from 'react-router';

export async function action({ request }: Route.ActionArgs)  {
  return await authenticator.logout(request, '/');
}

export async function loader()  {
  return redirect('/');
}


