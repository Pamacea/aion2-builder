"use client";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <p className="text-muted-foreground mb-4" suppressHydrationWarning>
            <strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Bahion (&quot;the Service&quot;), you agree to be bound by these 
            Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
          <p>
            Bahion is a build creation service for the game Aion 2, allowing users to 
            create, share, and view build configurations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Description</h2>
          <p>
            Bahion provides an online platform allowing users to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and customize builds for different Aion 2 classes</li>
            <li>View class characteristics, skills, passives, and stigmas</li>
            <li>Share their builds with other users</li>
            <li>View builds created by other users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Use of Service</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Permitted Use</h3>
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Prohibited Use</h3>
          <p>It is strictly prohibited to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Service for illegal or fraudulent purposes</li>
            <li>Attempt to gain unauthorized access to the Service or its systems</li>
            <li>Transmit viruses, malicious code, or any other harmful elements</li>
            <li>Copy, reproduce, or resell the Service without authorization</li>
            <li>Use robots, automated scripts, or similar methods to access the Service</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Publish offensive, defamatory, discriminatory, or illegal content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Accounts</h2>
          <p>
            Certain Service features may require account creation. You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of your credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and up-to-date information</li>
            <li>Notifying us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5.1. Your Content</h3>
          <p>
            You retain all rights to the builds and content you create. By publishing content 
            on the Service, you grant us a worldwide, non-exclusive, royalty-free, and transferable 
            license to use, reproduce, modify, and display this content as part of the Service.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2. Third-Party Content</h3>
          <p>
            The Service may contain content created by other users. We are not responsible 
            for the accuracy, legality, or quality of such content.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3. Content Removal</h3>
          <p>
            We reserve the right to remove any content that violates these Terms or is 
            deemed inappropriate, without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
          <p>
            The Service, including its design, features, source code, and content (except 
            user content), is the property of Bahion and is protected by intellectual property laws.
          </p>
          <p className="mt-4">
            Aion 2 and all associated elements (class names, skills, etc.) are the property of their 
            respective owners. Bahion is not affiliated with, endorsed by, or associated with the owners 
            of Aion 2.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Service Availability</h2>
          <p>
            We strive to keep the Service available 24/7, but we do not guarantee 
            uninterrupted availability. The Service may be temporarily unavailable for maintenance, 
            updates, or other technical reasons.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, Bahion shall not be liable for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Any indirect, incidental, special, or consequential damages resulting from use of the Service</li>
            <li>Loss of data or builds</li>
            <li>The accuracy, completeness, or usefulness of information provided by the Service</li>
            <li>Third-party actions or content</li>
          </ul>
          <p className="mt-4">
            The Service is provided &quot;as is&quot; without warranty of any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold Bahion harmless from any claim, loss, liability, 
            damage, cost, or expense resulting from your use of the Service or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the Service at any time, 
            without prior notice, for violation of these Terms or for any other reason we deem appropriate.
          </p>
          <p className="mt-4">
            You may stop using the Service at any time. Deleting your account may result in 
            the loss of your builds and associated data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes 
            will take effect immediately upon publication on this page. Your continued use of the Service after 
            publication of changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Applicable Law and Jurisdiction</h2>
          <p>
            These Terms are governed by French law. Any dispute relating to these Terms will be subject 
            to the exclusive jurisdiction of French courts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. General Provisions</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the other provisions 
            will remain in effect. These Terms constitute the entire agreement between you and Bahion 
            regarding use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact</h2>
          <p>
            For any questions regarding these Terms of Service, you can contact us:
          </p>
          <p className="mt-4">
            <strong>Bahion</strong><br />
            Email: pamacea@live.fr<br />
            Website: https://bahion.com
          </p>
        </section>
      </div>
    </div>
  );
}
