import { applicationName, companyOwnerNickName } from "@/app-config";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <footer className="border-t bg-gray-100 dark:bg-background">
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-12 md:p-8 lg:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-3">
            <div className="flex flex-col">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                {applicationName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Transform your ideas into stunning visuals with our AI image generation tool, following content guidelines for safe and high-quality results.
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Support
              </h3>
              <ul className="text-sm text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a 
                    href="mailto:support@tooldashai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-primary transition-colors"
                  >
                    support@tooldashai.com
                  </a>
                </li>
                <li className="mb-4">
                  <Link href="/license" className="hover:underline hover:text-primary transition-colors">
                    License
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h3>
              <ul className="text-sm text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="/privacy" className="hover:underline hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/terms-of-service" className="hover:underline hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/refund-policy" className="hover:underline hover:text-primary transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <footer className="py-6 px-5 border-t">
        <div className="text-center">
          <span className="block text-sm text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} <Link href="/" className="hover:text-primary transition-colors">{applicationName}</Link>. All Rights Reserved.
            Built with <span className="text-red-500">❤️</span> by {companyOwnerNickName}
          </span>
        </div>
      </footer>
    </>
  );
}
