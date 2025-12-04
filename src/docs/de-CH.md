# Fahrplanabfrage für Outlook – Benutzerhandbuch

**Swiss Public Transport Timetable for Outlook**

---

## Überblick

Dieses Add-in ermöglicht es Ihnen, Verbindungen des öffentlichen Verkehrs in der Schweiz direkt in Outlook zu suchen und in Ihren Kalender einzutragen. Mit wenigen Klicks finden Sie die beste Verbindung vom Ausgangspunkt zum Termin – und umgekehrt.

**Funktionen:**
- 🔍 Echtzeit-Verbindungssuche für Schweizer ÖV (über search.ch)
- 📅 Automatische Übernahme in den Outlook-Kalender
- ⭐ Favoriten-Verwaltung für häufig genutzte Haltestellen
- 🌍 5 Sprachen: Deutsch, Französisch, Italienisch, Rätoromanisch, Englisch
- 📱 Funktioniert in Outlook für Windows, Mac und im Web

---

## Installation

### Schritt 1: Manifest-Datei herunterladen

Das Add-in wird über eine Manifest-Datei installiert. Laden Sie die Datei wie folgt herunter:

1. Öffnen Sie diese URL in Ihrem Browser: **https://timetable.mbeer.ch/v2/manifest.xml**
2. Klicken Sie mit der rechten Maustaste auf die XML-Seite
3. Wählen Sie **Speichern unter** (oder **Save as** in Englisch)
4. Speichern Sie die Datei als `manifest.xml` auf Ihrem Computer (z.B. im Downloads-Ordner)

![Manifest-Datei herunterladen mit "Speichern unter"][step-1-de]

*Hinweis: Die Manifest-Datei ist eine XML-Datei, die Outlook mitteilt, wo es die Add-in-Komponenten findet.*

---

### Schritt 2: Installation durchführen

Öffnen Sie https://aka.ms/olksideload und folgen Sie diesem Pfad:

1. Klicken Sie auf **Meine Add-ins**
2. Wählen Sie **Benutzerdefinierte Add-Ins**
3. Klicken Sie auf **Benutzerdefiniertes Add-In hinzufügen**
4. Wählen Sie **Aus Datei hinzufügen**
5. Wählen Sie die zuvor heruntergeladene `manifest.xml`-Datei aus
6. Bestätigen Sie die Installation

![Add-in Installation – Datei hinzufügen][step-2-de]

Nach erfolgreicher Installation sollte das Add-in in Outlook verfügbar sein, wenn Sie einen Kalendereintrag öffnen.

---

## Verwendung

### Schritt 1: Termin öffnen

Öffnen Sie einen Kalender-Termin in Outlook (existierend oder neu erstellt). Das Add-in-Fenster wird in der Seitenleiste angezeigt und zeigt automatisch:
- Termin-Titel
- Ort
- Anfang- und Endzeit

---

### Schritt 2: Verbindungen suchen

Im Fenster finden Sie zwei Abschnitte: **Hinfahrt** und **Rückfahrt**.

#### Hinfahrt (zum Termin)
Geben Sie ein:
- **Von** (Ausgangsort): Ihre aktuelle Adresse oder Haltestelle
- **Geh-Zeit** (Minuten): Wie lange Sie zu Fuss zur Haltestelle benötigen
- Wählen Sie optional einen Favoriten aus der Dropdown-Liste

Klicken Sie auf **Suchen** – das System findet Verbindungen, die vor dem Termin ankommen (mit Puffer für die Geh-Zeit).

#### Rückfahrt (vom Termin)
Ähnlich wie die Hinfahrt: Geben Sie ein, wohin Sie zurück möchten und wie lange Sie zu Fuss brauchen.

<img src="/assets/screenshots/step-4.png" alt="Suchschnittstelle" width="30%">

---

### Schritt 3: Verbindung auswählen

Die Suchergebnisse werden in einer Tabelle angezeigt:
- **Uhrzeit**: Abfahrt und Ankunft
- **Dauer**: Wie lange die Fahrt dauert
- **Route**: Emoji-Kette der Verkehrsmittel (🚆 Bahn, 🚍 Bus, 🚊 Tram, etc.)

Klicken Sie auf eine Verbindung, um sie auszuwählen (die Zeile wird hervorgehoben).

<img src="/assets/screenshots/step-5.png" alt="Verbindungsauswahl" width="30%">

---

### Schritt 4: In Kalender übernehmen

Nachdem Sie eine Verbindung ausgewählt haben, klicken Sie auf **Termin erstellen**.

Das Add-in erstellt automatisch einen Kalender-Termin mit:
- **Titel**: "Transfer [Von] – [Nach]"
- **Ort**: Emoji-Kette der Route (z.B. "🚶‍➡️15' · 🚆S2 · 🚍130")
- **Startzeit**: Abfahrtszeit (minus Geh-Zeit)
- **Endzeit**: Ankunftszeit (plus Geh-Zeit)
- **Beschreibung**: Detaillierte Routeninformation mit allen Haltestellen

Der Termin wird im Outlook-Kalender eingetragen.

![Termin erstellen][step-6]

---

## Einstellungen

### Favoriten-Haltestellen

Häufig genutzte Haltestellen können Sie als Favoriten speichern, um sie schneller auszuwählen.

1. Klicken Sie im Add-in-Fenster auf **Einstellungen**
2. Unter **Favoriten** können Sie:
   - Neue Haltestelle hinzufügen: Name eingeben + Geh-Zeit in Minuten
   - Favoriten bearbeiten oder löschen
   - Reihenfolge ändern (Nach oben/unten verschieben)

Die Favoriten werden lokal in Ihrem Browser gespeichert.

### Sprache ändern

Das Add-in erkennt automatisch die Sprache Ihres Outlook und wechselt entsprechend:
- 🇩🇪 Deutsch (Schweiz, Deutschland)
- 🇫🇷 Französisch (Schweiz, Frankreich)
- 🇮🇹 Italienisch (Schweiz, Italien)
- 🇷🇴 Rätoromanisch (Schweiz)
- 🇬🇧 Englisch

Um die Sprache manuell zu ändern:
1. Klicken Sie auf **Einstellungen**
2. Unter **Sprache** wählen Sie Ihre bevorzugte Sprache aus
3. Das Add-in wird sofort neu geladen

<img src="/assets/screenshots/step-7.png" alt="Sprach-Einstellung und Favoriten-Verwaltung" width="30%">

---

## Fehlerbehebung

### Das Add-in wird nicht angezeigt

**Mögliche Ursachen:**
- Die Installation ist unvollständig. Versuchen Sie, das Add-in neu zu installieren.
- Sie haben einen Termin geöffnet? Das Add-in wird nur bei geöffnetem Kalender-Termin angezeigt.
- Browser-Cache: Leeren Sie den Cache und laden Sie Outlook neu.

### Die Suche liefert keine Ergebnisse

**Mögliche Lösungen:**
- Überprüfen Sie die Schreibweise von Haltestellen (z.B. "Zürich HB" statt "Zurich Hauptbahnhof")
- Die eingegebene Zeit liegt möglicherweise ausserhalb der Betriebszeiten des ÖV
- Versuchen Sie, eine bekannte Haltestelle einzugeben (z.B. "Bern")

### Der Termin wird nicht erstellt

**Überprüfen Sie:**
- Sie haben eine Verbindung ausgewählt (Zeile ist hervorgehoben)
- Ihr Outlook hat Schreibzugriff auf den Kalender
- Versuchen Sie erneut, oder starten Sie Outlook neu

### Add-in lädt langsam

- Das Add-in benötigt eine aktive Internetverbindung (für search.ch-API)
- Überprüfen Sie Ihre Netzwerkverbindung

---

## Häufig gestellte Fragen

**F: Werden meine Daten gespeichert?**  
A: Nein. Das Add-in speichert nur lokal in Ihrem Browser:
- Ihre Favoriten-Haltestellen
- Ihre Sprach-Einstellung

Alle Suchen gehen an die öffentliche API von search.ch. Michael Beer (Entwickler) sieht Ihre Suchanfragen nicht.

**F: Funktioniert das Add-in im Outlook auf meinem Handy?**  
A: Begrenzt. Outlook für iOS/Android unterstützt derzeit nicht alle Office.js-Funktionen. Desktop-Versionen (Windows, Mac) und Outlook im Web funktionieren vollständig.

**F: Kann ich das Add-in offline nutzen?**  
A: Nein, da Verbindungsdaten von search.ch abgerufen werden. Sie benötigen eine Internetverbindung.

**F: Welche Länder werden unterstützt?**  
A: Aktuell nur die Schweiz (über search.ch). Andere Länder können später hinzugefügt werden.

---

## Kontakt & Support

**Probleme oder Vorschläge?**

Öffnen Sie ein Issue auf GitHub:  
https://github.com/mbeer/OutlookSwissPT-OfficeJS/issues

---

## Lizenz

Dieses Add-in ist unter der MIT-Lizenz veröffentlicht.

- **Quellencode**: https://github.com/mbeer/OutlookSwissPT-OfficeJS
- **Zeitplan-API**: search.ch (öffentliche API, keine Authentifizierung erforderlich)
- **Icons**: Lucide (ISC-Lizenz)

---

**Entwickler**: Michael Beer  
**Version**: 2.0.0  
**Letztes Update**: Dezember 2025

---

## Screenshot-Referenzen

[step-1-de]: /assets/screenshots/step-1-de.png "Manifest herunterladen"
[step-2-de]: /assets/screenshots/step-2-de.png "Outlook Desktop – Add-in Installation"
[step-3-de]: /assets/screenshots/step-3-de.png "Outlook Web – Add-in Installation"
