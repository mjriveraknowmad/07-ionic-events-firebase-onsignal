import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import { PushNotifications, PermissionStatus } from '@capacitor/push-notifications';
import OneSignal, { NotificationClickEvent } from 'onesignal-cordova-plugin';
import { environment } from 'src/environments/environment.prod';
import moment from 'moment-timezone';
import { Browser } from '@capacitor/browser';
import { NotificationApp } from './models/Notification.model';

@Injectable({
  providedIn: 'root'
})
export class Notifications{

  // URL de onesignal
  private readonly URL_ONESIGNAL = 'https://onesignal.com/api/v1/notifications';

  init(){

    // Comprobamos si el plugin PushNotifications esta disponible
    if(Capacitor.isPluginAvailable('PushNotifications')){

      // Pide permisos al usuario,para enviar notificaciones
      PushNotifications.requestPermissions().then( (result: PermissionStatus) => {
        if(result.receive){

          // registramos que en este dispositivo se permitió recibir las notificaciones
          PushNotifications.register().then(() => {
            // inicializamos onesignal
            OneSignal.initialize(environment.oneSignalAppId);

            // Damos permisos a onesignal
            OneSignal.Notifications.requestPermission(true);

            // Evento al hacer click en una notificacion
            OneSignal.Notifications.addEventListener('click', async (event: NotificationClickEvent) => {
              const notification = event.notification;
              const additionalData: any = notification.additionalData;
              if(additionalData['url']){
                await Browser.open({
                  url: additionalData['url']
                })
              }
            })

          })

        }
      })


    }else{
      console.log("Las notificaciones no estan habilitadas");
    }


  }

  /**
   * Envia una notificacion usando la API de onesignal
   * @param notification
   * @returns
   */
  sendNotification(notification: NotificationApp){

    // Timezone actual
    const userTimezone = moment.tz.guess();

    return CapacitorHttp.post({
      url: this.URL_ONESIGNAL,
      params: {},
      data: {
        app_id: environment.oneSignalAppId, // id de onesignal
        included_segments: ['Total Subscriptions'], // Segmentos a los que vamos a enviar (https://dashboard.onesignal.com/apps/afa94272-32c5-4b39-8fb2-935c6b0c1089/segments Audience > Segments)
        headings: { // Cabecera de la notificacion, posibilidad de hacerlo multiidioma
          en: notification.title
        },
        contents: { // Cuerpo de la notificacion, posibilidad de hacerlo multiidioma
          en: notification.body
        },
        data: { // Datos que queramos incluir
          url: notification.url
        },
        send_after: moment(notification.date).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss [GMT]Z') // Fecha de envio de las notificaciones, si es antes de ahora, lo envia directamente
      },
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${environment.oneSignalRestApiKey}`
      }
    }).then( (response: HttpResponse) => {
      return response.data; // devuelve la informacion de la notificacion
    })

  }

  /**
   * Cancelamos una notificacion
   * @param id
   * @returns
   */
  cancelNotification(id: string){

    return CapacitorHttp.delete({
      url: `${this.URL_ONESIGNAL}/${id}`,
      params: {
        app_id: environment.oneSignalAppId
      },
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${environment.oneSignalRestApiKey}`
      }
    }).then( (response: HttpResponse) => {
      return response.data; // { success: boolean }
    })

  }

}
