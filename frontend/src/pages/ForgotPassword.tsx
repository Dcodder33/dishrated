import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setIsSubmitted(true);

      // In development, capture the reset URL for easy testing
      if (response && response.resetUrl) {
        setResetUrl(response.resetUrl);
      }

      toast({
        title: "Reset Link Sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h1>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Didn't receive the email?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your spam/junk folder</li>
                    <li>Make sure the email address is correct</li>
                    <li>Wait a few minutes for delivery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Development Mode: Show Reset URL */}
            {resetUrl && process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-2">Development Mode - Reset URL:</p>
                    <div className="bg-white border rounded p-2 mb-2">
                      <code className="text-xs break-all">{resetUrl}</code>
                    </div>
                    <Link
                      to={resetUrl.replace(window.location.origin, '')}
                      className="inline-flex items-center text-yellow-700 hover:text-yellow-900 font-medium"
                    >
                      Click here to reset password →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                variant="outline"
                className="w-full"
              >
                Try Different Email
              </Button>

              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-foodtruck-teal" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>

          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-foodtruck-teal hover:bg-foodtruck-slate"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Reset Link...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-foodtruck-teal hover:text-foodtruck-slate transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-foodtruck-teal hover:text-foodtruck-slate font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
