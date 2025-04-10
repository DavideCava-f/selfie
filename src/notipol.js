import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

/*function dispatchNotification(TitleEvent,TextEvent,type,untilACK,noted){

  //Utilizza il type per decidere lo stile della notifica
  //Utilizza Title e Text per sapere di cosa fare il  display della notifica
  //Utilizza untilACK per capire se tenerla aperta
   



}
*/

function EventNotification(event){

let Now = Temporal.PlainDateTime.from(store.value.simDateTime)
let untilAck = event.untilAck;
let dates = event.dates;

event.notification.advance.forEach(advance => {


  dates.forEach(date => {
    let BeginDate = Temporal.PlainDateTime.from(date.beginDate)
    const distance = BeginDate.since(Now).abs(); 
    
    if(distance.total({ unit: 'days' }) < 1 && advance.type.equals("OneDay"))    
    {

  if(!noted){
      
    //Fai il toast
    //Vedi se metti il noted a true
  }

    }else if( distance.total({ unit: 'weeks' }) < 1 && advance.type.equals("OneWeek") ){

  if(!noted){
      
    //Fai il toast
    //Vedi se metti il noted a true
  }
    }
  })
  })


}


async function notipol() {
  let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${true}&max=${store.value.advance[-1]}`);
  Events = await response.json();

  Events.forEach(el => {EventNotification(el)});
  // Assumiamo di avere l'array delle notifiche da mostrare in response
  console.log(response);

  toast("Hello! Wow so easy!", {
    "theme": "auto",
    "type": "default",
    "position": "top-left",
    "transition": "slide",
    "dangerouslyHTMLString": true
  });
}

export { notipol };
