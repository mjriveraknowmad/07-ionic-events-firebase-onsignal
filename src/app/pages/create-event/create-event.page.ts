import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Device, DeviceInfo } from '@capacitor/device';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormEventComponent } from 'src/app/components/form-event/form-event.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { EventApp } from 'src/app/models/event.model';
import { NotificationApp } from 'src/app/models/Notification.model';
import { Notifications } from 'src/app/notifications';
import { Events } from 'src/app/services/events';
import { Toast } from 'src/app/services/toast';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ToolbarComponent,
    FormEventComponent,
  ],
})
export class CreateEventPage implements OnInit {

  private events = inject(Events);
  private toast = inject(Toast);
  private router = inject(Router);
  private notifications = inject(Notifications);

  constructor() { }

  ngOnInit() {
  }

createEvent(event: EventApp){
    console.log(event);
    this.events.createEvent(event).then( async () => {
      this.toast.showToast('Se ha creado el evento')

      // Obtenemos la informacion del dispositivo
      const device: DeviceInfo = await Device.getInfo();

      // Si estamos en android, mandamos una notificacion
      if(device.platform == 'android'){

        // Creamos una notificacion
        const notification: NotificationApp = {
          title: event.title,
          body: event.description,
          date: event.start,
          url: event.url
        }

        // Envio una notificacion
        this.notifications.sendNotification(notification).then( (notificationResponse: any) => {
          event.notificationId = notificationResponse.id;
          this.events.updateEvent(event);
        });

      }

      this.router.navigateByUrl('events');
    }).catch(err => {
      console.error(err);
      this.toast.showToast('Se ha producido un error al crear el evento')
    })
  }

}
