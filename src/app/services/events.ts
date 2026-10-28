import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { collection, doc, getFirestore, setDoc } from '@angular/fire/firestore';
import { EventApp } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class Events {
  private fbApp = inject(FirebaseApp);
  private database =  getFirestore(this.fbApp);
  private readonly COLLECTION_EVENTS = 'events'; // Nombre de la colección en Firestore donde se almacenan los eventos (denominan path)

  async createEvent(evento: EventApp) {
    // Creamos una referencia a la colección de eventos en Firestore
    const eventsCollection = collection(this.database, this.COLLECTION_EVENTS);
    // Creamos una referencia a un nuevo documento en la colección de eventos, que será donde guardaremos los datos del evento
    const newEventRef = doc(eventsCollection);
    // Asignamos el ID generado al evento
    evento.id = newEventRef.id;
    await setDoc(newEventRef, evento);
  }
}
