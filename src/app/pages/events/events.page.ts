import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonItem, IonRow, IonText, LoadingController, IonChip, IonLabel, IonIcon, IonRefresher, IonRefresherContent, RefresherEventDetail, IonFooter, IonToolbar, IonFab, IonFabButton, ActionSheetController } from '@ionic/angular/standalone';
import { IonRefresherCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { desktopOutline, caretForwardCircleOutline, videocamOutline, ticketOutline, add, earthOutline, pencilOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { EventApp } from 'src/app/models/event.model';
import { Events } from 'src/app/services/events';
import { Browser } from '@capacitor/browser';
import { Alert } from 'src/app/services/alert';
import { Toast } from 'src/app/services/toast';
import { Notifications } from 'src/app/notifications';


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
  private alert = inject(Alert);
  private loadingCtrl = inject(LoadingController);
  private actionSheetCtrl = inject(ActionSheetController);
  private notifications = inject(Notifications);
  private toast = inject(Toast);
  private router = inject(Router);
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
      trashOutline,
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

  async openURL(url: string) {
    if (url) {
      await Browser.open({ url });
    }
  }

  deleteEventConfirm(event: EventApp) {
    this.alert.alertConfirm(
      'Confirmación',
      '¿Estás seguro de qué quieres borrar el evento?',
      () => this.deleteEvent(event)
    )
  }

  deleteEvent(event: EventApp) {
    this.eventsSvc.deleteEvent(event.id!).then(() => {
      this.toast.showToast('Se ha eliminado el evento');
      if (event.notificationId) {
        this.notifications.cancelNotification(event.notificationId);
      }
      this.getEvents(this.typeSearch);
    }).catch(err => {
      this.toast.showToast('Se ha producido un error al eliminar el evento');
    })
  }

  async presentActionSheet(event: EventApp) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Abrir URL',
          icon: 'earth-outline',
          handler: () => {
            if (event?.url) {
              console.log('Abrir URL del evento:', event);
              this.openURL(event.url);
            }
          }
        },
        {
          text: 'Editar',
          icon: 'pencil-outline',
          handler: () => {
            this.router.navigate(['/update-event', event.id]);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          handler: () => {
            this.deleteEventConfirm(event);
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          icon: 'close-outline'
        },
      ],
    });

    await actionSheet.present();
  }

  refreshEvents(event: CustomEvent) {
    this.typeSearch = '';
    this.getEvents();
    (event.target as HTMLIonRefresherElement).complete();
  }
}
