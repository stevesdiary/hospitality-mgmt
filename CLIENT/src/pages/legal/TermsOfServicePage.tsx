import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Gavel, Shield, User, CreditCard, Calendar, Star, AlertTriangle, Mail, Building2, Scale, Lock, Settings } from 'lucide-react';

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

const TermsOfServicePage: React.FC = () => {
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
            <FileText className="h-8 w-8 text-primary-600" />
          </motion.div>
          <motion.h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </motion.h1>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Please read these Terms of Service carefully before using StayNG. By accessing or using our services, you agree to be bound by these terms.
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
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Key Points at a Glance
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-center gap-2">✓ You must be 18+ to use StayNG</li>
                <li className="flex items-center gap-2">✓ Bookings create a contract with the property host</li>
                <li className="flex items-center gap-2">✓ Cancellation policies are set by each property</li>
                <li className="flex items-center gap-2">✓ We act as an agent — the host provides the accommodation</li>
                <li className="flex items-center gap-2">✓ Governed by Nigerian law</li>
              </ul>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              Welcome to StayNG ('we', 'our', 'us', 'the Platform'). These Terms of Service ('Terms') constitute a legally binding agreement between you ('User', 'Guest', or 'you') and StayNG governing your access to and use of our website, mobile application, and related services (collectively, the 'Services').
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              By accessing or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy-policy" className="text-primary-600 hover:underline font-medium">Privacy Policy</a>. If you do not agree, you may not use the Services.
            </p>
          </motion.div>
        </div>
      </div>
<Section title="1. Acceptance of Terms" icon={<FileText className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Agreement">
          <p>By creating an account, making a booking, or otherwise using the Services, you agree to these Terms. We may modify these Terms at any time. Material changes will be communicated via email or prominent notice on the Platform at least 30 days before taking effect. Your continued use after changes constitutes acceptance.</p>
        </SubSection>

        <SubSection title="Eligibility">
          <BulletList items={[
            'You must be at least 18 years old and have legal capacity to enter into contracts',
            'You must provide accurate and complete registration information',
            'Corporate bookings require authorized signatory authority',
            'You may not use the Services if previously suspended or terminated',
          ]} />
        </SubSection>
      </Section>

      <Section title="2. Definitions" icon={<Scale className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Key Terms">
          <BulletList items={[
            '<strong>Platform:</strong> The StayNG website, mobile apps, and related services',
            '<strong>User:</strong> Any individual or entity accessing or using the Platform',
            '<strong>Guest:</strong> A User making a reservation for accommodation',
            '<strong>Host / Property Partner:</strong> Accommodation providers listed on the Platform',
            '<strong>Booking:</strong> A confirmed reservation for accommodation',
            '<strong>Listing:</strong> A property listing published by a Host on the Platform',
            '<strong>Content:</strong> Text, images, reviews, ratings, data, and other materials on the Platform',
            '<strong>Fees:</strong> Service fees, booking fees, and any other charges imposed by StayNG',
          ]} />
        </SubSection>
      </Section>

      <Section title="3. Account Registration" icon={<User className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Your Responsibilities">
          <BulletList items={[
            'Provide accurate, current, and complete information during registration',
            'Maintain the confidentiality of your login credentials',
            'Notify us immediately of any unauthorized use of your account',
            'You are responsible for all activities under your account',
            'Keep your contact information (email, phone) up to date',
          ]} />
        </SubSection>

        <SubSection title="Account Security">
          <p>We may suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a security risk. You agree to cooperate with any security verification requests.</p>
        </SubSection>
      </Section>

      <Section title="4. Bookings & Reservations" icon={<Calendar className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Booking Process">
          <BulletList items={[
            'Search results reflect real-time availability but are subject to change',
            'Prices displayed include applicable taxes unless stated otherwise',
            'A booking confirmation creates a direct contract between Guest and Host',
            'StayNG acts as the Host&apos;s limited agent for payment processing',
            'Special requests are forwarded to the Host but cannot be guaranteed',
            'Group bookings (5+ rooms) may be subject to different terms and conditions',
          ]} />
        </SubSection>

        <SubSection title="Booking Confirmation">
          <p>A booking is confirmed when you receive a confirmation email with a booking reference number. This confirmation constitutes acceptance of the Host's offer and forms a binding contract between you and the Host. StayNG is not a party to this contract.</p>
        </SubSection>
      </Section>
<Section title="5. Payment Terms" icon={<CreditCard className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Payment Collection">
          <BulletList items={[
            'Payment is collected at the time of booking or at check-in per the Host&apos;s policy',
            'Accepted methods: Credit/Debit cards, Bank Transfer, Mobile Money (Paga, OPay), Wallet balance',
            'All prices are in Nigerian Naira (NGN) unless otherwise specified',
            'Authorization holds may be placed for incidentals at check-in',
            'Payment disputes must be raised within 14 days of the charge date',
            'Refunds are processed according to the applicable cancellation policy',
          ]} />
        </SubSection>

        <SubSection title="Fees">
          <p>StayNG may charge service fees for bookings. These fees are non-refundable except as required by law or as stated in the cancellation policy. Fee amounts are displayed during the booking process.</p>
        </SubSection>

        <SubSection title="Taxes">
          <p>Applicable taxes (VAT, tourism levies) are included in displayed prices or collected separately as required by Nigerian tax law. Hosts are responsible for remitting taxes on their earnings.</p>
        </SubSection>
      </Section>

      <Section title="6. Cancellation & Modification" icon={<AlertTriangle className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Cancellation Policies">
          <BulletList items={[
            'Each Host sets their own cancellation policy (displayed at time of booking)',
            'Common policies: Free cancellation (24-72 hours before check-in), Moderate, Strict, Non-refundable',
            'Non-refundable rates: No refund for any cancellation or modification',
            'Cancellation requests must be made through the Platform',
            'Refund timing: 5-10 business days to original payment method',
          ]} />
        </SubSection>

        <SubSection title="Modifications">
          <p>Changes to dates, guest count, or room type are subject to availability and may result in rate differences. Contact the Host directly through the Platform for modification requests.</p>
        </SubSection>

        <SubSection title="No-Shows & Force Majeure">
          <BulletList items={[
            'No-shows (failure to check in without prior cancellation): Full charge per Host policy',
            'Force majeure events (natural disasters, government restrictions, pandemics): Flexible rebooking options offered where possible',
            'StayNG may mediate disputes but final determination follows Host policy and applicable law',
          ]} />
        </SubSection>
      </Section>

      <Section title="7. Check-in & Check-out" icon={<Lock className="h-5 w-5 text-primary-600" />}>
        <BulletList items={[
          'Standard check-in: 2:00 PM | Standard check-out: 12:00 PM (varies by property)',
          'Government-issued photo ID required at check-in for all guests',
          'Credit card authorization for incidentals may be required at check-in',
          'Early check-in / late check-out subject to availability and may incur additional fees',
          'Guest is responsible for the condition of the room and any damages during stay',
          'Hosts may refuse accommodation to guests who cannot provide valid identification',
        ]} />
      </Section>

      <Section title="8. Reviews & Ratings" icon={<Star className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Eligibility">
          <p>Only verified Guests who have completed a stay may submit reviews. Reviews must be submitted within 90 days of check-out.</p>
        </SubSection>

        <SubSection title="Content Standards">
          <BulletList items={[
            'Reviews must be truthful, relevant to the stay, and based on personal experience',
            'No promotional content, hate speech, discrimination, or personal information',
            'No reviews written in exchange for compensation or incentives',
            'One review per stay per Guest',
          ]} />
        </SubSection>

        <SubSection title="Moderation">
          <p>We reserve the right to moderate, edit, or remove reviews that violate these standards. Reviews reflect Guest opinions, not those of StayNG. Hosts may respond publicly to reviews.</p>
        </SubSection>
      </Section>
<Section title="9. User Conduct" icon={<Shield className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">You agree NOT to:</p>
        <BulletList items={[
          'Violate any applicable law, regulation, or third-party rights',
          'Interfere with the security, integrity, or performance of the Platform',
          'Use automated scraping, bots, or unauthorized access methods',
          'Transmit malware, spam, phishing attempts, or harmful code',
          'Impersonate others or provide false/misleading information',
          'Make fraudulent bookings, chargebacks, or payment disputes',
          'Harass, threaten, or abuse StayNG staff, Hosts, or other Users',
          'List properties you do not own or have authority to manage',
          'Discriminate against Guests based on protected characteristics',
        ]} />
      </Section>

      <Section title="10. Host Obligations" icon={<Building2 className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Listing Accuracy">
          <BulletList items={[
            'Provide accurate property descriptions, amenities, photos, and pricing',
            'Honor confirmed bookings at the agreed-upon rates',
            'Maintain property standards consistent with listing representations',
            'Comply with all applicable Nigerian laws, licenses, and regulations',
          ]} />
        </SubSection>

        <SubSection title="Guest Safety & Privacy">
          <BulletList items={[
            'Provide safe, clean, and habitable accommodation',
            'Respect Guest privacy and data in accordance with our Privacy Policy',
            'Handle Guest personal information securely and only for booking purposes',
            'Cooperate with StayNG in dispute resolution and safety incidents',
          ]} />
        </SubSection>

        <SubSection title="Payouts">
          <p>Host payouts are processed after Guest check-in (typically 24 hours), minus StayNG service fees. Hosts must provide valid banking details and tax information. Payouts are in NGN to Nigerian bank accounts.</p>
        </SubSection>
      </Section>

      <Section title="11. Intellectual Property" icon={<Settings className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Platform Content">
          <p>All content on the Platform (design, text, graphics, logos, code, trademarks) is owned by or licensed to StayNG and protected by Nigerian and international IP laws.</p>
        </SubSection>

        <SubSection title="Host Content">
          <p>Hosts grant StayNG a non-exclusive, royalty-free, worldwide license to use, display, and distribute listing content (photos, descriptions) for Platform operations and marketing.</p>
        </SubSection>

        <SubSection title="User Content">
          <p>By submitting reviews, photos, or other content, you grant StayNG a perpetual, royalty-free, worldwide license to use, modify, and distribute such content. You retain ownership but grant us rights to operate the Platform.</p>
        </SubSection>
      </Section>

      <Section title="12. Disclaimers" icon={<AlertTriangle className="h-5 w-5 text-primary-600" />}>
        <BulletList items={[
          'The Platform is provided \\"AS IS\\" and \\"AS AVAILABLE\\" without warranties of any kind',
          'No warranty that the Platform will be uninterrupted, error-free, or secure',
          'Host information is provided by Hosts; we verify but do not guarantee accuracy',
          'Not liable for Host acts/omissions, force majeure, or third-party actions',
          'Third-party links on the Platform are not endorsed; use at your own risk',
        ]} />
      </Section>

      <Section title="13. Limitation of Liability" icon={<Scale className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">To the maximum extent permitted by law:</p>
        <BulletList items={[
          'StayNG is not liable for indirect, incidental, special, consequential, or punitive damages',
          'Total liability limited to the greater of: (a) fees paid to StayNG in the 12 months prior to the claim, or (b) ₦100,000',
          'Not liable for: data loss, lost profits, business interruption, reputational harm',
          'Some jurisdictions do not allow certain limitations; they apply to the maximum extent permitted',
        ]} />
      </Section>

      <Section title="14. Indemnification" icon={<Shield className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600">You agree to indemnify, defend, and hold harmless StayNG, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
        <BulletList items={[
          'Your breach of these Terms',
          'Your use of the Platform or Services',
          'Your violation of any law or third-party rights',
          'Any booking made through your account',
          'Your Content submitted to the Platform',
        ]} />
      </Section>
<Section title="15. Governing Law & Dispute Resolution" icon={<Gavel className="h-5 w-5 text-primary-600" />}>
        <SubSection title="Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.</p>
        </SubSection>

        <SubSection title="Jurisdiction">
          <p>Exclusive jurisdiction and venue for any disputes shall be the courts of Lagos State, Nigeria.</p>
        </SubSection>

        <SubSection title="Dispute Resolution Process">
          <BulletList items={[
            '1. Good faith negotiation between parties (30 days)',
            '2. Mediation through the Lagos Court of Arbitration (LCA) or agreed mediator',
            '3. Binding arbitration under LCA rules, or litigation in Lagos courts',
          ]} />
        </SubSection>

        <SubSection title="Class Action Waiver">
          <p>To the maximum extent permitted by law, disputes must be brought individually, not as a class action or representative proceeding.</p>
        </SubSection>
      </Section>

      <Section title="16. Termination" icon={<FileText className="h-5 w-5 text-primary-600" />}>
        <SubSection title="By StayNG">
          <p>We may suspend or terminate your access for:</p>
          <BulletList items={[
            'Breach of these Terms or applicable policies',
            'Fraud, abuse, illegal activity, or security threats',
            'Extended inactivity (2+ years without login)',
            'Legal or regulatory requirements',
            'Repeated policy violations',
          ]} />
        </SubSection>

        <SubSection title="By You">
          <p>You may terminate your account at any time through Account Settings or by contacting support. Pending bookings must be resolved before closure.</p>
        </SubSection>

        <SubSection title="Effect of Termination">
          <p>Upon termination: your license to use the Services ends, but survival clauses (liability, indemnity, IP rights, dispute resolution) continue. We may retain data as required by law.</p>
        </SubSection>
      </Section>

      <Section title="17. General Provisions" icon={<Settings className="h-5 w-5 text-primary-600" />}>
        <BulletList items={[
          '<strong>Entire Agreement:</strong> These Terms + Privacy Policy = complete agreement between you and StayNG',
          '<strong>Severability:</strong> Invalid provisions do not affect the validity of remaining provisions',
          '<strong>Waiver:</strong> Failure to enforce a right does not constitute a waiver of that right',
          '<strong>Assignment:</strong> We may assign these Terms; you may not assign without our written consent',
          '<strong>Notices:</strong> Via email, in-app notification, or posted on the Platform',
          '<strong>Language:</strong> English version controls in case of translation discrepancies',
          '<strong>No Agency:</strong> No partnership, joint venture, or employment relationship created',
        ]} />
      </Section>

      <Section title="18. Contact Information" icon={<Mail className="h-5 w-5 text-primary-600" />}>
        <p className="text-gray-600 mb-4">For questions about these Terms:</p>
        <div className="space-y-3 text-gray-600">
          <p><strong>Legal Department:</strong> <a href="mailto:legal@staynghotels.com" className="text-primary-600 hover:underline">legal@staynghotels.com</a></p>
          <p><strong>Support:</strong> <a href="mailto:support@staynghotels.com" className="text-primary-600 hover:underline">support@staynghotels.com</a></p>
          <p><strong>Postal Address:</strong> StayNG Legal, 123 Victoria Island, Lagos, Nigeria</p>
          <p><strong>Phone:</strong> +234 (0) 800 123 4567</p>
        </div>
      </Section>

      <div className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>These Terms of Service are effective as of {lastUpdated}.</p>
          <p className="mt-2">© {new Date().getFullYear()} StayNG. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;