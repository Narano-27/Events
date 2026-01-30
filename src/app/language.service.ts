import { Injectable, signal } from '@angular/core';

export interface Language {
  code: 'fr' | 'en';
  label: string;
  flag: string;
}

export interface Translations {
  home: {
    welcome: string;
    title: string;
    subtitle: string;
    description: string;
    eventManagement: string;
    eventManagementDesc: string;
    artistTracking: string;
    artistTrackingDesc: string;
    flexibleAssociations: string;
    flexibleAssociationsDesc: string;
  };
  nav: {
    home: string;
    events: string;
    artists: string;
  };
  events: {
    title: string;
    exploreUpcoming: string;
    fetchedFromApi: string;
    createEvent: string;
    newEvent: string;
    edit: string;
    delete: string;
    label: string;
    eventName: string;
    startDate: string;
    endDate: string;
    artists: string;
    noArtists: string;
    search: string;
    searchArtists: string;
    add: string;
    added: string;
    create: string;
    creating: string;
    update: string;
    saving: string;
    saveChanges: string;
    details: string;
    viewDetails: string;
    viewEventDetails: string;
    backToEvents: string;
    eventNotFound: string;
    deleteConfirm: string;
    deleteError: string;
    noEventsYet: string;
    addArtists: string;
    addArtistsInfo: string;
    manageArtists: string;
    manageArtistsInfo: string;
    currentArtists: string;
    noArtistsFound: string;
    addedArtists: string;
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    addArtistError: string;
    removeArtistError: string;
    nameMinLength: string;
  };
  artists: {
    title: string;
    exploreArtists: string;
    discoverAll: string;
    addArtist: string;
    newArtist: string;
    edit: string;
    delete: string;
    label: string;
    artistName: string;
    events: string;
    noEvents: string;
    search: string;
    searchEvents: string;
    add: string;
    added: string;
    create: string;
    creating: string;
    update: string;
    saving: string;
    saveChanges: string;
    details: string;
    viewProfile: string;
    viewArtistProfile: string;
    backToArtists: string;
    artistNotFound: string;
    deleteConfirm: string;
    deleteError: string;
    noArtistsYet: string;
    upcomingEvents: string;
    pastEvents: string;
    noEventsAssociated: string;
    addEvents: string;
    addEventsInfo: string;
    manageEvents: string;
    manageEventsInfo: string;
    currentEvents: string;
    noEventsFound: string;
    addedEvents: string;
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    addEventError: string;
    removeEventError: string;
    nameMinLength: string;
  };
  common: {
    previous: string;
    next: string;
    cancel: string;
    save: string;
    remove: string;
    page: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = signal<'fr' | 'en'>('fr');

  readonly languages: Language[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  private translations: Record<'fr' | 'en', Translations> = {
    fr: {
      home: {
        welcome: 'Bienvenue',
        title: 'Gestion d\'Événements & Artistes',
        subtitle: 'Organisez vos événements et gérez vos artistes en toute simplicité',
        description: 'Créez, modifiez et suivez vos événements. Associez des artistes et découvrez leurs participations. Tout en un seul endroit.',
        eventManagement: 'Gestion d\'événements',
        eventManagementDesc: 'Créez et organisez vos événements facilement',
        artistTracking: 'Suivi des artistes',
        artistTrackingDesc: 'Gérez votre base d\'artistes et leurs participations',
        flexibleAssociations: 'Associations flexibles',
        flexibleAssociationsDesc: 'Liez artistes et événements en quelques clics'
      },
      nav: {
        home: 'Accueil',
        events: 'Événements',
        artists: 'Artistes'
      },
      events: {
        title: 'Événements',
        exploreUpcoming: 'Découvrez les événements à venir',
        fetchedFromApi: 'Données récupérées directement de l\'API.',
        createEvent: '+ Créer un événement',
        newEvent: 'Nouvel Événement',
        edit: 'Modifier',
        delete: 'Supprimer',
        label: 'Nom',
        eventName: 'Nom de l\'événement',
        startDate: 'Date de début',
        endDate: 'Date de fin',
        artists: 'Artistes',
        noArtists: 'Aucun artiste',
        search: 'Rechercher',
        searchArtists: 'Rechercher des artistes par nom...',
        add: 'Ajouter',
        added: '✓ Ajouté',
        create: 'Créer',
        creating: 'Création...',
        update: 'Mettre à jour',
        saving: 'Enregistrement...',
        saveChanges: 'Enregistrer les modifications',
        details: 'Détails',
        viewDetails: 'Voir les détails',
        viewEventDetails: 'Voir les détails de l\'événement →',
        backToEvents: '← Retour aux événements',
        eventNotFound: 'Événement introuvable.',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
        deleteError: 'Échec de la suppression. Veuillez réessayer.',
        noEventsYet: 'Aucun événement pour le moment. Créez-en un dans l\'API pour le voir ici.',
        addArtists: 'Ajouter des artistes',
        addArtistsInfo: 'Recherchez et ajoutez des artistes à cet événement',
        manageArtists: 'Gérer les artistes',
        manageArtistsInfo: 'Ajoutez ou retirez des artistes de cet événement',
        currentArtists: 'Artistes actuels',
        noArtistsFound: 'Aucun artiste trouvé avec ce nom',
        addedArtists: 'Artistes ajoutés',
        createSuccess: 'Événement créé avec succès ! Vous pouvez maintenant ajouter des artistes.',
        createError: 'Échec de la création de l\'événement. Veuillez réessayer.',
        updateSuccess: 'Événement mis à jour avec succès !',
        updateError: 'Échec de la mise à jour de l\'événement. Veuillez réessayer.',
        addArtistError: 'Échec de l\'ajout de l\'artiste. Veuillez réessayer.',
        removeArtistError: 'Échec de la suppression de l\'artiste. Veuillez réessayer.',
        nameMinLength: 'Le nom de l\'événement doit contenir au moins 3 caractères.'
      },
      artists: {
        title: 'Artistes',
        exploreArtists: 'Explorez nos artistes',
        discoverAll: 'Découvrez tous les artistes enregistrés.',
        addArtist: '+ Ajouter un artiste',
        newArtist: 'Nouvel Artiste',
        edit: 'Modifier',
        delete: 'Supprimer',
        label: 'Nom',
        artistName: 'Nom de l\'artiste',
        events: 'Événements',
        noEvents: 'Aucun événement',
        search: 'Rechercher',
        searchEvents: 'Rechercher des événements par nom...',
        add: 'Ajouter',
        added: '✓ Ajouté',
        create: 'Créer',
        creating: 'Création...',
        update: 'Mettre à jour',
        saving: 'Enregistrement...',
        saveChanges: 'Enregistrer les modifications',
        details: 'Détails',
        viewProfile: 'Voir le profil',
        viewArtistProfile: 'Voir le profil de l\'artiste →',
        backToArtists: '← Retour aux artistes',
        artistNotFound: 'Artiste introuvable.',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
        deleteError: 'Échec de la suppression. Veuillez réessayer.',
        noArtistsYet: 'Aucun artiste pour le moment. Créez-en un pour le voir ici.',
        upcomingEvents: 'Événements à venir',
        pastEvents: 'Événements passés',
        noEventsAssociated: 'Aucun événement associé à cet artiste.',
        addEvents: 'Ajouter des événements',
        addEventsInfo: 'Recherchez et ajoutez des événements à cet artiste',
        manageEvents: 'Gérer les événements',
        manageEventsInfo: 'Ajoutez des événements de cet artiste',
        currentEvents: 'Événements actuels',
        noEventsFound: 'Aucun événement trouvé avec ce nom',
        addedEvents: 'Événements ajoutés',
        createSuccess: 'Artiste créé avec succès !',
        createError: 'Échec de la création de l\'artiste. Veuillez réessayer.',
        updateSuccess: 'Artiste mis à jour avec succès !',
        updateError: 'Échec de la mise à jour de l\'artiste. Veuillez réessayer.',
        addEventError: 'Échec de l\'ajout de l\'événement. Veuillez réessayer.',
        removeEventError: 'Échec de la suppression de l\'événement. Veuillez réessayer.',
        nameMinLength: 'Le nom de l\'artiste doit contenir au moins 3 caractères.'
      },
      common: {
        previous: 'Précédent',
        next: 'Suivant',
        cancel: 'Annuler',
        save: 'Enregistrer',
        remove: 'Retirer',
        page: 'Page'
      }
    },
    en: {
      home: {
        welcome: 'Welcome',
        title: 'Events & Artists Management',
        subtitle: 'Organize your events and manage your artists with ease',
        description: 'Create, edit and track your events. Link artists and discover their participations. Everything in one place.',
        eventManagement: 'Event Management',
        eventManagementDesc: 'Create and organize your events easily',
        artistTracking: 'Artist Tracking',
        artistTrackingDesc: 'Manage your artist database and their participations',
        flexibleAssociations: 'Flexible Associations',
        flexibleAssociationsDesc: 'Link artists and events in just a few clicks'
      },
      nav: {
        home: 'Home',
        events: 'Events',
        artists: 'Artists'
      },
      events: {
        title: 'Events',
        exploreUpcoming: 'Explore upcoming events',
        fetchedFromApi: 'Fetched directly from the API.',
        createEvent: '+ Create Event',
        newEvent: 'New Event',
        edit: 'Edit',
        delete: 'Delete',
        label: 'Name',
        eventName: 'Event Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        artists: 'Artists',
        noArtists: 'No artists',
        search: 'Search',
        searchArtists: 'Search artists by name...',
        add: 'Add',
        added: '✓ Added',
        create: 'Create',
        creating: 'Creating...',
        update: 'Update',
        saving: 'Saving...',
        saveChanges: 'Save Changes',
        details: 'Details',
        viewDetails: 'View details',
        viewEventDetails: 'View Event Details →',
        backToEvents: '← Back to events',
        eventNotFound: 'Event not found.',
        deleteConfirm: 'Are you sure you want to delete',
        deleteError: 'Failed to delete. Please try again.',
        noEventsYet: 'No events yet. Create one in the API to see it here.',
        addArtists: 'Add Artists',
        addArtistsInfo: 'Search and add artists to this event',
        manageArtists: 'Manage Artists',
        manageArtistsInfo: 'Add or remove artists from this event',
        currentArtists: 'Current Artists',
        noArtistsFound: 'No artists found with that name',
        addedArtists: 'Added Artists',
        createSuccess: 'Event created successfully! Now you can add artists.',
        createError: 'Failed to create event. Please try again.',
        updateSuccess: 'Event updated successfully!',
        updateError: 'Failed to update event. Please try again.',
        addArtistError: 'Failed to add artist. Please try again.',
        removeArtistError: 'Failed to remove artist. Please try again.',
        nameMinLength: 'Event name must be at least 3 characters long.'
      },
      artists: {
        title: 'Artists',
        exploreArtists: 'Explore our artists',
        discoverAll: 'Discover all registered artists.',
        addArtist: '+ Add Artist',
        newArtist: 'New Artist',
        edit: 'Edit',
        delete: 'Delete',
        label: 'Name',
        artistName: 'Artist Name',
        events: 'Events',
        noEvents: 'No events',
        search: 'Search',
        searchEvents: 'Search events by name...',
        add: 'Add',
        added: '✓ Added',
        create: 'Create',
        creating: 'Creating...',
        update: 'Update',
        saving: 'Saving...',
        saveChanges: 'Save Changes',
        details: 'Details',
        viewProfile: 'View profile',
        viewArtistProfile: 'View Artist Profile →',
        backToArtists: '← Back to artists',
        artistNotFound: 'Artist not found.',
        deleteConfirm: 'Are you sure you want to delete',
        deleteError: 'Failed to delete. Please try again.',
        noArtistsYet: 'No artists yet. Create one to see it here.',
        upcomingEvents: 'Upcoming Events',
        pastEvents: 'Past Events',
        noEventsAssociated: 'No events associated with this artist.',
        addEvents: 'Add Events',
        addEventsInfo: 'Search and add events to this artist',
        manageEvents: 'Manage Events',
        manageEventsInfo: 'Add events from this artist',
        currentEvents: 'Current Events',
        noEventsFound: 'No events found with that name',
        addedEvents: 'Added Events',
        createSuccess: 'Artist created successfully!',
        createError: 'Failed to create artist. Please try again.',
        updateSuccess: 'Artist updated successfully!',
        updateError: 'Failed to update artist. Please try again.',
        addEventError: 'Failed to add event. Please try again.',
        removeEventError: 'Failed to remove event. Please try again.',
        nameMinLength: 'Artist name must be at least 3 characters long.'
      },
      common: {
        previous: 'Previous',
        next: 'Next',
        cancel: 'Cancel',
        save: 'Save',
        remove: 'Remove',
        page: 'Page'
      }
    }
  };

  getCurrentLanguage() {
    return this.currentLanguage();
  }

  setLanguage(code: 'fr' | 'en') {
    this.currentLanguage.set(code);
  }

  getTranslations(): Translations {
    return this.translations[this.currentLanguage()];
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage()];
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return key;
    }
    return value;
  }
}
