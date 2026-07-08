\# Nexlogic Money - Project Rules



\## 1. Scopul proiectului



Nexlogic Money este o aplicație personală pentru gestionarea finanțelor.



Proiectul este dezvoltat în primul rând pentru uz personal și pentru învățare.



\---



\## 2. Filosofia dezvoltării



\- Construim MVP-ul mai întâi.

\- Nu adăugăm funcționalități înainte să fie necesare.

\- Preferăm soluțiile simple.

\- Refactorizăm doar când există un motiv clar.



\---



\## 3. Arhitectură



Aplicația folosește o arhitectură bazată pe features.



Prima funcționalitate este:



features/transactions



Alte module vor fi adăugate doar când vor fi necesare.



\---



\## 4. Organizarea codului



Fiecare fișier trebuie să aibă o singură responsabilitate.



Exemple:



\- data.ts → date

\- queries.ts → citire și calcule

\- actions.ts → modificarea datelor

\- components/ → interfață



\---



\## 5. Regula de dezvoltare



Lucrăm pas cu pas.



Fiecare pas trebuie să:



\- aibă un scop clar;

\- modifice cât mai puține fișiere;

\- fie verificat înainte de pasul următor.



\---



\## 6. Documentație



Orice decizie importantă se notează în documentația proiectului.



Development Log se actualizează după fiecare etapă importantă.

