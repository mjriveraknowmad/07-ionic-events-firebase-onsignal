import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Device, DeviceInfo } from '@capacitor/device';
import {
  IonButton,
  IonContent,
  IonItem,
  IonText,
  LoadingController
} from '@ionic/angular/standalone';
import { FormEventComponent } from 'src/app/components/form-event/form-event.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { EventApp } from 'src/app/models/event.model';
import { NotificationApp } from 'src/app/models/Notification.model';
import { Notifications } from 'src/app/notifications';
import { Events } from 'src/app/services/events';
import { Toast } from 'src/app/services/toast';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.page.html',
  styleUrls: ['./update-event.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    FormEventComponent,
    IonText,
    IonItem,
    IonButton,
    RouterLink
  ]
})
export class UpdateEventPage {

  private eventsService = inject(Events);
  private loadingCtrl = inject(LoadingController);
  private notificationsService = inject(Notifications);
  private toast = inject(Toast);
  private router = inject(Router);
  // id del evento
  @Input() id!: string;

  public event: EventApp | null = null;
  public load: boolean = false;

  async ionViewWillEnter(){
    // Mostramos un loading
    const loading = await this.loadingCtrl.create({
      message: 'Cargando eventos...',
    });

    loading.present();

    // Obtenemos un evento
    this.eventsService.getEvent(this.id).then( (event: EventApp) => {
      this.event = event;
    }).finally( () => {
      loading.dismiss(); // Eliminamos el loading
      this.load = true;
    })

  }

  updateEvent(event: EventApp){
    // Actualizamos un evento
    this.eventsService.updateEvent(event).then( async () => {
      this.toast.showToast('Se ha actualizado el evento');
      // Obtenemos la informacion del dispositivo
      const device: DeviceInfo = await Device.getInfo();

      // si estamos en android y existe la notificacion
      if(device.platform == 'android' && event.notificationId){

        // primero cancelamos la notificacion, porque en realidad no se puede actualizar, lo que se hace es crear una nueva con la informacion actualizada
        this.notificationsService.cancelNotification(event.notificationId);

        // Creamos la notificacion
        const notification: NotificationApp = {
          title: event.title,
          body: event.description,
          date: event.start,
          url: event.url
        }

        // Enviamos otra notificacion
        this.notificationsService.sendNotification(notification).then( (notificationResponse: any) => {
          event.notificationId = notificationResponse.id;
          this.eventsService.updateEvent(event);
        });

      }
      this.router.navigateByUrl('/events')
    }).catch(err => {
      console.error(err);
      this.toast.showToast('Se ha producido un error al actualizar el evento');
    })

  }

}
