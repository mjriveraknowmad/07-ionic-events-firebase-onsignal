import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventApp } from 'src/app/models/event.model';
import moment from 'moment';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonDatetime
} from '@ionic/angular/standalone';

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
    IonDatetime  // más info: https://ionicframework.com/docs/api/datetime-button
  ]
})
export class FormEventComponent  implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);

  @Input() event?: EventApp;

  public formEvents: FormGroup = new FormGroup({});
  public minDate: string = moment().format('YYYY-MM-DDTHH:mm')

  constructor() { }

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
      description: [this.event.description, Validators.required]
    })

  }

  submit(){

  }

}
