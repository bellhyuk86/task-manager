import LoginForm from "@/component/auth/loginForm";

export const metadata = {
  title: '로그인 - Task Manager',
  description: 'Task Manager 로그인 페이지',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            계정에 로그인하거나 소셜 로그인을 이용하세요
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
