import React from "react";
import "./PrivacyPolicy.css"; // Подключаем стили

const PrivacyPolicy = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1>Privacy Policy</h1>
        <h2>Effective Date: 20.12.2024</h2>
        
        <h3>1. Information Collection</h3>
        <p>
          For providing services and improving the user experience on our site, we collect the following information:
        </p>
        <ul>
          <li><strong>1.1 Your cryptocurrency wallet address</strong> – to provide continuous services, troubleshoot technical issues, and improve service quality.</li>
          <li><strong>1.2 Transaction information</strong> – to verify payments, troubleshoot technical issues, and improve service quality.</li>
        </ul>

        <h3>2. Data Processing and Sharing with Third Parties</h3>
        <p>
          We do not share or sell your personal information to third parties without your explicit consent, except when required by law or to fulfill our obligations in providing our services.
        </p>

        <h3>3. Children's Privacy</h3>
        <p>
          Our website and services are not intended for use by children. By children, we mean users under the age of 18. Children may use our website and services only with the legal consent of their parent or guardian.
        </p>

        <h3>4. Regional Restrictions</h3>
        <p>
          Our website and services should not be used in countries where the use of cryptocurrency or similar technologies is prohibited or restricted by local law.
        </p>

        <h3>5. Security</h3>
        <p>
          We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h3>6. Changes to the Privacy Policy</h3>
        <p>
          We reserve the right to modify or update this Privacy Policy. All changes will be posted on this page with the effective date. We encourage you to review this page regularly to stay informed about any changes.
        </p>

        <h3>7. Contact</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:  
          <strong>Email:</strong> rifkat.khusnullin94@gmail.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
