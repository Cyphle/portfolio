import React, { useState } from 'react';

const ContactForm = ({
                       apiUrl = process.env.REACT_APP_API_GATEWAY_URL || 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/contact',
                       className = ''
                     }) => {
  // États du composant
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Gestion des changements dans les champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Réinitialiser les erreurs pour ce champ
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Réinitialiser le statut global si on était en erreur
    if (submitStatus === 'error') {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  // Validation côté client
  const validateForm = () => {
    const errors = {};

    // Validation du nom
    if (!formData.name.trim()) {
      errors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.name.length > 100) {
      errors.name = 'Le nom ne peut pas dépasser 100 caractères';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Format d\'email invalide';
      } else if (formData.email.length > 254) {
        errors.email = 'L\'email est trop long';
      }
    }

    // Validation du message
    if (!formData.message.trim()) {
      errors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères';
    } else if (formData.message.length > 2000) {
      errors.message = 'Le message ne peut pas dépasser 2000 caractères';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setFieldErrors({});

        // Auto-réinitialiser le statut après 5 secondes
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
      } else {
        setErrorMessage(error.message || 'Une erreur inattendue s\'est produite');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className={`max-w-2xl mx-auto p-6 ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Contactez-nous
            </h2>
            <p className="text-gray-600">
              Nous vous répondrons dans les plus brefs délais
            </p>
          </div>

          {/* Message de succès */}
          {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Message envoyé avec succès ! Nous vous répondrons bientôt.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Message d'erreur global */}
          {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Champ Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={100}
                disabled={isSubmitting}
                className={`
              w-full px-4 py-3 border rounded-lg shadow-sm transition-colors duration-200
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${fieldErrors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500'
                }
            `}
                placeholder="Votre nom complet"
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name && (
                <p id="name-error" className="mt-2 text-sm text-red-600">
                  {fieldErrors.name}
                </p>
            )}
          </div>

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={254}
                disabled={isSubmitting}
                className={`
              w-full px-4 py-3 border rounded-lg shadow-sm transition-colors duration-200
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${fieldErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500'
                }
            `}
                placeholder="votre.email@exemple.com"
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {fieldErrors.email}
                </p>
            )}
          </div>

          {/* Champ Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                maxLength={2000}
                disabled={isSubmitting}
                className={`
              w-full px-4 py-3 border rounded-lg shadow-sm transition-colors duration-200
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:cursor-not-allowed resize-vertical
              ${fieldErrors.message
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500'
                }
            `}
                placeholder="Écrivez votre message ici..."
                aria-describedby={fieldErrors.message ? "message-error" : "message-help"}
            />
            <div className="flex justify-between items-center mt-2">
              {fieldErrors.message ? (
                  <p id="message-error" className="text-sm text-red-600">
                    {fieldErrors.message}
                  </p>
              ) : (
                  <p id="message-help" className="text-sm text-gray-500">
                    Minimum 10 caractères
                  </p>
              )}
              <span className={`text-sm ${formData.message.length > 1800 ? 'text-red-600' : 'text-gray-400'}`}>
              {formData.message.length}/2000
            </span>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="pt-4">
            <button
                type="submit"
                disabled={isSubmitting}
                className={`
              w-full flex justify-center items-center px-6 py-3 border border-transparent 
              text-base font-medium rounded-lg text-white transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:cursor-not-allowed
              ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                }
            `}
            >
              {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </>
              ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Envoyer le message
                  </>
              )}
            </button>
          </div>

          {/* Note de confidentialité */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              En envoyant ce formulaire, vous acceptez que vos données soient utilisées
              pour vous répondre. Elles ne seront pas partagées avec des tiers.
            </p>
          </div>
        </form>
      </div>
  );
};

export default ContactForm;