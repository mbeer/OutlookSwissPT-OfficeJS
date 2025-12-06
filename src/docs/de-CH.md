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

![Manifest-Datei herunterladen mit «Speichern unter»][step-1-de]

*Hinweis: Die Manifest-Datei ist eine XML-Datei, die Outlook mitteilt, wo es die Add-in-Komponenten findet.*

---

### Schritt 2: Installation durchführen

Öffnen Sie https://aka.ms/olksideload und folgen Sie diesem Pfad:

1. Klicken Sie auf **Meine Add-ins**
2. Scrollen Sie zu **Benutzerdefinierte Add-Ins**
3. Klicken Sie auf **Benutzerdefiniertes Add-In hinzufügen**
4. Wählen Sie **Aus Datei hinzufügen…**
5. Wählen Sie die zuvor heruntergeladene `manifest.xml`-Datei aus
6. Bestätigen Sie die Installation

![Add-in Installation – Datei hinzufügen][step-2-de]

Nach erfolgreicher Installation sollte das Add-in in Outlook verfügbar sein, wenn Sie einen Kalendereintrag öffnen.

---

## Verwendung

### Schritt 1: Termin öffnen

Öffnen Sie einen Kalender-Termin in Outlook (existierend oder neu erstellt). 

**Wichtig:** Speichern Sie neue Termine zuerst (Strg+S oder klicken Sie auf «Speichern»). Der Termin darf *nicht* im Bearbeiten-Modus geöffnet sein , damit das Add-in korrekt funktioniert.

Klicken Sie in der Outlook-Menüleiste auf die Schaltfläche **Fahrplanabfrage** – das Add-in-Fenster wird daraufhin in der Seitenleiste geöffnet.

<img src="/assets/screenshots/step-4.png" alt="Terminfenster mit Fahrplanabfrage-Button in der Ribbon-Leiste" width="100%">

---

### Schritt 2: Verbindungen suchen

Im Fenster finden Sie zwei Abschnitte: **Hinfahrt** und **Rückfahrt**.

#### Hinfahrt (zum Termin)
Geben Sie ein:
- **Haltestelle beim Terminort** (Zielort): Die ÖV-Haltestelle, über welche Sie den Terminort erreichen wollen. Alternativ kann auch die Adresse des Terminorts angegeben werden.
- **Hinreise von** (Ausgangsort): Die ÖV-Haltestelle oder Adresse, von der aus sie die Hinreise zum Termin starten wollen.
- **Gehzeit (min)**: Wie lange Sie am Terminort bzw. am Ausgangsort für den Weg zur Haltestelle benötigen.
- Wählen Sie optional einen Favoriten aus der Dropdown-Liste

Klicken Sie auf **Suchen** – das System findet Verbindungen, die vor dem Termin ankommen (mit Puffer für die Gehzeit).

#### Rückfahrt (vom Termin)
Ähnlich wie die Hinfahrt: Geben Sie ein, wohin Sie zurückreisen möchten und wie lange Sie für den Weg zur Haltestelle brauchen.

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

Nachdem Sie eine Verbindung ausgewählt haben, klicken Sie auf **Hinreise in Kalender eintragen** (für die Hinfahrt) oder **Rückreise in Kalender eintragen** (für die Rückfahrt).

Das Add-in erstellt automatisch einen Kalender-Termin mit:
- **Titel**: «Transfer [Von] – [Nach]»
- **Ort**: Emoji-Kette der Route (z.B. «🚶‍➡️15′ 🚆S2 🚍130»)
- **Startzeit**: Abfahrtszeit (minus Gehzeit)
- **Endzeit**: Ankunftszeit (plus Gehzeit)
- **Beschreibung**: Detaillierte Routeninformation mit allen Haltestellen

Es wird ein Fenster zur Erstellung eines neuen Termins eröffnet, welches mit diesen Informationen vorbefüllt ist. Diesen neuen Termin können Sie dann mit **Speichern** in ihren Kalender eintragen. 

<img src="/assets/screenshots/step-6.png" alt="Termin in Kalender eintragen" width="60%">

⚠️ **Hinweis**: Das automatische Öffnen des Terminfensters funktioniert nur, wenn sich der Bezugstermin im **Lesemodus** befindet (siehe Abschnitt «Einschränkungen beim Eintragen in den Kalender» unten). Falls Sie sich im Bearbeitungsmodus befinden, speichern Sie den Termin zuerst und öffnen Sie ihn erneut aus dem Kalender. Alternativ können Sie die Verbindungsinformationen manuell in einen neuen Termin kopieren.

---

### Fahrplanabfrage-Button an die Kalender-Symbolleiste anheften

Im neuen Outlook im Web und im neuen Outlook für Windows kann der Add-in-Button zunächst nur im Menü **Weitere Apps (…)** im Kalenderformular statt direkt in der Symbolleiste angezeigt werden.

Sie können den Button an die Kalender-Symbolleiste anheften, um ihn immer sichtbar zu machen:

1. Öffnen Sie einen beliebigen Kalender-Termin.
2. Klicken Sie auf das **Einstellungen**-Zahnrad in der oberen rechten Ecke.
3. Gehen Sie zu **Kalender → Aktionen anpassen**.
4. Im Abschnitt **Kalenderoberfläche** (Symbolleiste) aktivieren Sie das Kontrollkästchen für das Add-in (z.B. «Fahrplanabfrage»).
5. Speichern Sie Ihre Änderungen und laden Sie Outlook ggf. neu.

Der Add-in-Button wird nun direkt in der Kalender-Symbolleiste angezeigt, solange ausreichend Platz vorhanden ist. Falls das Outlook-Fenster sehr schmal ist, kann Outlook den Button automatisch wieder in das Menü **Weitere Apps (…)** verschieben.

---

## Einstellungen

### Favoriten-Haltestellen

Häufig genutzte Haltestellen können Sie als Favoriten speichern, um sie schneller auszuwählen.

1. Klicken Sie im Add-in-Fenster auf **Einstellungen** (Zahnrad-Symbol oben rechts)
2. Unter **Standardhaltestellen** können Sie:
   - Neue Haltestelle hinzufügen: Name eingeben + Geh-Zeit in Minuten
   - Favoriten bearbeiten oder löschen
   - Reihenfolge ändern (Nach oben/unten verschieben)

Die Favoriten werden lokal in Ihrem Browser gespeichert.

### Sprache ändern

Das Add-in erkennt automatisch die Sprache Ihres Outlook und wechselt entsprechend:
- 🇩🇪 Deutsch (Schweiz, Deutschland)
- 🇫🇷 Französisch (Schweiz, Frankreich)
- 🇮🇹 Italienisch (Schweiz, Italien)
- 🇨🇭 Rätoromanisch (Schweiz)
- 🇬🇧 Englisch

Um die Sprache manuell zu ändern:
1. Klicken Sie auf **Einstellungen**
2. Unter **Sprache** wählen Sie Ihre bevorzugte Sprache aus
3. Das Add-in wird sofort neu geladen

<img src="/assets/screenshots/step-7.png" alt="Sprach-Einstellung und Favoriten-Verwaltung" width="30%">

---

## Einschränkungen beim Eintragen in den Kalender

### Unterstützte Outlook-Varianten

Das Eintragen von Fahrten direkt in den Kalender funktioniert auf folgenden Plattformen:
- ✅ **Outlook für Windows (Desktop)** – vollständig unterstützt
- ✅ **Outlook im Web (Outlook.com, Office 365)** – vollständig unterstützt
- ✅ **Neuer Outlook** (Preview) – vollständig unterstützt
- ❌ **Outlook für macOS** – derzeit nicht unterstützt
- ❌ **Outlook für iOS/Android (Mobilgeräte)** – nicht unterstützt

### Lesemodus vs. Bearbeitungsmodus

Das Add-in kann Fahrten nur in den Kalender eintragen, wenn der Termin sich im **Lesemodus** befindet. Das ist der Fall, wenn der Termin bereits gespeichert wurde und Sie ihn aus Ihrem Kalender öffnen.

**Lesemodus (funktioniert):**
- Der Termin wurde bereits gespeichert
- Sie öffnen ihn aus der Kalenderansicht
- Sie sehen einen «Bearbeiten»-Button statt direkt bearbeitbarer Textfelder
- Das Add-in kann Fahrten direkt in den Kalender eintragen

**Bearbeitungsmodus (funktioniert nicht):**
- Sie erstellen einen neuen Termin
- Sie bearbeiten einen bestehenden Termin (Entwurf)
- Der Termin wurde noch nicht gespeichert
- Das Add-in kann keine Fahrten eintragen

### Wie Sie in den Lesemodus gelangen

1. **Speichern Sie den Termin**, auf den sich die Reiseplanung beziehen soll
2. **Öffnen Sie Ihren Kalender** in Outlook
3. **Klicken Sie auf den gespeicherten Termin**, um ihn zu öffnen
4. **Überprüfen Sie, dass Sie im Lesemodus sind**: Sie sollten einen «Bearbeiten»-Button sehen (kein Textfeld zum direkten Bearbeiten)
5. **Jetzt können Sie das Add-in nutzen** und Fahrten in den Kalender eintragen

---

## Fehlerbehebung

### Das Add-in wird nicht angezeigt

**Mögliche Ursachen:**
- Die Installation ist unvollständig. Versuchen Sie, das Add-in neu zu installieren.
- Sie haben einen Termin geöffnet? Das Add-in wird nur bei geöffnetem Kalender-Termin angezeigt.
- Browser-Cache: Leeren Sie den Cache und laden Sie Outlook neu.

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

- **Quellcode**: https://github.com/mbeer/OutlookSwissPT-OfficeJS
- **Zeitplan-API**: search.ch (öffentliche API, keine Authentifizierung erforderlich)
- **Icons**: Lucide (ISC-Lizenz)

---

**Entwickler**: Michael Beer  
**Version**: 2.0.1  
**Letztes Update**: Dezember 2025

---

## Screenshot-Referenzen

[step-1-de]: /assets/screenshots/step-1-de.png "Manifest herunterladen"
[step-2-de]: /assets/screenshots/step-2-de.png "Outlook Desktop – Add-in Installation"
[step-3-de]: /assets/screenshots/step-3-de.png "Outlook Web – Add-in Installation"
