# Membri del gruppo:
- davide.cavallo2@studio.unibo.it
- alessandro.roncagli3@studio.unibo.it
- nicola.travaglini3@studio.unibo.it

# Scelte implementative
## Framework
- Vuejs:
    - utilizzato in quanto risultava tra i Framework disponibili quello più facilmente utilizzabile e con funzionalità intuitive e, soprattutto, facilmente debuggabile.
    - La strttura di un file `.vue` risulta molto comoda avendo le tre parti (_script_, _template HTML_ racchiuse in un unico punto portando anche ad avere un modo veloce per passare da una parte all'altra.

## API utilizzate
- temporalAPI:
    - Utilizzata per gestire tutto quello che riguarda le date e gli orari di eventi, note, attività e pomodori
- vue toastify:
    - Utilizzata per l'implementazione delle notifiche per quanto riguarda eventi che devono avvenire o attività che risultano essere in ritardo. 

## Dettagli tecnici
- Utilizzo di store "home-made" (non Pinia) per condivisione di risorse e funzioni di aggiornamento reattivo
tra i vari componenti.

# Guida al sito
## Login/Registrazione
L'accesso al sito e' protetto da una classica schermata di Login/Registrazione semplice e autoesplicativa.

## Home
- La home è composta da tre `card` che danno un rapido accesso ad alcune delle funzionalità del sito.
    - La prima card fa visualizzare i prossimi 5 eventi più impellenti che stanno per accadere esclusi quelli di tipo _pomodoro_, inoltre cliccando un determinato evento tra quelli rappresentati si viene portati alla visualizzazione settimanale con quell'evento tra quelli presenti nel calendario.
    - La seconda card permette di visualizzare l'ultima nota che è stata modificata e cliccandoci sopra si andrà alla pagine dove vengono visualizzate tutte le note scritte finora.
    - La terza ed ultima card mostra l'ultimo pomodoro che è stato completato nella sua interezza, mostrandone il numero di cicli e da quanti minuti di studio e relax siano composti. Infine è rappresentato anche il tempo totale del pomodoro stesso. 

## Calendario
- il calendario rappresenta tutto ciò che permette di visualizzare gli eventi al di fuori della Homea.
- è composto dalla viualizzazione giornaliera, settimanale, mensile, una barra che fa vedere il giorno in cui ci si trova(nella visualizzazione giornaliera) e il mese in cui ci si trova (nelle altre due visualizzazione). Infine ci sono tre pulsanti, due permettono di intercambiare tra la visualizzazione mensile e settimanale e il terzo permette di portare il focus delle visualizzazioni ad oggi.


### Daily
- La _daily view_ e' una semplice lista verticale degli eventi del giorno, ordinati per l'ora di inizio.


### Weekly
- La _weekly view_ e' stata pensata per dare maggiore risalto agli eventi piuttosto che alla loro disposizione temporale. E' infatti noto il problema della visualizzazione degli eventi settimanali in calendari mobile-first: tante informazioni, spesso e volentieri sovrapposte, in uno spazio ristretto...
- Con il nostro approccio si mitiga il problema della sovrapposizione degli eventi: i _giorni della settimana sono disposti orizzontalmente_, per disporre gli eventi di seguito, ordinati per l'ora di inizio.
- Gli eventi che stanno accadendo in questo momento, i quali possono essere molteplici, sono indicati da un **pallino lampeggiante rosso**.
- Cliccando su un qualunque spazio vuoto della giornata si accede al modulo di creazione dell'evento _pre-compilato_ con data di inizio e di fine di quel giorno.

### Monthly
- la visualizzazione degli eventi mensile ha una grafica classica, ogni evento come nella visualizzazione settimanale è composto da un pulsante il quale colore viene generato in base al titolo dell'evento stesso, l'ordine dei giorni della settimana visualizzati in alto è dettato dal primo giorno del mese.
- quando in una singola giornata sono presenti più di due eventi (compresi quelli pomodoro) compare un tasto _other events_ il quale apre un modulo di visualizzazione di tutti quegli eventi in eccesso dal quale è possibile eseguire tutte le operazioni sugli eventi presenti anche nella visualizzazione settimanale.
- Infine cliccando su uno spazio vuoto di una giornata si accede al modulo di creazione dell'evento _pre-compilato_ con data di inizio e di fine di quel giorno. 

## Attivita'
- Possibilita di creare delle attivita visibili nelle visualizzazioni mensili, giornaliere e settimanali
   - Deadline opzionale, inseribile anche in un secondo momento dopo la modifica dell'evento
   - Suddivisione della visualizzazione in 3 aree ben visibili:
           - Da fare
           - In ritardo
           - Completate


## Note
- Abbiamo deciso di implementare le note lato client in moduli tra cui CRUDnotes p
- Abbiamo deciso di implementare le note lato client in moduli per agevolare la produttivita'e la comprensione del codice, tra cui:
           - NotesView per la visualizzazione
           - CRUDnotes per le operazioni CRUD, ogni operazione e' associata a un end-point 
           - NotesUtils per le funzioni ausiliarie
   - Scelte UX:
    - Utilizzo di off-canvas per non invadere il poco spazio della visualizzazione da telefono
    - Pulsanti per il sorting immediatamente riconoscibili e ben in vista, come il pulsante per la creazione
    - Per le note lunghe click su essa per visualizzarla completa, ottimizzazione spazi
    - Pulsanti delle operazioni sulle note con colori ben visibili ma non invadenti nell'interfaccia
    - Colore acceso per i tags per renderli visibili all'istante

## Pomodoro
- Il _modal pomodoro_, selezionabile dalla navbar, consente di far partire un pomodoro istantaneamente, o di pianificarne uno nel futuro.
- Gli _eventi pomodoro_ sono selezionabili da tutte e 3 le view del calendari (daily, weekly, monthly).
- Ogni pomodoro durante la sue esecuzione ti notificherà quando:
    - Parte
    - Inizia un determinato ciclo (relax o studio).
    - Quando finisce

## Selezione date (`OrbitalSelector`)
- Per selezionare le date abbiamo pensato a un sistema innovativo espressivo e veloce: **due gruppi di cerchi concentrici**, per la selezione
rispettivamente di mese/giorno e di ora/minuto.
- Le ore sono disposte esattamente a _orologio_, ossia con il mezzogiorno in alto.
- I minuti selezionabili sono _distanziati di 5 minuti_: dividono i 60 minuti in 12 parti, per una selezione immediata e coerente con gli orari
degli impegni reali degli utenti.

## Notifiche
- Le notifiche sono state realizzate usando un sistema di polling dove ogni 10 secondi viene interpellata una funzione che controlla se certi eventi abbiano necessità di notificarti quando stanno pr avvvenire con un anticipo di un certo periodo
- Per quanto riguarda le attività le notifiche arriveranno solo se una determinata attività è:
    - appena scaduta con bordo blu.
    - in ritardo di un giorno con bordo giallo  
    - in ritardo di una settimana con bordo rosso
    - Al momento dell'accesso manda solo la notifica del tempo piu lungo
        - Esempio:
              - Creo attivita con deadline il giorno dopo e accedo tra un mese, mi arrivera' solo la notifica di una settimana in ritardo
  - Notifiche del pomodoro gestite a parte nel suo componente
  - Ogni notifica è stata fatta utilizzando `vue3-toastify`.

## Time machine
La time machine e' selezionabile dalla navbar (ultimo bottone).
 (il quale è impostato nella creazione dell'evento). 


## Gestione Backend
- Backend nodejs nel file index.js per la connesione a mongoDB e i moduli per le varie routes di ogni sezione dell'applicazione

