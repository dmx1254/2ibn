"use client";

const VotreMessengerContact = () => {
  const VOTRE_FACEBOOK_ID = "100011356194882";

  const ouvrirMessenger = (message = "") => {
    const encodedMessage = message ? encodeURIComponent(message) : "";
    const url = `https://m.me/${VOTRE_FACEBOOK_ID}${
      message ? `?text=${encodedMessage}` : ""
    }`;

    // Détecter si on est sur mobile
    const estMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (estMobile) {
      // Essayer d'ouvrir l'app Messenger native
      window.location.href = `fb-messenger://user/${VOTRE_FACEBOOK_ID}`;

      // Fallback vers le navigateur après 1 seconde
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
      }, 1000);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => ouvrirMessenger("Bonjour ! Je viens de votre site web.")}
        className="fixed top-4 right-4 z-50 bg-[#0A7CFF] hover:bg-[#006AFF] text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
        aria-label="Contactez-moi via Messenger"
        title="Contactez-moi via Messenger"
      >
        <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
          <path
            d="M18 0C8.055 0 0 7.488 0 16.725C0 22.257 2.727 27.15 7.011 30.273V36L12.471 32.82C14.214 33.345 16.077 33.63 18 33.63C27.945 33.63 36 26.142 36 16.905C36 7.488 27.945 0 18 0ZM19.743 22.437L15.633 18.063L7.713 22.437L16.383 13.293L20.493 17.667L28.287 13.293L19.743 22.437Z"
            fill="white"
          />
        </svg>
        {/* <span className="font-semibold text-sm">Messenger</span> */}
      </button>
    </div>
  );
};

export default VotreMessengerContact;
