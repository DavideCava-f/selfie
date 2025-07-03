import { ref } from "vue";
import { store } from "@/store";
import { NotesList } from "@/store";

export var NCtitle = ref("");
export var NCcontent = ref("");
export var NCtags = ref("");
//var NotesList = ref("");
export var NUtitle = ref("");
export var NUcontent = ref("");
export var NUtags = ref("");
export var NUid = ref("");
export var NCMarkDown = ref(false);
export var NUMarkDown = ref(false);

export function CreateNote() {
  //Parsing tags
  let tagsArr = NCtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let jsonTags = "[" + jsonT.toString() + "]";

  var Title = NCtitle.value || "New Note";
  var Content = NCcontent.value || "No Content";
  var creationDate = store.value.simDateTime
  fetch(`${store.value.url}:${store.value.port}/note`, {
    method: "post",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      title: Title,
      content: Content,
      tags: jsonTags,
      creationDate: creationDate,
      markdown: NCMarkDown.value
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      getNotes();
  NCtags.value = "";
  NCtitle.value = "";
  NCcontent.value = "";
  NCMarkDown.value = false;
      //do something awesome that makes the world a better place
    });
}
export function DuplicateNote(id) {
  var tagsStr = "";
  var elem = NotesList.value.find((el) => el._id.toString() == id);
  NCtitle.value =  elem.Title + " (copia) ";
  NCcontent.value = elem.Text;
  var ArrTags = elem.Tags;
  ArrTags.forEach((el) => {
    tagsStr += el.name + ",";
  });
  tagsStr = tagsStr.slice(0, -1);
  NCtags.value = tagsStr;
  NCMarkDown.value = elem.markdown 
  

  CreateNote();

}

export function DeleteNote(id) {
  //Use marked before writing on NotesArea(markdown)

  fetch(`${store.value.url}:${store.value.port}/note`, {
    method: "delete",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Note: id,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then(() => {
     // NotesList.value = NotesList.value.filter((el) => el._id.toString() != id);
      getNotes() 
     //do something awesome that makes the world a better place
    });
}

export function getNotes() {
  //Use marked before writing on NotesArea(markdown)
  fetch(`${store.value.url}:${store.value.port}/note`, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      NotesList.value = data;
      //do something awesome that makes the world a better place
    });
}


export function UpdateNote(id) {
  let tagsStr = "";
  const Note2Update = NotesList.value.find((el) => el._id.toString() === id);
  NUtitle.value = Note2Update.Title;
  NUcontent.value = Note2Update.Text;
  NUtags.value = Note2Update.Tags;
  NUtags.value.forEach((el) => {
    tagsStr += el.name + ",";
  });
  NUtags.value = tagsStr.slice(0, -1);
  NUid.value = Note2Update._id;
  NUMarkDown.value = Note2Update.markdown
}

export function SaveAfterUpdate() {
  let tagsArr = NUtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let UjsonTags = "[" + jsonT.toString() + "]";


  let lastUpdate = store.value.simDateTime
  fetch(`${store.value.url}:${store.value.port}/note`, {
    method: "put",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Note: NUid.value,
      title_note: NUtitle.value || "No Title",
      content_note: NUcontent.value || "No Content",
      lastUpdate: lastUpdate,
      tags_note: UjsonTags,
      markdown_note: NUMarkDown.value
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then(() => {
      //NotesList.value = NotesList.value.filter(el => el._id.toString() != id)
      getNotes();
  NUtags.value = "";
  NUtitle.value = "";
  NUcontent.value = "";
  NUMarkDown.value = "";
      //do something awesome that makes the world a better place
    });
}
