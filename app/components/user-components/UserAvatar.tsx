import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  avatarUrl: string | null;
  username: string;
}

function UserAvatar({ avatarUrl, username }: UserAvatarProps) {
  const userNameCaps = processuserName(username);

  return (
    <Avatar className="h-6 w-6 rounded-lg">
      <AvatarImage src={avatarUrl?.toString()} alt={userNameCaps} />
      <AvatarFallback className="rounded-lg">{userNameCaps}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;

function processuserName(input: string): string {
  if (input.includes(" ")) {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  } else {
    return input.slice(0, 2).toUpperCase();
  }
}
