import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Database, Globe, Lock, Settings, AlertTriangle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <motion.section variants={fadeUp} className="py-12 md:py-16 border-t border-gray-100">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary-50">
          {icon}
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900">{title}</h2>
      </motion.div>
      <motion.div variants={stagger}>{children}</motion.div>
    </div>
  </motion.section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.div variants={fadeUp} className="mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
    <div className="space-y-3 text-gray-600 leading-relaxed">{children}</div>
  </motion.div>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2 pl-5 list-disc">
    {items.map((item, i) => (
      <motion.li key={i} variants={fadeUp} className="text-gray-600 leading-relaxed">
        {item}
      </motion.li>
    ))}
  </ul>
);

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-b from-primary-50 to-white py-20 md:py-28"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div className="inline-flex p-4 rounded-2xl bg-primary-100 mb-6">
            <Shield className="h-8 w-8 text-primary-600" />
          </motion.div>
          <motion.h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </motion.h1>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use StayNG.
          </motion.p>
          <motion.div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>Last updated: {lastUpdated}</span>
            <span className="w-px h-4 bg-gray-200" />
            <span>Version 1.0</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="py-8 md:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Welcome to StayNG ('we', 'our', 'us'). We are committed to protecting your personal information and your right to privacy.
              If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information,
              please contact us at <a href="mailto:privacy@staynghotels.com" className="text-primary-600 hover:underline font-medium">privacy@staynghotels.com</a>.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              This privacy notice applies to all information collected through our website (<a href="/" className="text-primary-600 hover:underline">staynghotels.com</a>),
              mobile application, and related services (collectively, the 'Services').
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Key Points at a Glance
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-center gap-2">✓ We collect only data necessary for bookings and account management</li>
                <li className="flex items-center gap-2">✓ We never sell your personal information to third parties</li>
                <li className="flex items-center gap-2">✓ You can access, correct, or delete your data at any time</li>
                <li className="flex items-center gap-2">✓ We use encryption and secure servers to protect your data</li>
                <li className="flex items-center gap-2">✓ We comply with Nigeria Data Protection Regulation (NDPR)</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
<Section title="Information We Collect" icon={<User className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Personal Information You Provide">
          <p>We collect information you provide directly to us when you:</p>
          <BulletList items={[
            'Create an account (name, email, phone number, password)',
            'Make a booking (guest details, payment information, special requests)',
            'Contact customer support (communication records)',
            'Subscribe to newsletters (email preferences)',
            'Leave reviews or ratings (public display name, content)',
            'List a property (business details, banking information for payouts)',
          ]} />
        </SubSection>

        <SubSection title="Information Collected Automatically">
          <p>When you use our Services, we automatically collect certain information:</p>
          <BulletList items={[
            'Device information (IP address, browser type, operating system, device identifiers)',
            'Usage data (pages visited, time spent, search queries, booking history)',
            'Location data (with your consent) for personalized recommendations',
            'Cookies and similar tracking technologies (see Cookie Policy)',
            'Log files (access times, referring URLs, error logs)',
          ]} />
        </SubSection>

        <SubSection title="Information from Third Parties">
          <p>We may receive information about you from:</p>
          <BulletList items={[
            'Payment processors (Flutterwave, Paystack) for transaction verification',
            'Social media platforms if you sign in with Google/Facebook/Apple',
            'Property partners for booking confirmations and guest verification',
            'Analytics providers (Google Analytics) for service improvement',
          ]} />
        </SubSection>
      </Section>
<Section title="How We Use Your Information" icon={<Database className="h-5 w-5 text-primary-600" />}>
        <SubSection title="To Provide Our Services">
          <BulletList items={[
            'Process and manage hotel bookings and reservations',
            'Create and maintain your user account',
            'Send booking confirmations, reminders, and updates via email/SMS',
            'Facilitate communication between guests and property hosts',
            'Process payments and issue refunds securely',
            'Provide customer support and resolve disputes',
          ]} />
        </SubSection>

        <SubSection title="To Improve & Personalize">
          <BulletList items={[
            'Analyze usage patterns to improve platform functionality',
            'Personalize search results and recommendations',
            'Detect and prevent fraud, abuse, and security incidents',
            'Conduct analytics and research (aggregated, anonymized data)',
            'Develop new features and services',
          ]} />
        </SubSection>

        <SubSection title="For Communications">
          <BulletList items={[
            'Transactional emails (bookings, payments, account changes)',
            'Marketing communications (with your consent) — you can unsubscribe anytime',
            'Service announcements and policy updates',
            'Security alerts and important notices',
          ]} />
        </SubSection>

        <SubSection title="Legal Compliance">
          <BulletList items={[
            'Comply with Nigerian Data Protection Regulation (NDPR)',
            'Respond to legal requests and regulatory inquiries',
            'Enforce our Terms of Service and prevent illegal activities',
            'Protect the rights, property, and safety of StayNG, our users, and the public',
          ]} />
        </SubSection>
      </Section>

      <Section title="Data Sharing & Disclosure" icon={<Globe className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-6">We do not sell your personal information. We share data only in these circumstances:</p>

        <SubSection title="With Your Consent">
          <p>We share information when you explicitly authorize us to, such as sharing guest details with a property host for a booking.</p>
        </SubSection>

        <SubSection title="With Service Providers">
          <p>We work with trusted third parties who process data on our behalf under strict confidentiality agreements:</p>
          <BulletList items={[
            'Payment processors (Flutterwave, Paystack) — for secure transactions',
            'Cloud infrastructure (AWS, Google Cloud) — for hosting and storage',
            'Communication services (SendGrid, Twilio) — for emails and SMS',
            'Analytics (Google Analytics, Mixpanel) — for service improvement',
            'Customer support tools (Intercom, Zendesk) — for help desk',
          ]} />
        </SubSection>

        <SubSection title="Property Hosts & Partners">
          <p>For bookings, we share necessary guest information with the property (name, contact, check-in/out dates, special requests). Hosts are contractually bound to protect this data.</p>
        </SubSection>

        <SubSection title="Legal Requirements">
          <p>We may disclose information if required by law, court order, or governmental request, or to protect our legal rights.</p>
        </SubSection>

        <SubSection title="Business Transfers">
          <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change.</p>
        </SubSection>
      </Section>

      <Section title="Data Security" icon={<Lock className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Technical Measures">
          <BulletList items={[
            'End-to-end encryption for data in transit (TLS 1.3)',
            'AES-256 encryption for data at rest',
            'Regular security audits and penetration testing',
            'PCI DSS compliance for payment processing',
            'Multi-factor authentication for admin access',
            'Automated threat monitoring and intrusion detection',
          ]} />
        </SubSection>

        <SubSection title="Organizational Measures">
          <BulletList items={[
            'Data Protection Officer appointed per NDPR requirements',
            'Employee training on data privacy and security',
            'Access controls — employees access only data needed for their role',
            'Incident response plan for data breaches',
            'Vendor security assessments for all processors',
          ]} />
        </SubSection>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Important:</strong> While we implement strong security measures, no internet transmission or electronic storage is 100% secure.
            We cannot guarantee absolute security. If you suspect a security breach, contact us immediately at <a href="mailto:security@staynghotels.com" className="underline font-medium">security@staynghotels.com</a>.
          </p>
        </div>
      </Section>
<Section title="Your Rights (NDPR & Global Standards)" icon={<Settings className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-6">Under the Nigeria Data Protection Regulation (NDPR) and other applicable laws, you have the following rights:</p>

        <SubSection title="Right to Access">
          <p>Request a copy of your personal data we hold, including how we process it and who we share it with.</p>
        </SubSection>

        <SubSection title="Right to Rectification">
          <p>Request correction of inaccurate or incomplete personal data. You can also update your profile directly in account settings.</p>
        </SubSection>

        <SubSection title="Right to Erasure (&apos;Right to be Forgotten&apos;)">
          <p>Request deletion of your personal data, subject to legal obligations (e.g., we must retain booking records for tax purposes).</p>
        </SubSection>

        <SubSection title="Right to Restrict Processing">
          <p>Request we limit how we use your data while a dispute is resolved or if processing is unlawful.</p>
        </SubSection>

        <SubSection title="Right to Data Portability">
          <p>Receive your data in a structured, commonly used, machine-readable format, or request transfer to another controller.</p>
        </SubSection>

        <SubSection title="Right to Object">
          <p>Object to processing based on legitimate interests (including direct marketing). We will stop unless we have compelling legitimate grounds.</p>
        </SubSection>

        <SubSection title="Right to Withdraw Consent">
          <p>Where processing is based on consent, you can withdraw it at any time without affecting lawfulness of prior processing.</p>
        </SubSection>

        <SubSection title="How to Exercise Your Rights">
          <p>Submit a request via:</p>
          <BulletList items={[
            'Email: <a href="mailto:privacy@staynghotels.com" className="text-primary-600 hover:underline">privacy@staynghotels.com</a>',
            'Account Settings → Privacy Dashboard (for access, rectification, deletion)',
            'Unsubscribe links in marketing emails',
          ]} />
          <p className="mt-3 text-sm text-gray-500">We respond within 30 days (extendable by 60 days for complex requests). No fee unless request is manifestly unfounded or excessive.</p>
        </SubSection>
      </Section>

      <Section title="Data Retention" icon={<Database className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-6">We retain personal data only as long as necessary for the purposes outlined in this policy:</p>
        <BulletList items={[
          '<strong>Account data:</strong> While your account is active, plus 2 years after closure for legal compliance',
          '<strong>Booking & transaction records:</strong> 7 years (Nigerian tax law requirement)',
          '<strong>Communication logs:</strong> 3 years for dispute resolution',
          '<strong>Analytics/usage data:</strong> 26 months (aggregated/anonymized thereafter)',
          '<strong>Marketing preferences:</strong> Until you unsubscribe or account closure',
          '<strong>Security logs:</strong> 12 months for fraud prevention',
        ]} />
        <p className="text-gray-600 mt-4">When data is no longer needed, we securely delete or anonymize it.</p>
      </Section>

      <Section title="International Data Transfers" icon={<Globe className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">Our servers are primarily located in Nigeria and Europe. When we transfer data internationally, we ensure adequate protection through:</p>
        <BulletList items={[
          'Standard Contractual Clauses (SCCs) approved by the Nigerian Data Protection Commission',
          'Adequacy decisions for countries with equivalent privacy laws',
          'Binding Corporate Rules for intra-group transfers',
          'Explicit consent where no other mechanism applies',
        ]} />
      </Section>

      <Section title="Cookies & Tracking" icon={<Settings className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">We use cookies and similar technologies to:</p>
        <BulletList items={[
          'Enable essential site functionality (authentication, booking flow)',
          'Analyze site performance and user behavior (Google Analytics)',
          'Remember preferences (currency, language, search filters)',
          'Deliver relevant marketing (with consent)',
          'Prevent fraud and ensure security',
        ]} />
        <p className="mt-4">See our <a href="/cookie-policy" className="text-primary-600 hover:underline font-medium">Cookie Policy</a> for details on cookie types, purposes, and how to manage preferences.</p>
      </Section>

      <Section title="Changes to This Policy" icon={<Mail className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">We may update this Privacy Policy to reflect changes in our practices, technology, or legal requirements.</p>
        <BulletList items={[
          'Material changes: We will notify you via email and/or prominent site notice 30 days before effective date',
          'Minor changes: Updated "Last updated" date at top of this page',
          'Continued use of Services after changes constitutes acceptance',
        ]} />
      </Section>

      <Section title="Contact Us" icon={<Mail className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">For questions, complaints, or to exercise your rights:</p>
        <div className="space-y-3 text-gray-600">
          <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@staynghotels.com" className="text-primary-600 hover:underline">dpo@staynghotels.com</a></p>
          <p><strong>Privacy Team:</strong> <a href="mailto:privacy@staynghotels.com" className="text-primary-600 hover:underline">privacy@staynghotels.com</a></p>
          <p><strong>Postal Address:</strong> StayNG Privacy Team, 123 Victoria Island, Lagos, Nigeria</p>
          <p><strong>Phone:</strong> +234 (0) 800 123 4567</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          You also have the right to lodge a complaint with the <strong>Nigeria Data Protection Commission (NDPC)</strong> at
          <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">ndpc.gov.ng</a>.
        </p>
      </Section>

      <div className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>This Privacy Policy is effective as of {lastUpdated}.</p>
          <p className="mt-2">© {new Date().getFullYear()} StayNG. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;