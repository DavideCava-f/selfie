import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Temporal } from "@js-temporal/polyfill";

/*function dispatchNotification(TitleEvent,TextEvent,type,untilACK,noted){

  //Utilizza il type per decidere lo stile della notifica
  //Utilizza Title e Text per sapere di cosa fare il  display della notifica
  //Utilizza untilACK per capire se tenerla aperta
   



}
*/

async function EventNotification(event){


  let Now = (Temporal.PlainDateTime.from(store.value.simDateTime));
  let untilAck = event.untilAck;
  let dates = event.dates;
  console.log("Dates: ", dates);
  /* per ragioni di test adesso cambio l'advance di ogni evento*/
  event.notification.advance.push({type: "oneDay", noted: false});
  event.notification.advance.push({type: "oneWeek", noted: false});
  console.log("Advance: ", event.notification.advance);

  event.notification.advance.forEach(advance => {
    dates.forEach(date => {
      let BeginDate = (Temporal.PlainDateTime.from((date.begin.toString()).slice(0,-1)));

      let distance = BeginDate.since(Now, {smallestUnit: "seconds", largestUnit: "months"});
      
      if(distance.total({ unit: 'days' }) < 1 && advance.type === ("oneDay"))    {
        if(!advance.noted){
          toast(event.title, {
            "theme": "auto",
            "type": "default",
            "position": "top-left",
            "transition": "slide",
            "dangerouslyHTMLString": true
          });
          //Fai il toast
          //Vedi se metti il noted a true
          
        }
      }else if( distance.total({ unit: 'days' }) < 7 && advance.type === ("oneWeek")){
        if(!advance.noted){
            
          //Fai il toast
          //Vedi se metti il noted a true
          toast(event.title, {
            "theme": "auto",
            "type": "default",
            "position": "top-left",
            "transition": "slide",
            "dangerouslyHTMLString": true
          });
        }
      }
    })
  })


}


async function notipol() {
  let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${true}&max=${store.value.advance[-1]}`);
  let Events = await response.json();
  //console.log("Events: ", Events);
  await Events.forEach(el => {EventNotification(el)});
  // Assumiamo di avere l'array delle notifiche da mostrare in response
}

export { notipol };
