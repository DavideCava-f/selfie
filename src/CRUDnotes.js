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

export function CreateNote() {
  //Parsing tags
  let tagsArr = NCtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let jsonTags = "[" + jsonT.toString() + "]";

  var Title = NCtitle.value || "New Note";
  var Content = NCcontent.value || "No Content";
  console.log(Title);
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
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getNotes();
      //do something awesome that makes the world a better place
    });
}
export function DuplicateNote(id) {
  var tagsStr = "";
  var elem = NotesList.value.find((el) => el._id.toString() == id);
  NCtitle.value = elem.Title;
  NCcontent.value = elem.Text;
  var ArrTags = elem.Tags;
  ArrTags.forEach((el) => {
    tagsStr += el.name + ",";
  });
  tagsStr = tagsStr.slice(0, -1);
  NCtags.value = tagsStr;
  console.log(NCtitle.value);
  console.log(NCcontent.value);
  console.log(NCtags.value);

  CreateNote();

  NCtags.value = "";
  NCtitle.value = "";
  NCcontent.value = "";
}

export function DeleteNote(id) {
  //Use marked before writing on NotesArea(markdown)
  console.log(typeof id);
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
      console.log(response);
      return response.json();
    })
    .then(() => {
      NotesList.value = NotesList.value.filter((el) => el._id.toString() != id);
      //do something awesome that makes the world a better place
    });
}

export function getNotes() {
  //Use marked before writing on NotesArea(markdown)
  fetch(`${store.value.url}:${store.value.port}/note`, {
    credentials: "include",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      NotesList.value = data;
      console.log(NotesList.value);
      //do something awesome that makes the world a better place
    });
}


export function UpdateNote(id) {
  console.log(id);
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
  console.log(NUid.value);
  //console.log(Note2Update)
}

export function SaveAfterUpdate() {
  console.log(NUtags.value);
  let tagsArr = NUtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let UjsonTags = "[" + jsonT.toString() + "]";

  console.log(NUid.value);
  console.log(NUtitle.value);
  console.log(NUcontent.value);
  console.log(UjsonTags);

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
      tags_note: UjsonTags,
    }),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then(() => {
      //NotesList.value = NotesList.value.filter(el => el._id.toString() != id)
      getNotes();
      //do something awesome that makes the world a better place
    });
}
