import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";
import { Code, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col overflow-scroll h-full px-5">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 mt-2 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <Zap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-base font-geistSans font-bold">
            Async Interview
          </span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 font-geistSans">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <LoginLink className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </LoginLink>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full mt-5 py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-geistSans font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Easy interviews no stress
            </h1>
            <p className="mx-auto tracking-tight max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Get instant feedback on interviews, no more what did I do wrong or
              how can I improve
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <RegisterLink
                postLoginRedirectURL="/dashboard"
                className="w-full"
              >
                <Button type="submit" className="w-full">
                  Get started
                </Button>
              </RegisterLink>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Start building your dream team today. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full font-mono py-12 bg-gray-100 dark:bg-gray-800">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Users className="size-9 mb-4 text-primary" />
            <h2 className="text-xl font-bold">Asynchronous</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Our AI-powered LLM rates candidates based on skills, performance
              etc.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Code className="size-9 mb-4 text-primary" />
            <h2 className="text-xl font-bold">Skill Showcase</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Deploy in-house and spend less time, money and energy on
              interviews.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Zap className="size-9 mb-4 text-primary" />
            <h2 className="text-xl font-bold">Instant feedback</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              AI powered transcripts and reports will have you improve your
              skills in no time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Hack?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg tracking-tight dark:text-gray-400">
              Join us today and make wonders.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <RegisterLink
                postLoginRedirectURL="/dashboard"
                className="w-full"
              >
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 HackMatch. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </main>
  );
}
