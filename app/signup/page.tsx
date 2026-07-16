'use client';

import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ArusInovasi CRM</h1>
            <p className="text-gray-600">Invite-Only Registration</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Public Signup Disabled</h2>
            <p className="text-blue-800 mb-4">
              This system uses invite-only registration for security. If you have received an invite email, click the link in that email to create your account.
            </p>
            <p className="text-sm text-blue-700">
              <strong>Don't have an invite?</strong> Ask your administrator to send you one.
            </p>
          </div>

          {error === 'signup_disabled' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                ℹ️ Public signup is disabled. Please use your invite link or contact your admin.
              </p>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">How to Join:</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <span>Admin sends you an invite email</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <span>Click the link in the email</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">3.</span>
                <span>Create your password</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">4.</span>
                <span>Login and start using the CRM</span>
              </li>
            </ol>
          </div>

          
            href="/login"
            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mb-4"
          >
            Back to Login
          </a>

          <p className="text-center text-xs text-gray-500">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
