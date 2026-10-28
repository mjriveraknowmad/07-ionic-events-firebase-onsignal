import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormEventComponent } from 'src/app/components/form-event/form-event.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { EventApp } from 'src/app/models/event.model';
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

  constructor() { }

  ngOnInit() {
  }

  createEvent(evento: EventApp) {
    this.events.createEvent(evento).then(() => {
      this.toast.showToast('Evento añadido correctamente');
      this.router.navigateByUrl('events'); // Redirige a la página de eventos después de añadir el evento
    }).catch((error) => {
      this.toast.showToast('No se pudo añadir el evento');
    });
  }

}
