import UserForm from "@/components/UserForm";
import LoginForm from "@/components/LoginForm";
import UserList from "@/components/UserList";

export default function Home() {
  return (
    <>
      <LoginForm />
      <UserForm />
      <UserList />
    </>
  );
}
