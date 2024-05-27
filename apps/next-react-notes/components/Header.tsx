import { signIn, signOut, auth } from "auth";
import Image from "next/image";

function SignButton({
  text,
  otherClass,
}: {
  text: string;
  otherClass?: string;
}) {
  return (
    <button className={`"px-4 py-2 rounded ml-2" ${otherClass}`}>{text}</button>
  );
}

function SignIn({ provider }: any) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <SignButton text="Sign In" otherClass="text-blue-500" />
    </form>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <SignButton text="Sign Out" otherClass="text-red-500" />
    </form>
  );
}

export default async function Header() {
  const session = await auth();
  return (
    <header className="flex justify-around">
      {session?.user ? (
        <div className="flex-1 flex items-center justify-between">
          <span className="flex items-center">
            {session?.user?.image && (
              <Image
                src={session?.user?.image}
                alt="user image"
                width={30}
                height={30}
                className="rounded-full"
              />
            )}
            <span className="ml-1">{session?.user.name}</span>
          </span>
          <SignOut />
        </div>
      ) : (
        <SignIn />
      )}
    </header>
  );
}
