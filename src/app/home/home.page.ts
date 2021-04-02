import { Component, OnInit } from '@angular/core';
import {LocalNotification, LocalNotificationActionPerformed, NotificationChannel, Plugins} from '@capacitor/core';
import {AlertController} from '@ionic/angular'; 


const {LocalNotifications}= Plugins;

const channel: NotificationChannel={
  id:'audio_channel',
  name:'audio_channel',
  sound: 'goes_without_saying_608.wav',
  importance:5,
  visibility: 1
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor( private alertCtrl: AlertController) {}

  async ngOnInit(){
    LocalNotifications.createChannel(channel);
    await LocalNotifications.requestPermission();
    // this.scheduleBasic();
    LocalNotifications.registerActionTypes({
      types:[
        {
          id: 'CHAT_MSG',   
          actions:[
            // {
            //   id:'view',
            //   title:'OpenChat'
            // },
            {
              id: 'remove',
              title: 'Dismiss',
              destructive: true
            },
            {         
              id: 'respond',
              title: 'Respond',
              input: true
            },
            {
              id:'fore',
              title:'foreground',
              foreground: true
            }
          ]
        }
      ]
    });

    LocalNotifications.addListener('localNotificationReceived',(notification: LocalNotification)=>{
      this.presentAlert(`Received: ${notification.id}`,`Custom Data: ${JSON.stringify(notification.extra)}`);
      console.log(notification.id);
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification:LocalNotificationActionPerformed)=>{
      this.presentAlert(`Performed: ${notification.actionId}`, `Input value:${notification.inputValue}`);
    });
  }

  async scheduleBasic(){
    await LocalNotifications.schedule({
      notifications:[
        {
          title: 'Basic Reminder',
          body: 'A pop up in instant',
          id:1,
         // sound:null,
          extra:{
            data: 'Pass data to your handler'
          },
          iconColor: '#0000ff'
        }
      ]
    });
  }

  async repeatNotification(){
    await LocalNotifications.schedule({
      notifications:[
        {
          title: 'Repeat Reminder',
          body:'Repeat Repeat Repeat',
          id: 3,
          //sound: null,
          channelId: 'audio_channel',
          schedule:{
             at: new Date(Date.now()+1000*5),
            repeats:true,
            // every:'minute'
            count: 5,
            on:{
              hour:1
            }
          }
        }
      ]
    })
  }

  async scheduleAdvanced(){
    await LocalNotifications.schedule({
      notifications:[
        {
          title: ' Reminder with Action',
          body: ' Hey I have action types',
          id: 2,
          sound:null,
          extra:{
            data: 'Pass data to handler'
          },
          iconColor:'#0000ff',
          actionTypeId:'CHAT_MSG',
          schedule:{
            //  at: new Date(Date.now()+1000*3),
            // repeats:true,
            // every:'minute',
             count:5,
            // on: {
            //   minute: 5
            // }
          }
        }
      ]
    });
  }

  async presentAlert(header, message){
    const alert= await this.alertCtrl.create({
      header,
      message,
      buttons:['OK']
    });
    alert.present();
  }

}
