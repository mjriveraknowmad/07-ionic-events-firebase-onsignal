import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventApp } from 'src/app/models/event.model';
import moment from 'moment';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonDatetime
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink

  ]
})
export class FormEventComponent  implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);

  @Input() event?: EventApp;
  @Output() submitForm = new EventEmitter<EventApp>();

  public formEvents: FormGroup = new FormGroup({});
  public minDate: string = moment().format('YYYY-MM-DDTHH:mm')

  constructor() {
    addIcons({
      chevronBackOutline
    })
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){

    if(!this.event){
      this.event = {
        title: '',
        description: '',
        start: moment().add(1, 'd').startOf('day').format('YYYY-MM-DDTHH:mm'),
        type: 'blog',
        url: ''
      }
    }

    this.formEvents = this.formBuilder.group({
      id: [this.event.id],
      title: [this.event.title, Validators.required],
      start: [this.event.start ?? moment().format('YYYY-MM-DDTHH:mm'), Validators.required],
      type: [this.event.type ?? 'blog', Validators.required],
      url: [this.event.url, [
        Validators.required,
        Validators.pattern('^(https?:\\/\\/)?([a-zA-Z0-9.-]+)(\\/[^\\s?#]*)?(\\?[^\\s#]*)?$')
      ]],
      description: [this.event.description, Validators.required],
      notificationId: [this.event.notificationId]
    })

  }

  submit(){

    const event: EventApp = this.formEvents.value;

    // En caso de que la url no incluya http:// o https://
    // Se lo incluimos nosotros
    if( !(event.url.startsWith('http://') || event.url.startsWith('https://')) ){
      event.url = `http://${event.url}`;
    }
    console.log(event);
    this.submitForm.emit(event);
  }

}
