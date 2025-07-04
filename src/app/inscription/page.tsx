"use client";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useHeader } from "@/contexts/header-context";
import { useAuth } from "@/contexts/auth-context";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";
import { PasswordStrength } from "@/components/commons/password-strength/password-strength";
import { ProgressSteps } from "@/components/commons/progress-steps/progress-steps";

interface FormData {
  // Étape 1: Login
  email: string;
  pseudo: string;
  password: string;
  confirmPassword: string;
  
  // Étape 2: Informations personnelles
  firstName: string;
  lastName: string;
  phone: string;
  description: string;
  
  // Étape 3: Préférences
  categoryKeys: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const { setHideCitySelector } = useHeader();
  const { register, loading, error, clearError } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<FormData>({
    email: "",
    pseudo: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    description: "",
    categoryKeys: [],
  });

  useEffect(() => {
    setHideCitySelector(true);
    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  // Nettoyer les erreurs quand l'utilisateur modifie les champs
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, error, clearError]);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        // En cas d'erreur, utiliser les thèmes par défaut
        const fallbackCategories: Category[] = [
          { name: "Musique", key: "musique", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Sport", key: "sport", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Art", key: "art", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Cinéma", key: "cinema", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Théâtre", key: "theatre", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Jeux Vidéo", key: "jeux-video", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Cuisine", key: "cuisine", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Voyage", key: "voyage", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Photographie", key: "photographie", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Mode", key: "mode", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Technologie", key: "technologie", description: "", trending: true, _links: { self: { href: "" } } },
          { name: "Nature", key: "nature", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Bien-être", key: "bien-etre", description: "", trending: true, _links: { self: { href: "" } } },
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Validation des champs par étape
  const validateStep = (currentStep: number): boolean => {
    const errors: ValidationErrors = {};

    switch (currentStep) {
      case 1:
        // Validation email
        if (!formData.email) {
          errors.email = "L'adresse email est requise";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = "Format d'email invalide";
        }

        // Validation pseudo
        if (!formData.pseudo) {
          errors.pseudo = "Le pseudo est requis";
        } else if (formData.pseudo.length < 3) {
          errors.pseudo = "Le pseudo doit contenir au moins 3 caractères";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut contenir que des lettres, chiffres et underscores";
        }

        // Validation mot de passe
        if (!formData.password) {
          errors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 6) {
          errors.password = "Le mot de passe doit contenir au moins 6 caractères";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          errors.password = "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
        }

        // Validation confirmation mot de passe
        if (!formData.confirmPassword) {
          errors.confirmPassword = "La confirmation du mot de passe est requise";
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        break;

      case 2:
        // Validation prénom
        if (!formData.firstName) {
          errors.firstName = "Le prénom est requis";
        } else if (formData.firstName.length < 2) {
          errors.firstName = "Le prénom doit contenir au moins 2 caractères";
        }

        // Validation nom
        if (!formData.lastName) {
          errors.lastName = "Le nom est requis";
        } else if (formData.lastName.length < 2) {
          errors.lastName = "Le nom doit contenir au moins 2 caractères";
        }

        // Validation téléphone (optionnel mais format si fourni)
        if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
          errors.phone = "Format de téléphone invalide";
        }
        break;

      case 3:
        // Validation catégories (optionnel mais recommandé)
        if (formData.categoryKeys.length === 0) {
          errors.categories = "Sélectionnez au moins une catégorie d'intérêt";
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Nettoyer l'erreur du champ modifié
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCategoriesChange = (selectedCategories: string[]) => {
    setFormData(prev => ({ ...prev, categoryKeys: selectedCategories }));
    
    // Nettoyer l'erreur des catégories
    if (validationErrors.categoryKeys) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categoryKeys;
        return newErrors;
      });
    }
  };

  const handleNextStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
             // Finalisation de l'inscription
       try {
         const registerData = {
           email: formData.email,
           password: formData.password,
           lastName: formData.lastName,
           firstName: formData.firstName,
           pseudo: formData.pseudo,
           phone: formData.phone || null,
           description: formData.description || null,
           imageUrl: null,
           bannerUrl: "",
           categoryKeys: formData.categoryKeys,
         };

         console.log(registerData);

         const success = await register(registerData, "/compte/tickets");
         if (success) {
           // Redirection vers le profil après inscription réussie
           window.location.href = "/compte/tickets";
         }
       } catch (error) {
         console.error("Erreur lors de l'inscription:", error);
       }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressSteps = [
    {
      name: "Compte",
      value: 1,
      completed: step > 1,
      current: step === 1,
    },
    {
      name: "Profil",
      value: 2,
      completed: step > 2,
      current: step === 2,
    },
    {
      name: "Préférences",
      value: 3,
      completed: step > 3,
      current: step === 3,
    },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Adresse mail*</label>
              <input
                className={`input ${validationErrors.email ? 'border-red-500' : ''}`}
                type="email"
                placeholder="exemple@mail.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                disabled={loading}
                required
              />
              {validationErrors.email && (
                <span className="text-red-500 text-sm">{validationErrors.email}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Pseudo*</label>
              <input
                className={`input ${validationErrors.pseudo ? 'border-red-500' : ''}`}
                type="text"
                placeholder="@veevent"
                value={formData.pseudo}
                onChange={handleInputChange('pseudo')}
                disabled={loading}
                required
              />
              {validationErrors.pseudo && (
                <span className="text-red-500 text-sm">{validationErrors.pseudo}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Mot de passe*</label>
              <input
                className={`input ${validationErrors.password ? 'border-red-500' : ''}`}
                type="password"
                placeholder="******"
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={loading}
                required
              />
              <PasswordStrength password={formData.password} />
              {validationErrors.password && (
                <span className="text-red-500 text-sm">{validationErrors.password}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Confirmer le mot de passe*</label>
              <input
                className={`input ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                type="password"
                placeholder="******"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                disabled={loading}
                required
              />
              {validationErrors.confirmPassword && (
                <span className="text-red-500 text-sm">{validationErrors.confirmPassword}</span>
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Prénom*</label>
              <input
                className={`input ${validationErrors.firstName ? 'border-red-500' : ''}`}
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                disabled={loading}
                required
              />
              {validationErrors.firstName && (
                <span className="text-red-500 text-sm">{validationErrors.firstName}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Nom*</label>
              <input
                className={`input ${validationErrors.lastName ? 'border-red-500' : ''}`}
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                disabled={loading}
                required
              />
              {validationErrors.lastName && (
                <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Téléphone</label>
              <input
                className={`input ${validationErrors.phone ? 'border-red-500' : ''}`}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                disabled={loading}
              />
              {validationErrors.phone && (
                <span className="text-red-500 text-sm">{validationErrors.phone}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Description</label>
              <textarea
                className="input min-h-[100px] resize-vertical"
                placeholder="Quelques mots pour vous décrire..."
                value={formData.description}
                onChange={handleInputChange('description')}
                disabled={loading}
              />
            </div>
          </>
        );

      case 3:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Sélectionnez vos centres d'intérêts :
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choisissez les catégories qui vous intéressent pour personnaliser votre expérience
              </p>
            </div>

            {loadingCategories ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des catégories...</p>
              </div>
            ) : (
              <SelectorThemeTags
                categories={categories}
                selectedThemes={formData.categoryKeys}
                onSelectionChange={handleCategoriesChange}
                itemsPerPage={8}
                showMoreLabel="Afficher plus de catégories"
              />
            )}

            {validationErrors.categoryKeys && (
              <span className="text-red-500 text-sm">{validationErrors.categoryKeys}</span>
            )}

            {formData.categoryKeys.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-primary-600">
                  <strong>{formData.categoryKeys.length}</strong> catégorie
                  {formData.categoryKeys.length > 1 ? "s" : ""} sélectionnée
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main>
      <section className="wrapper flex items-center">
        <p className="font-semibold text-base">
          Bienvenue sur{" "}
          <span className="text-[var(--primary-600)]">veevent</span>
        </p>
        
        <ProgressSteps steps={progressSteps} className="mb-6" />
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm w-full">
            {error}
          </div>
        )}
        
        <form onSubmit={handleNextStep} className="w-full">
          {renderStep()}
          
          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="secondary-btn flex-1"
                disabled={loading}
              >
                Précédent
              </button>
            )}
            
            <button
              className="primary-btn flex-1"
              type="submit"
              disabled={loading || (step === 3 && formData.categoryKeys.length === 0)}
            >
              <span>
                {loading 
                  ? "Inscription en cours..." 
                  : step === 3 
                    ? "Créer mon compte" 
                    : "Suivant"
                }
              </span>
            </button>
          </div>
        </form>
        
        <p className="font-bold">
          Vous avez déjà un compte ?{" "}
          <Link className="text-primary-600" href="/connexion">
            Connectez-vous
          </Link>
        </p>
      </section>
    </main>
  );
}
