import Link from "next/link";
export default function Login() {
  return (
    <div>
      <Link href="/api/auth/login">
      <button className="text-4xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
      Login
          </button>
          </Link>
    </div>
  );
}
