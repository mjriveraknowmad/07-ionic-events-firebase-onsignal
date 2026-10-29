import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { collection, doc, DocumentData, getDocs, getFirestore, orderBy, query, QueryConstraint, QueryDocumentSnapshot, QuerySnapshot, setDoc, where } from '@angular/fire/firestore';
import moment from 'moment';
import { EventApp } from '../models/event.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class Events {
  private fbApp = inject(FirebaseApp);
  private auth = inject(AuthService);
  public isAuthenticated = this.auth.isAuthenticated.asReadonly();
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

  getFutureEvents(type?: string){

    // Constraints de nuestro consulta
    const queryConstraints: QueryConstraint[] = [
      orderBy('start'),
      where('start', '>=', moment().format('YYYY-MM-DDTHH:mm'))
    ]

    // Si existe el tipo a filtrar, lo añadimos a los constraints
    if(type){
      queryConstraints.push(
        where('type', '==', type)
      )
    }

    // Generamos la query
    const queryDB = query(
      collection(this.database, this.COLLECTION_EVENTS),
      ...queryConstraints
    )

    // Obtenemos los eventos
    return getDocs(queryDB).then(
      (querySnapshot: QuerySnapshot<DocumentData, DocumentData> ) => {
        const events: EventApp[] = [];
        // Recorremos los resultados
        querySnapshot.forEach( (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
          const data = doc.data() as EventApp;
          events.push(data);
        })

        return events;
    })


  }
}
