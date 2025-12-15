"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <p className="text-muted-foreground mb-4" suppressHydrationWarning>
            <strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            This Privacy Policy describes how Bahion (&quot;we&quot;, &quot;our&quot;, or &quot;the site&quot;) 
            collects, uses, and protects your personal information when you use our build creation service 
            for Aion 2 (the &quot;Service&quot;).
          </p>
          <p>
            By using our Service, you agree to the collection and use of information in accordance with 
            this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1. Information Provided Directly</h3>
          <p>
            When you create a build or use our Service, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The builds you create (name, configuration, selected classes)</li>
            <li>Your build configuration preferences</li>
            <li>Any other information you choose to share publicly</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2. Automatically Collected Information</h3>
          <p>
            We automatically collect certain information when you use our Service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on the site</li>
            <li>Date and time of your visits</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Use of Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Service</li>
            <li>Save your builds and preferences</li>
            <li>Analyze Service usage to improve user experience</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with our legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
          <p>
            We do not sell, exchange, or rent your personal information to third parties. 
            We may share your information only in the following cases:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your explicit consent</li>
            <li>To comply with a legal obligation</li>
            <li>To protect our rights, your safety, or that of others</li>
            <li>With trusted service providers who help us operate our Service 
                (subject to strict confidentiality agreements)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to improve your experience, analyze 
            Service usage, and personalize content. You can control cookie usage 
            through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to 
            protect your information against unauthorized access, loss, destruction, or modification. 
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
          <p>
            In accordance with the General Data Protection Regulation (GDPR), you have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right of access:</strong> You can request a copy of your personal data</li>
            <li><strong>Right to rectification:</strong> You can correct your inaccurate data</li>
            <li><strong>Right to erasure:</strong> You can request deletion of your data</li>
            <li><strong>Right to data portability:</strong> You can retrieve your data in a structured format</li>
            <li><strong>Right to object:</strong> You can object to the processing of your data</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at the address indicated in the &quot;Contact&quot; section.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to provide the Service 
            and comply with our legal obligations. When you delete your account or request deletion 
            of your data, we will delete it within a reasonable time, unless retention is required 
            by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
          <p>
            We may modify this Privacy Policy from time to time. We will notify you of 
            any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
          <p>
            For any questions regarding this Privacy Policy or to exercise your rights, 
            you can contact us:
          </p>
          <p className="mt-4">
            <strong>Bahion</strong><br />
            Email: contact@bahion.com<br />
            Website: https://bahion.com
          </p>
        </section>
      </div>
    </div>
  );
}
