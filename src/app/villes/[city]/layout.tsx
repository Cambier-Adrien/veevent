"use client";
import { ReactNode, useRef, Suspense, useMemo } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerHead from "@/components/heads/banner-head/banner-head";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import ReviewCard from "@/components/cards/review-card/review-card";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCityData } from "@/hooks/cities/use-city-data";
import { useSearchPaginated } from "@/hooks/commons/use-search-paginated";
import PaginatedList from "@/components/commons/paginated-list/paginated-list";
import EventCard from "@/components/cards/event-card/event-card";
import NotFound from "@/app/not-found";

interface CitiesLayoutProps {
  children: ReactNode;
}

function CityLayoutContent({ children }: CitiesLayoutProps) {
  const { city } = useParams() as { city: string };
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const searchScrollTargetRef = useRef<HTMLElement>(null);

  const { city: cityData, loading } = useCityData(city);

  // Stabiliser les filtres pour éviter les re-renders
  const cityFilters = useMemo(
    () => ({
      cityName: cityData?.name || city,
    }),
    [cityData?.name, city]
  );

  // Nouvelle logique de recherche avec useSearchPaginated et filtre par ville
  const {
    query,
    setQuery,
    items: searchResults,
    loading: searchLoading,
    error: searchError,
    pagination: searchPagination,
    hasNextPage: searchHasNextPage,
    hasPreviousPage: searchHasPreviousPage,
    loadPage: searchLoadPage,
    loadPreviousPage: searchLoadPreviousPage,
    loadNextPage: searchLoadNextPage,
  } = useSearchPaginated({
    initialQuery,
    initialTypes: ["event"],
    pageSize: 20,
    scrollTargetRef: searchScrollTargetRef,
    filters: cityFilters,
  });

  const navigation = [
    { isHome: true, href: `/villes/${city}`, label: "Accueil" },
    { label: "Événements", href: `/villes/${city}/evenements` },
    { label: "Lieux", href: `/villes/${city}/lieux` },
    { label: "Organisateurs", href: `/villes/${city}/organisateurs` },
  ];

  // Rendu de chargement personnalisé pour la recherche
  const renderSearchLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton-bg h-80"></div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <main>
        {/* Skeleton du banner */}
        <div className="skeleton-bg h-64 w-full mb-6"></div>

        <div className="wrapper">
          {/* Skeleton du titre principal */}
          <div className="skeleton-bg h-8 w-3/4 mb-4"></div>

          {/* Skeleton du sous-titre */}
          <div className="skeleton-bg h-6 w-1/2 mb-6"></div>

          {/* Skeleton de la barre de recherche */}
          <div className="skeleton-bg h-12 w-full mb-8 rounded-lg"></div>

          {/* Skeleton du menu de navigation */}
          <div className="flex gap-4 mb-8">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton-bg h-10 w-24 rounded-lg"></div>
            ))}
          </div>

          {/* Skeleton de la grille d'événements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="skeleton-bg h-80 rounded-lg"></div>
            ))}
          </div>

          {/* Skeleton de la section avis */}
          <div className="mb-8">
            <div className="skeleton-bg h-6 w-48 mb-2"></div>
            <div className="skeleton-bg h-8 w-96 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="skeleton-bg h-48 rounded-lg"></div>
              ))}
            </div>
            <div className="skeleton-bg h-10 w-32 rounded-lg"></div>
          </div>

          {/* Skeleton de la section FAQ */}
          <div>
            <div className="skeleton-bg h-6 w-24 mb-2"></div>
            <div className="skeleton-bg h-8 w-80 mb-6"></div>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="skeleton-bg h-16 w-full mb-4 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!cityData) {
    return <NotFound />;
  }

  return (
    <main>
      <BannerHead city={cityData?.name || ""} bannerImage={cityData?.bannerUrl || undefined} />
      <section className="wrapper">
        <h1>Évènements et activités proche de la ville de {cityData?.name}</h1>
        <h3>Rechercher un évènement à {cityData?.name}</h3>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Concert, Festival, Conférence..."
        />
      </section>

      {/* Affichage des résultats de recherche avec PaginatedList */}
      {query && (
        <div>
          <h4 className="px-4 pt-2">Résultats de recherche</h4>
          <PaginatedList
            items={searchResults}
            loading={searchLoading}
            error={searchError}
            pagination={searchPagination}
            hasNextPage={searchHasNextPage}
            hasPreviousPage={searchHasPreviousPage}
            onPageChange={searchLoadPage}
            onPreviousPage={searchLoadPreviousPage}
            onNextPage={searchLoadNextPage}
            hasActiveFilters={false}
            onOpenFilters={() => {}}
            renderItem={(item: any, index: number) => (
              <EventCard
                key={item.event.id}
                id={item.event.id.toString()}
                event={item.event}
                minify={false}
                grid={true}
              />
            )}
            renderEmpty={() => (
              <div className="text-center text-gray-500 py-8">
                <p>Aucun événement trouvé à {cityData?.name || city}</p>
              </div>
            )}
            renderLoading={renderSearchLoading}
            showFilters={false}
            scrollTargetRef={searchScrollTargetRef}
          />
        </div>
      )}

      {/* Afficher le contenu normal seulement si pas de recherche active */}
      {!query && (
        <>
          <section className="wrapper">
            <BarMenu navigation={navigation} />
          </section>
          {children}
          <section className="wrapper">
            <CustomTitle
              title="Nos utilisateurs parlent de leur expérience à Nice"
              description="Avis"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReviewCard
                author="Jean Dupont"
                note={3}
                title="Je recommande cette platefomre pour trouver des artistes locaux"
                description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
                type="pop rock"
                place="Maison 13"
                city="Cannes"
              />
              <ReviewCard
                author="Jean Dupont"
                note={3}
                title="Je recommande cette platefomre pour trouver des artistes locaux"
                description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
                type="pop rock"
                place="Maison 13"
                city="Cannes"
              />
            </div>
            <Link href="#" className="secondary-btn">
              <span>Voir plus d'avis</span>
            </Link>
          </section>
          <section className="wrapper">
            <CustomTitle
              title="Questions fréquentes de nos utilisateurs"
              description="FAQ"
            />
            <FaqCard label="Comment acheter un billet de concert ?" />
            <FaqCard label="Comment acheter un billet de concert ?" />
            <FaqCard label="Comment acheter un billet de concert ?" />
          </section>
        </>
      )}
    </main>
  );
}

export default function CityLayout({ children }: CitiesLayoutProps) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CityLayoutContent children={children} />
    </Suspense>
  );
}
