
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl"; // Add 'xl' to the allowed sizes
}

const UserAvatar = ({ user, size = "md" }: UserAvatarProps) => {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "md":
        return "h-10 w-10";
      case "lg":
        return "h-12 w-12";
      case "xl":
        return "h-16 w-16"; // Add a new size class for 'xl'
      default:
        return "h-10 w-10";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Avatar className={getSizeClass()}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
