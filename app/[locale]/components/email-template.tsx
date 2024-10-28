import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  verificationCode: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  email,
  verificationCode,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
    <table
      role="presentation"
      width="100%"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* En-tête */}
      <tr>
        <td style={{ backgroundColor: '#d97706', padding: '30px', textAlign: 'center', fontSize: '24px', color: '#ffffff' }}>
          2IBN
        </td>
      </tr>

      {/* Contenu principal */}
      <tr>
        <td style={{ padding: '40px 30px' }}>
          <h1 style={{ color: '#333333', fontSize: '24px', marginBottom: '20px' }}>Code de vérification</h1>
          <p style={{ color: '#666666', fontSize: '16px', lineHeight: '1.5', marginBottom: '30px' }}>
            Pour finaliser votre vérification, veuillez utiliser le code suivant :
          </p>
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706', letterSpacing: '4px' }}>
              {verificationCode}
            </span>
          </div>
          <p style={{ color: '#666666', fontSize: '16px', lineHeight: '1.5' }}>
            Ce code expirera dans <strong>30 minutes</strong>.
          </p>
          <p style={{ color: '#666666', fontSize: '16px', lineHeight: '1.5' }}>
            Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
          </p>
        </td>
      </tr>

      {/* Instructions de sécurité */}
      <tr>
        <td style={{ padding: '0 30px 30px' }}>
          <div style={{ backgroundColor: '#fff8e1', borderRadius: '6px', padding: '20px' }}>
            <p style={{ color: '#996c00', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
              <strong>🔒 Conseils de sécurité :</strong><br />
              Ne partagez jamais ce code avec qui que ce soit. L'équipe 2IBN ne vous demandera jamais votre code de vérification.
            </p>
          </div>
        </td>
      </tr>

      {/* Pied de page */}
      <tr>
        <td style={{ padding: '30px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
          <p style={{ color: '#999999', fontSize: '14px', margin: '0 0 10px' }}>
            © 2024 2IBN. Tous droits réservés.
          </p>
          <p style={{ color: '#999999', fontSize: '14px', margin: '0 0 10px' }}>
            Cet email a été envoyé à {email}
          </p>
          <div style={{ marginTop: '20px' }}>
            <a href="https://2ibn.com" style={{ color: '#d97706', textDecoration: 'none', margin: '0 10px' }}>Site web</a> |
            <a href="https://2ibn.com/echange-de-kamas" style={{ color: '#d97706', textDecoration: 'none', margin: '0 10px' }}>Echange de kamas</a> |
            <a href="https://2ibn.com/vendre-des-kamas" style={{ color: '#d97706', textDecoration: 'none', margin: '0 10px' }}>Vendre vos kamas</a>
          </div>
        </td>
      </tr>
    </table>

    {/* Message anti-spam */}
    <table role="presentation" width="100%" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <tr>
        <td style={{ textAlign: 'center', color: '#999999', fontSize: '12px' }}>
          <p>
            Cet email a été envoyé par 2IBN. Pour vous assurer de recevoir nos emails, 
            ajoutez verification@2ibn.com à votre liste de contacts.
          </p>
        </td>
      </tr>
    </table>
  </div>
);
