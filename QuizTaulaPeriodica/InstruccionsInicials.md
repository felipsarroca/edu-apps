# **Descripció del joc: "Repte de la taula periòdica"**

## **1\. Objectiu del joc**

L’aplicació té com a finalitat ajudar l’usuari a **identificar correctament els elements químics de la taula periòdica** a partir del seu símbol. L’objectiu del jugador és **encertar 10 elements seguits** sense cap error.

## **2\. Pantalla inicial**

Quan l’usuari accedeix al joc:

1. Se li demana que introdueixi el **nom i cognom**.  
     
2. Ha de seleccionar un **nivell de dificultat** entre els cinc disponibles:  
     
   * **Molt fàcil**  
   * **Fàcil**  
   * **Normal**  
   * **Difícil**  
   * **Molt difícil**

3. Segons el nivell de dificultat triat, l’aplicació mostra destacats els elements de la taula periòdica que intervenen en aquest nivell.

## **3\. Mecànica del joc**

* A la pantalla principal apareix una **taula periòdica interactiva i responsiva**, que s’adapta tant a ordinador com a dispositius mòbils.  
* El sistema mostra, en un espai destacat, un **nom d’element químic** (per exemple: *Plata*).  
* L’usuari ha de **clicar sobre l’element correcte (Ag)** dins de la taula periòdica.  
* Cada resposta té un **temps límit** per ser contestada, que depèn del nivell escollit.

## **4\. Progrés i repte**

* L’usuari ha d’encertar **10 elements seguits**.  
* Al costat de la taula periòdica hi ha **10 caselles buides** que s’il·luminen o es marquen a mesura que l’usuari encerta.  
* Si l’usuari **s’equivoca en algun element**, el marcador torna a zero i cal començar de nou. En el següent intent els elements apareixen en un ordre atzarós diferent.  
* En cada encert, l’aplicació mostra l’avenç en el progrés de 10 encerts seguits.

## **5\. Dificultat segons el nivell**

Cada nivell determina la selecció d’elements proposats (que es va ampliant) i el temps disponible:

* **Molt fàcil**: Elements molt coneguts i bàsics (O, H, C, N, Na, Cl...).  
* **Fàcil**: Elements freqüents en química general (Fe, Cu, K, Ca, S...) de manera majoritària i els del nivell anterior de manera minoritària.  
* **Normal**: Inclou una barreja equilibrada d’elements més o menys coneguts i els dels nivells anteriors (de manera minoritària)  
* **Difícil**: Elements menys comuns o situats en zones menys intuïtives (Se, Te, Y, Nb...) i els dels nivells anteriors (de manera minoritària)  
* **Molt difícil**: Elements poc habituals, com lantànids, actínids o sintètics (Es, No, Lr...) a més dels dels nivells anteriors (amb menor freqüència)

El **temps de resposta** també disminueix progressivament a mesura que la dificultat augmenta.

## **6\. Finalització del joc**

* Quan l’usuari aconsegueix encertar **10 elements seguits**, apareix un missatge de **felicitació final**.  
* A continuació, hi ha un botó que diu **“Enviar resultats”**.

## **7\. Enviament de resultats**

* En clicar el botó, les dades següents es registren automàticament en una **graella de Google Drive (Google Sheets)**:  
    
  * Nom i cognom del jugador  
  * Nivell de dificultat seleccionat  
  * Confirmació que ha assolit 10 encerts seguits

Això permet al creador del joc recopilar i analitzar les dades dels participants.

## **8\. Característiques estètiques**

* **L’aplicació ha de ser molt colorida, visual i atractiva.**  
* **Interactivitat intuïtiva**: l’usuari selecciona directament l’element a la taula.  
* **El funcionament ha de ser clar i intuitiu.**

## **8\. Característiques tècniques**

* **Taula periòdica responsiva** per adaptar-se a mòbil i ordinador.  
* **Interactivitat intuïtiva**: l’usuari selecciona directament l’element a la taula.  
* **Feedback visual i textual** immediat després de cada resposta.  
* **Gamificació** amb el sistema de 10 caselles d’encerts seguits.  
* **Enviament automàtic de dades** a Google Sheets per fer-ne el seguiment.

