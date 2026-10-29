import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
      this.router.navigateByUrl('/events')
    }).catch(err => {
      console.error(err);
      this.toast.showToast('Se ha producido un error al actualizar el evento');
    })

  }

}
