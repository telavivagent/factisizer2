export const metadata = {
  title: 'Privacy Policy — Factisizer',
  description: 'Privacy Policy for Factisizer.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-dvh bg-[#fcf9f8] px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#e7e1dd] bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <h1 className="text-2xl font-semibold text-[#1f1f1f] sm:text-3xl">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#666]">
          Effective date: April 9, 2026
        </p>

        <div className="mt-6 space-y-6 text-[15px] leading-8 text-[#333]">
          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">1. Introduction</h2>
            <p className="mt-2">
              Factisizer is a fact-checking web application that allows users to type a claim,
              ask a question, or paste a public article link in order to receive an AI-generated
              fact-checking response.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">2. Information you submit</h2>
            <p className="mt-2">
              When you use Factisizer, you may submit text such as claims, questions, or public
              article links. This submitted content is sent to our server for processing so that
              the app can generate a fact-checking result.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">3. How your information is used</h2>
            <p className="mt-2">
              We use submitted content only to operate the app, generate responses, improve
              reliability, detect errors, and maintain service security and performance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">4. AI processing</h2>
            <p className="mt-2">
              Factisizer uses AI-based processing to analyze submitted content and generate
              outputs such as verdicts, explanations, confidence scores, and sources. Because
              AI-generated responses may sometimes be incomplete, outdated, or mistaken, users
              should independently verify important claims.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">5. Article links and external content</h2>
            <p className="mt-2">
              If you paste a public URL, Factisizer may retrieve and process publicly available
              page content from that link in order to evaluate the claim or article. Please do
              not submit private, confidential, or sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">6. Cookies and analytics</h2>
            <p className="mt-2">
              Factisizer may use basic technical logs and similar limited data needed for security,
              debugging, and service operation. At this stage, users should assume that standard
              hosting and server logs may temporarily record technical request information such as
              IP address, browser type, device type, and time of access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">7. Advertising</h2>
            <p className="mt-2">
              Factisizer may display advertisements now or in the future. If advertising services
              are added later, this Privacy Policy may be updated to reflect the data practices of
              those services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">8. Data sharing</h2>
            <p className="mt-2">
              Submitted content may be processed through third-party infrastructure and AI service
              providers strictly for operating the app. We do not sell user-submitted content as a
              standalone product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">9. Children’s privacy</h2>
            <p className="mt-2">
              Factisizer is not intended for children under the age required by applicable law in
              their region to use such services without parental consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">10. Data security</h2>
            <p className="mt-2">
              We take reasonable measures to protect the service, but no method of internet
              transmission or storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">11. Changes to this policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. The updated version will be
              posted on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1f1f1f]">12. Contact</h2>
            <p className="mt-2">
              For questions about this Privacy Policy, you can contact Factisizer through the
              official email at contactinfosizer@gmail.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}