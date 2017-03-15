## Installation
För att köra programmet/servern behövs Node.js (v.6.10.0 LTS+), dessutom används följande paket:
* Express (v.4.14.1)
* Jade (v.1.11.0)
* Socket.io (v.0.9.15)

Följ detta för att få allt att funka.
1. För debian installeras node såhär.
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. Ta sedan ner repot.
```
git clone https://github.com/Ironedde/D0020E-2017-UnityServer.git
```
3. Sist så skall node paketen installeras (detta görs i mappen där projektet är).
```
npm install
```

Allt ska nu vara installerat och ni ska kunna starta servern.

## Dummy Server - pserver.js
Användning: `node pserver.js <port>`

Om ingen port har angivits så kommer standardporten att vara 3077. Om flera argument ges väljs det sista som portens nummer. En webbaserad positioneringsklient kan hittas på `http://<hostname>:<port>/client`under serverns körning. Det går att hämta en lista över alla anslutna klienter och deras positioner via http på `http://<hostname>:<port>/positions`

## Dummy Client - pclient.js
Användning: `node pclient.js <hostname>`

Denna klient fungerar inte utan att minst en server är angiven. Klienten kan ansluta till flera servrar samtidigt (även samma server flera gånger). Funktionaliteten hos denna klient kan inte garanteras då den inte har uppdaterats i takt med servern. Använd webbklienten om möjligt.

## Lägga till fler funktioner i servern
Att utöka servern till att hantera mer data än bara positionen är tämligen enkelt. Node.js är en mycket modulär teknologi och att lägga till fler moduler blir trivialt. Alternativt så kan allting hållas till en fil, men detta påvekar programmets interna kvalitet.

### Exempel på implementation av ”farozoner”
Gör en ny fil/modul med farozonerna, typ `dangerzone.js`. Inkludera relevanta bibliotek och dylikt till filen och se till att det publika `module.exports` är ett NetworkDataObject (finns definierat i `network\_data\_object.js`). All implementation bör stanna i denna exempelfil, men det definierade objektet _måste_ registreras i `pserver.js` via `ndo.define(...)`. Se hur positioneringsobjektet är implementerat för detaljer.

### Förbättring av modularitet
Gör gärna så att positions.js inte bara är en stubb-fil, utan innehåller att kod för att hålla koll på positionen.

### Övriga exempel
Dessa kan finnas i projekrapporten.
