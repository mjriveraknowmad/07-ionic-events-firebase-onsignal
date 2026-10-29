import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonItem, IonRow, IonText, LoadingController, IonChip, IonLabel, IonIcon, IonRefresher, IonRefresherContent, RefresherEventDetail, IonFooter, IonToolbar, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { IonRefresherCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { desktopOutline, caretForwardCircleOutline, videocamOutline, ticketOutline, add, earthOutline, pencilOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { EventApp } from 'src/app/models/event.model';
import { Events } from 'src/app/services/events';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    IonContent,
    FormsModule,
    ToolbarComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonCard,
    IonCardContent,
    IonItem,
    DatePipe,
    IonChip,
    IonLabel,
    IonIcon,
    NgClass,
    IonRefresher,
    IonRefresherContent,
    IonFooter,
    IonToolbar,
    IonFab,
    IonFabButton,
    RouterLink
],
})
export class EventsPage {
  private eventsSvc = inject(Events);
  private loadingCtrl = inject(LoadingController);
  events: EventApp[] = [];
  public typeSearch: string = '';
  public isAuthenticated = this.eventsSvc.isAuthenticated;

  constructor() {
    addIcons({
      desktopOutline,
      caretForwardCircleOutline,
      videocamOutline,
      ticketOutline,
      add,
      earthOutline,
      pencilOutline,
      closeOutline,
      trashOutline
    })
  }

  ionViewWillEnter() {
    this.getEvents();
  }

  async getEvents(type?: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando eventos...',
    });
    loading.present();


    this.eventsSvc
      .getFutureEvents(type)
      .then((events: EventApp[]) => {
        this.events = events;
        console.log(this.events);
      })
      .catch((err) => {
        console.error(err);
        this.events = [];
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async filterEventsByType(type: string) {
    if (this.typeSearch == type) {
      this.typeSearch = '';
    } else {
      this.typeSearch = type;
    }
    this.getEvents(this.typeSearch);
  }

  refreshEvents(event: CustomEvent) {
    this.typeSearch = '';
    this.getEvents();
    (event.target as HTMLIonRefresherElement).complete();
  }
}
