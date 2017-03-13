# Dummy Server - pserver.js
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