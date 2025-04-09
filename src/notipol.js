import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";


async function notipol() {
  let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}`);
  response = await response.json();

  // Assumiamo di avere l'array delle notifiche da mostrare in response
  console.log("ricevo notifica!");

  toast("Hello! Wow so easy!", {
    "theme": "auto",
    "type": "default",
    "position": "top-left",
    "transition": "slide",
    "dangerouslyHTMLString": true
  });
}

export { notipol };
