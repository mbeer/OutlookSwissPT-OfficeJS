// OutlookSwissPTTimetable – Translation dictionary

export const owpttTranslations = {
  "en-GB": {
    // App / UI
    "app.title": "Swiss public transport timetable",
    "app.subtitle": "Timetable for outbound and return journeys to this appointment.",
    "app.settingsAria": "Open settings",

    "sideload.title": "Add-in not loaded yet",
    "sideload.text": "Please sideload the add-in in Outlook to display the timetable query.",
    "sideload.link": "Learn more",

    "appointment.title": "Current appointment",
    "appointment.refreshButton": "Refresh appointment data",

    "meetingLocation.title": "Stop near meeting location",
    "meetingLocation.stationLabel": "Stop at meeting location:",
    "meetingLocation.stationPlaceholder": "e.g. Bern, Bundesplatz",
    "meetingLocation.walkLabel": "Walking time (min):",

    "inbound.title": "Outbound journey (to appointment)",
    "inbound.fromLabel": "Outbound from:",
    "inbound.fromPlaceholder": "e.g. Zürich HB",
    "inbound.walkLabel": "Walking time (min):",
    "inbound.searchButton": "Search connections",
    "inbound.tableCaption": "Outbound connections to the appointment",
    "inbound.empty": "No connections loaded yet. Please search first.",
    "inbound.insertButton": "Insert outbound journey in calendar",

    "outbound.title": "Return journey (from appointment)",
    "outbound.toLabel": "Return to:",
    "outbound.toPlaceholder": "e.g. Mürren (Schilthornbahn)",
    "outbound.walkLabel": "Walking time (min):",
    "outbound.searchButton": "Search connections",
    "outbound.tableCaption": "Return connections from the appointment",
    "outbound.empty": "No connections loaded yet. Please search first.",
    "outbound.insertButton": "Insert return journey in calendar",

    "connections.departure": "Departure",
    "connections.arrival": "Arrival",
    "connections.duration": "Duration",
    "connections.route": "Route",

    // Item-info labels
    "item.subjectLabel": "Subject",
    "item.locationLabel": "Location",
    "item.startLabel": "Start",
    "item.endLabel": "End",

    // Status / error messages
    "status.uiIncomplete": "The timetable view is not fully initialised.",
    "status.missingFields.inbound":
      "Please specify both origin and meeting stop for the outbound journey.",
    "status.missingFields.outbound":
      "Please specify both meeting stop and destination for the return journey.",
    "status.noItem": "Could not read appointment information from Outlook.",
    "status.searchingInbound": "Searching connections to the appointment…",
    "status.searchingOutbound": "Searching connections from the appointment…",
    "status.searchError": "The timetable query failed.",
    "status.noConnectionsYet": "Please search for connections first.",
    "status.selectConnection": "Please select a connection.",
    "status.invalidConnection": "This connection is not valid.",
    "status.invalidTimes": "This connection does not contain valid departure/arrival times.",
    "status.noMailbox": "No mailbox context is available.",
    "status.noDisplayNewAppointmentApi":
      "This Outlook client cannot open a new appointment window from the current context. Please use the new Outlook or create the appointment manually.",
    "status.displayAppointmentFailed": "Opening the appointment window failed.",
    "status.favoritesImported": "Standard stops imported successfully.",

    // Error messages
    "error.copyDetails": "Copy details",
    "error.dismiss": "Dismiss",
    "error.unexpected": "An unexpected error occurred while initialising the add-in.",
    "error.unhandledRejection": "Unhandled promise rejection occurred.",

    // Calendar subject / location
    "calendar.transferPrefix": "Transfer",
    "calendar.location.publicTransport": "Public transport",

    "settings.title": "Settings",
    "settings.tab.stops": "Favourite stops",
    "settings.description": "Customise your add-in preferences.",

    "settings.language.title": "Language",
    "settings.language.description": "Choose the display language for the add-in.",
    "settings.language.label": "Display language:",
    "settings.language.auto": "Automatic (from Outlook)",

    "settings.stops.title": "Favourite stops",
    "settings.stops.description":
      "Define stops and walking times you use frequently. They are offered as presets in the station fields.",
    "settings.stops.column.stop": "Stop / place",
    "settings.stops.column.walkMinutes": "Walking time (min)",
    "settings.stops.emptyHint":
      "Add your most frequently used stops together with the walking time in minutes.",

    "settings.stops.button.moveUp": "Move up",
    "settings.stops.button.moveDown": "Move down",
    "settings.stops.button.sortAZ": "Sort A–Z",
    "settings.stops.button.delete": "Delete selected row",
    "settings.stops.button.addRow": "New row",

    "settings.stops.exportTitle": "Export / import",
    "settings.stops.exportDescription":
      "To export, copy the content of the field below. To import on another PC, paste the copied content into this field and click 'Import list'.",
    "settings.stops.button.import": "Import list",

    "settings.close": "Close",

    "favorites.dropdownPlaceholder": "Choose a favourite stop or type a new one",
  },

  "de-CH": {
    // App / UI
    "app.title": "Reiseplanung mit dem öffentlichen Verkehr",
    "app.subtitle": "Fahrplan für Hin- und Rückreise zu diesem Termin.",
    "app.settingsAria": "Einstellungen öffnen",

    "sideload.title": "Add-in noch nicht geladen",
    "sideload.text": "Bitte laden Sie das Add-in in Outlook, um die Fahrplanabfrage anzuzeigen.",
    "sideload.link": "Weitere Informationen",

    "appointment.title": "Aktueller Termin",
    "appointment.refreshButton": "Termindaten aktualisieren",

    "meetingLocation.title": "Haltestelle beim Terminort",
    "meetingLocation.stationLabel": "Haltestelle beim Terminort:",
    "meetingLocation.stationPlaceholder": "z. B. Bern, Bundesplatz",
    "meetingLocation.walkLabel": "Gehzeit (min):",

    "inbound.title": "Hinreise (zum Termin)",
    "inbound.fromLabel": "Hinreise von:",
    "inbound.fromPlaceholder": "z. B. Zürich HB",
    "inbound.walkLabel": "Gehzeit (min):",
    "inbound.searchButton": "Verbindungen suchen",
    "inbound.tableCaption": "Hinreise-Verbindungen zum Termin",
    "inbound.empty": "Noch keine Verbindungen geladen. Bitte zuerst suchen.",
    "inbound.insertButton": "Hinreise in Kalender eintragen",

    "outbound.title": "Rückreise (vom Termin)",
    "outbound.toLabel": "Rückreise nach:",
    "outbound.toPlaceholder": "z. B. Luzern",
    "outbound.walkLabel": "Gehzeit (min):",
    "outbound.searchButton": "Verbindungen suchen",
    "outbound.tableCaption": "Rückreise-Verbindungen vom Termin",
    "outbound.empty": "Noch keine Verbindungen geladen. Bitte zuerst suchen.",
    "outbound.insertButton": "Rückreise in Kalender eintragen",

    "connections.departure": "Abfahrt",
    "connections.arrival": "Ankunft",
    "connections.duration": "Dauer",
    "connections.route": "Route",

    // Item-info labels
    "item.subjectLabel": "Betreff",
    "item.locationLabel": "Ort",
    "item.startLabel": "Beginn",
    "item.endLabel": "Ende",

    // Status / Fehlermeldungen
    "status.uiIncomplete": "Die Fahrplanansicht ist noch nicht vollständig initialisiert.",
    "status.missingFields.inbound":
      "Bitte geben Sie sowohl Startort als auch Haltestelle beim Termin für die Hinreise an.",
    "status.missingFields.outbound":
      "Bitte geben Sie sowohl Haltestelle beim Termin als auch Zielort für die Rückreise an.",
    "status.noItem": "Die Termininformationen konnten nicht aus Outlook gelesen werden.",
    "status.searchingInbound": "Suche Verbindungen zum Termin …",
    "status.searchingOutbound": "Suche Verbindungen vom Termin …",
    "status.searchError": "Die Fahrplanabfrage ist fehlgeschlagen.",
    "status.noConnectionsYet": "Bitte suchen Sie zuerst nach Verbindungen.",
    "status.selectConnection": "Bitte wählen Sie eine Verbindung aus.",
    "status.invalidConnection": "Diese Verbindung ist ungültig.",
    "status.invalidTimes": "Diese Verbindung enthält keine gültigen Abfahrts- und Ankunftszeiten.",
    "status.noMailbox": "Es ist kein Postfach-Kontext verfügbar.",
    "status.noDisplayNewAppointmentApi":
      "Dieser Outlook-Client kann aus dem aktuellen Kontext kein neues Terminfenster öffnen. Bitte verwenden Sie das neue Outlook oder erstellen Sie den Termin manuell.",
    "status.displayAppointmentFailed": "Das Öffnen des Terminfensters ist fehlgeschlagen.",
    "status.favoritesImported": "Standardhaltestellen erfolgreich importiert.",

    // Fehlermeldungen
    "error.copyDetails": "Details kopieren",
    "error.dismiss": "Schliessen",
    "error.unexpected": "Ein unerwarteter Fehler ist beim Initialisieren des Add-ins aufgetreten.",
    "error.unhandledRejection": "Ein nicht behandelter Promise-Fehler ist aufgetreten.",

    // Kalender
    "calendar.transferPrefix": "Transfer",
    "calendar.location.publicTransport": "Öffentlicher Verkehr",

    "settings.title": "Einstellungen",
    "settings.tab.stops": "Standardhaltestellen",
    "settings.description": "Passen Sie Ihre Add-in-Einstellungen an.",

    "settings.language.title": "Sprache",
    "settings.language.description": "Wählen Sie die Anzeigesprache für das Add-in.",
    "settings.language.label": "Anzeigesprache:",
    "settings.language.auto": "Automatisch (von Outlook)",

    "settings.stops.title": "Standardhaltestellen",
    "settings.stops.description":
      "Lege hier Haltestellen und Gehzeiten fest, die du häufig verwendest. Sie werden in den Feldern für die Haltestelle als Vorauswahl angeboten.",
    "settings.stops.column.stop": "Haltestelle / Ort",
    "settings.stops.column.walkMinutes": "Gehzeit (Min.)",
    "settings.stops.emptyHint":
      "Füge deine meistbenutzten Haltestellen mit der jeweiligen Gehzeit in Minuten hinzu.",

    "settings.stops.button.moveUp": "Nach oben",
    "settings.stops.button.moveDown": "Nach unten",
    "settings.stops.button.sortAZ": "A–Z sortieren",
    "settings.stops.button.delete": "Ausgewählte Zeile löschen",
    "settings.stops.button.addRow": "Neue Zeile",

    "settings.stops.exportTitle": "Export / Import",
    "settings.stops.exportDescription":
      "Zum Exportieren kopiere den Inhalt des folgenden Feldes. Zum Importieren auf einem anderen PC füge den kopierten Inhalt in dieses Feld ein und klicke auf 'Liste importieren'.",
    "settings.stops.button.import": "Liste importieren",

    "settings.close": "Schliessen",

    "favorites.dropdownPlaceholder": "Standardhaltestelle wählen oder neuen Ort eingeben",
  },

  "fr-CH": {
    // App / UI
    "app.title": "Horaire des transports publics suisses",
    "app.subtitle": "Horaire pour les trajets aller et retour liés à ce rendez-vous.",
    "app.settingsAria": "Ouvrir les paramètres",

    "sideload.title": "Complément pas encore chargé",
    "sideload.text":
      "Veuillez charger le complément dans Outlook pour afficher la recherche d’horaire.",
    "sideload.link": "En savoir plus",

    "appointment.title": "Rendez-vous actuel",
    "appointment.refreshButton": "Actualiser les données du rendez-vous",

    "meetingLocation.title": "Arrêt à proximité du rendez-vous",
    "meetingLocation.stationLabel": "Arrêt au lieu du rendez-vous :",
    "meetingLocation.stationPlaceholder": "p. ex. Bern, Bundesplatz",
    "meetingLocation.walkLabel": "Temps de marche (min) :",

    "inbound.title": "Trajet aller (vers le rendez-vous)",
    "inbound.fromLabel": "Trajet aller depuis :",
    "inbound.fromPlaceholder": "p. ex. Genève",
    "inbound.walkLabel": "Temps de marche (min) :",
    "inbound.searchButton": "Rechercher des correspondances",
    "inbound.tableCaption": "Correspondances aller vers le rendez-vous",
    "inbound.empty":
      "Aucune correspondance chargée pour l’instant. Veuillez d’abord lancer une recherche.",
    "inbound.insertButton": "Inscrire le trajet aller dans l’agenda",

    "outbound.title": "Trajet retour (depuis le rendez-vous)",
    "outbound.toLabel": "Trajet retour vers :",
    "outbound.toPlaceholder": "p. ex. Grattavache, village",
    "outbound.walkLabel": "Temps de marche (min) :",
    "outbound.searchButton": "Rechercher des correspondances",
    "outbound.tableCaption": "Correspondances retour depuis le rendez-vous",
    "outbound.empty":
      "Aucune correspondance chargée pour l’instant. Veuillez d’abord lancer une recherche.",
    "outbound.insertButton": "Inscrire le trajet retour dans l’agenda",

    "connections.departure": "Départ",
    "connections.arrival": "Arrivée",
    "connections.duration": "Durée",
    "connections.route": "Itinéraire",

    // Item-info labels
    "item.subjectLabel": "Objet",
    "item.locationLabel": "Lieu",
    "item.startLabel": "Début",
    "item.endLabel": "Fin",

    // Status / messages d’erreur
    "status.uiIncomplete": "La vue d’horaire n’est pas encore entièrement initialisée.",
    "status.missingFields.inbound":
      "Veuillez indiquer à la fois le point de départ et l’arrêt du rendez-vous pour le trajet aller.",
    "status.missingFields.outbound":
      "Veuillez indiquer à la fois l’arrêt du rendez-vous et le point d’arrivée pour le trajet retour.",
    "status.noItem": "Les informations du rendez-vous n’ont pas pu être lues depuis Outlook.",
    "status.searchingInbound": "Recherche de correspondances vers le rendez-vous…",
    "status.searchingOutbound": "Recherche de correspondances depuis le rendez-vous…",
    "status.searchError": "La recherche d’horaire a échoué.",
    "status.noConnectionsYet": "Veuillez d’abord rechercher des correspondances.",
    "status.selectConnection": "Veuillez sélectionner une correspondance.",
    "status.invalidConnection": "Cette correspondance n’est pas valable.",
    "status.invalidTimes":
      "Cette correspondance ne contient pas d’horaires de départ/arrivée valables.",
    "status.noMailbox": "Aucun contexte de boîte aux lettres n’est disponible.",
    "status.noDisplayNewAppointmentApi":
      "Ce client Outlook ne peut pas ouvrir une nouvelle fenêtre de rendez-vous depuis ce contexte. Veuillez utiliser le nouveau Outlook ou créer le rendez-vous manuellement.",
    "status.displayAppointmentFailed": "L’ouverture de la fenêtre de rendez-vous a échoué.",
    "status.favoritesImported": "Arrêts favoris importés avec succès.",

    // Messages d’erreur
    "error.copyDetails": "Copier les détails",
    "error.dismiss": "Fermer",
    "error.unexpected":
      "Une erreur inattendue s’est produite lors de l’initialisation du complément.",
    "error.unhandledRejection": "Un rejet de promesse non géré s’est produit.",

    // Calendrier
    "calendar.transferPrefix": "Transfert",
    "calendar.location.publicTransport": "Transports publics",

    "settings.title": "Paramètres",
    "settings.tab.stops": "Arrêts favoris",
    "settings.description": "Personnalisez vos préférences de complément.",

    "settings.language.title": "Langue",
    "settings.language.description": "Choisissez la langue d'affichage du complément.",
    "settings.language.label": "Langue d'affichage :",
    "settings.language.auto": "Automatique (depuis Outlook)",

    "settings.stops.title": "Arrêts favoris",
    "settings.stops.description":
      "Définissez ici les arrêts et temps de marche que vous utilisez souvent. Ils sont proposés comme présélection dans les champs d’arrêt.",
    "settings.stops.column.stop": "Arrêt / lieu",
    "settings.stops.column.walkMinutes": "Temps de marche (min)",
    "settings.stops.emptyHint":
      "Ajoutez vos arrêts les plus utilisés avec le temps de marche en minutes.",

    "settings.stops.button.moveUp": "Monter",
    "settings.stops.button.moveDown": "Descendre",
    "settings.stops.button.sortAZ": "Trier A–Z",
    "settings.stops.button.delete": "Supprimer la ligne sélectionnée",
    "settings.stops.button.addRow": "Nouvelle ligne",

    "settings.stops.exportTitle": "Exporter / importer",
    "settings.stops.exportDescription":
      "Pour exporter, copiez le contenu du champ ci-dessous. Pour importer sur un autre PC, collez le contenu copié dans ce champ et cliquez sur 'Importer la liste'.",
    "settings.stops.button.import": "Importer la liste",

    "settings.close": "Fermer",

    "favorites.dropdownPlaceholder": "Choisir un arrêt favori ou saisir un nouveau lieu",
  },

  "it-CH": {
    // App / UI
    "app.title": "Orario dei trasporti pubblici svizzeri",
    "app.subtitle": "Orario per i viaggi di andata e ritorno relativi a questo appuntamento.",
    "app.settingsAria": "Apri impostazioni",

    "sideload.title": "Component aggiuntivo non ancora caricato",
    "sideload.text":
      "Carichi il componente aggiuntivo in Outlook per visualizzare la ricerca orario.",
    "sideload.link": "Maggiori informazioni",

    "appointment.title": "Appuntamento attuale",
    "appointment.refreshButton": "Aggiorna dati dell’appuntamento",

    "meetingLocation.title": "Fermata vicino al luogo dell’appuntamento",
    "meetingLocation.stationLabel": "Fermata presso il luogo dell’appuntamento:",
    "meetingLocation.stationPlaceholder": "p. es. Köniz, Lerbermatt",
    "meetingLocation.walkLabel": "Tempo a piedi (min):",

    "inbound.title": "Viaggio di andata (verso l’appuntamento)",
    "inbound.fromLabel": "Andata da:",
    "inbound.fromPlaceholder": "p. es. Lugano",
    "inbound.walkLabel": "Tempo a piedi (min):",
    "inbound.searchButton": "Cerca collegamenti",
    "inbound.tableCaption": "Collegamenti di andata verso l’appuntamento",
    "inbound.empty": "Nessun collegamento caricato. Cerchi prima dei collegamenti.",
    "inbound.insertButton": "Inserisci viaggio di andata nel calendario",

    "outbound.title": "Viaggio di ritorno (dall’appuntamento)",
    "outbound.toLabel": "Ritorno a:",
    "outbound.toPlaceholder": "p. es. Mergoscia, Posta",
    "outbound.walkLabel": "Tempo a piedi (min):",
    "outbound.searchButton": "Cerca collegamenti",
    "outbound.tableCaption": "Collegamenti di ritorno dall’appuntamento",
    "outbound.empty": "Nessun collegamento caricato. Cerchi prima dei collegamenti.",
    "outbound.insertButton": "Inserisci viaggio di ritorno nel calendario",

    "connections.departure": "Partenza",
    "connections.arrival": "Arrivo",
    "connections.duration": "Durata",
    "connections.route": "Percorso",

    // Item-info labels
    "item.subjectLabel": "Oggetto",
    "item.locationLabel": "Luogo",
    "item.startLabel": "Inizio",
    "item.endLabel": "Fine",

    // Stato / messaggi di errore
    "status.uiIncomplete": "La vista dell’orario non è ancora completamente inizializzata.",
    "status.missingFields.inbound":
      "Indichi sia il punto di partenza sia la fermata presso l’appuntamento per il viaggio di andata.",
    "status.missingFields.outbound":
      "Indichi sia la fermata presso l’appuntamento sia il punto di arrivo per il viaggio di ritorno.",
    "status.noItem": "Le informazioni dell’appuntamento non hanno potuto essere lette da Outlook.",
    "status.searchingInbound": "Ricerca di collegamenti verso l’appuntamento…",
    "status.searchingOutbound": "Ricerca di collegamenti dall’appuntamento…",
    "status.searchError": "La ricerca dell’orario non è riuscita.",
    "status.noConnectionsYet": "Cerchi prima dei collegamenti.",
    "status.selectConnection": "Selezioni un collegamento.",
    "status.invalidConnection": "Questo collegamento non è valido.",
    "status.invalidTimes": "Questo collegamento non contiene orari di partenza/arrivo validi.",
    "status.noMailbox": "Nessun contesto di cassetta postale disponibile.",
    "status.noDisplayNewAppointmentApi":
      "Questo client di Outlook non può aprire una nuova finestra di appuntamento da questo contesto. Utilizzi il nuovo Outlook oppure crei l’appuntamento manualmente.",
    "status.displayAppointmentFailed": "Apertura della finestra dell’appuntamento non riuscita.",
    "status.favoritesImported": "Fermate preferite importate con successo.",

    // Messaggi di errore
    "error.copyDetails": "Copia dettagli",
    "error.dismiss": "Chiudi",
    "error.unexpected":
      "Si è verificato un errore imprevisto durante l’inizializzazione del componente aggiuntivo.",
    "error.unhandledRejection": "Si è verificato un rifiuto di promessa non gestito.",

    // Calendario
    "calendar.transferPrefix": "Transfer",
    "calendar.location.publicTransport": "Trasporti pubblici",

    "settings.title": "Impostazioni",
    "settings.tab.stops": "Fermate preferite",
    "settings.description": "Personalizza le preferenze del componente aggiuntivo.",

    "settings.language.title": "Lingua",
    "settings.language.description": "Scegli la lingua di visualizzazione del componente aggiuntivo.",
    "settings.language.label": "Lingua di visualizzazione:",
    "settings.language.auto": "Automatico (da Outlook)",

    "settings.stops.title": "Fermate preferite",
    "settings.stops.description":
      "Definisci qui le fermate e i tempi a piedi che usi spesso. Verranno proposti come preselezione nei campi della fermata.",
    "settings.stops.column.stop": "Fermata / luogo",
    "settings.stops.column.walkMinutes": "Tempo a piedi (min)",
    "settings.stops.emptyHint":
      "Aggiungi le fermate che usi più spesso con il rispettivo tempo a piedi in minuti.",

    "settings.stops.button.moveUp": "Sposta in alto",
    "settings.stops.button.moveDown": "Sposta in basso",
    "settings.stops.button.sortAZ": "Ordina A–Z",
    "settings.stops.button.delete": "Elimina riga selezionata",
    "settings.stops.button.addRow": "Nova riga",

    "settings.stops.exportTitle": "Esporta / importa",
    "settings.stops.exportDescription":
      "Per esportare, copia il contenuto del campo sottostante. Per importare su un altro PC, incolla il contenuto copiato in questo campo e fai clic su 'Importa elenco'.",
    "settings.stops.button.import": "Importa elenco",

    "settings.close": "Chiudi",

    "favorites.dropdownPlaceholder": "Scegli una fermata preferita o inserisci un nuovo luogo",
  },

  "rm-CH": {
    // App / UI (rumantsch grischun, approssimativ)
    "app.title": "Urarei dal traffic public svizzer",
    "app.subtitle": "Urarei per ils viadis da ir e turnar en connex cun quest termin.",
    "app.settingsAria": "Avrir las parameters",

    "sideload.title": "Complement anc betg chargià",
    "sideload.text":
      "Per plaschair chargia il complement en Outlook per mussar la retschertga d’urarei.",
    "sideload.link": "Ulteriuras infurmaziuns",

    "appointment.title": "Termin actual",
    "appointment.refreshButton": "Actualisar infurmaziuns dal termin",

    "meetingLocation.title": "Sosta datiers dal lieu dal termin",
    "meetingLocation.stationLabel": "Sosta tar il lieu dal termin:",
    "meetingLocation.stationPlaceholder": "p.ex. Köniz, Lerbermatt",
    "meetingLocation.walkLabel": "Temp da ir a pè (min):",

    "inbound.title": "Viatga d’irar (al termin)",
    "inbound.fromLabel": "Irar da:",
    "inbound.fromPlaceholder": "p.ex. Neuenegg",
    "inbound.walkLabel": "Temp da ir a pè (min):",
    "inbound.searchButton": "Tschertgar colliaziuns",
    "inbound.tableCaption": "Colliaziuns d’irar al termin",
    "inbound.empty": "Anc naginas colliaziuns chargiadas. Per plaschair tschertga l’emprim.",
    "inbound.insertButton": "Inserir viatga d’irar en il chalender",

    "outbound.title": "Viatga da turnar (dal termin)",
    "outbound.toLabel": "Turnar a:",
    "outbound.toPlaceholder": "p.ex. Neuenegg",
    "outbound.walkLabel": "Temp da ir a pè (min):",
    "outbound.searchButton": "Tschertgar colliaziuns",
    "outbound.tableCaption": "Colliaziuns da turnar dal termin",
    "outbound.empty": "Anc naginas colliaziuns chargiadas. Per plaschair tschertga l’emprim.",
    "outbound.insertButton": "Inserir viatga da turnar en il chalender",

    "connections.departure": "Partenza",
    "connections.arrival": "Arriv",
    "connections.duration": "Durada",
    "connections.route": "Ruta",

    // Item-info labels
    "item.subjectLabel": "Object",
    "item.locationLabel": "Lieu",
    "item.startLabel": "Cumenzament",
    "item.endLabel": "Fin",

    // Status / messaigs d’errur
    "status.uiIncomplete": "La vista d’urarei n’è anc betg cumplettamain inicialisada.",
    "status.missingFields.inbound":
      "Per plaschair inditga tant il lieu da partenza sco la sosta dal termin per la viatga d’irar.",
    "status.missingFields.outbound":
      "Per plaschair inditga tant la sosta dal termin sco il lieu da destinaziun per la viatga da turnar.",
    "status.noItem": "Las infurmaziuns dal termin n’han betg pudì vegnir legidas d’Outlook.",
    "status.searchingInbound": "Tschertgar colliaziuns al termin…",
    "status.searchingOutbound": "Tschertgar colliaziuns dal termin…",
    "status.searchError": "La retschertga d’urarei è dada fallida.",
    "status.noConnectionsYet": "Per plaschair tschertga l’emprim colliaziuns.",
    "status.selectConnection": "Per plaschair tschern ina colliaziun.",
    "status.invalidConnection": "Questa colliaziun n’è betg valida.",
    "status.invalidTimes": "Questa colliaziun na cuntegna betg uras da partenza/arriv validas.",
    "status.noMailbox": "Nagins contexts da posta electronica disponibels.",
    "status.noDisplayNewAppointmentApi":
      "Quest client Outlook na po betg avrir ina nova fanestra da termin ord quest context. Per plaschair dovra il nov Outlook u creescha il termin manualmain.",
    "status.displayAppointmentFailed": "Avrir la fanestra dal termin è reussì betg.",
    "status.favoritesImported": "Staziuns preferidas importadas cun success.",

    // Messaigs d’errur
    "error.copyDetails": "Copiar detagls",
    "error.dismiss": "Serrar",
    "error.unexpected": "In errur imprevischà è succedì durant l’inicialisaziun dal complement.",
    "error.unhandledRejection": "In refus da promessa betg tractà è succedì.",

    // Chalender
    "calendar.transferPrefix": "Transfer",
    "calendar.location.publicTransport": "Traffic public",

    "settings.title": "Configuraziuns",
    "settings.tab.stops": "Staziuns preferidas",
    "settings.description": "Personalisa tias preferenzas dal complement.",

    "settings.language.title": "Linguatg",
    "settings.language.description": "Tscherna il linguatg da visualisaziun dal complement.",
    "settings.language.label": "Linguatg da visualisaziun:",
    "settings.language.auto": "Automatic (dad Outlook)",

    "settings.stops.title": "Staziuns preferidas",
    "settings.stops.description":
      "Definischa qua las staziuns ed ils temps da ir a pe che ti utiliseschas savens. Quellas vegnan proponidas sco preselecziun en ils champs da staziun.",
    "settings.stops.column.stop": "Staziun / lieu",
    "settings.stops.column.walkMinutes": "Temp a pe (min)",
    "settings.stops.emptyHint":
      "Agiunta tias staziuns las pli frequentadas cun lur temp da viandar en minutas.",

    "settings.stops.button.moveUp": "Spustar ensi",
    "settings.stops.button.moveDown": "Spustar engiu",
    "settings.stops.button.sortAZ": "Zavrar A–Z",
    "settings.stops.button.delete": "Stizzar la lingia tschernida",
    "settings.stops.button.addRow": "Nova lingia",

    "settings.stops.exportTitle": "Export / import",
    "settings.stops.exportDescription":
      "Per exportar, copiescha il cuntegn dal champ suandant. Per importar sin in auter computer, encollescha il cuntegn copià en quest champ e clicca sin 'Importar glista'.",
    "settings.stops.button.import": "Importar glista",

    "settings.close": "Serrar",

    "favorites.dropdownPlaceholder": "Tscherner ina staziun preferida u scriver in nov lieu",
  },
};
