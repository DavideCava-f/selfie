
import { NotesList } from "@/store";



export function SortByDate(v) {
  if (v == 0) {
    NotesList.value.sort((i, j) => {
      return new Date(i.creationDate).getTime() <
        new Date(j.creationDate).getTime()
        ? 1
        : -1;
    });
  } else if (v == 1) {
    NotesList.value.sort((i, j) => {
      return new Date(i.creationDate).getTime() >
        new Date(j.creationDate).getTime()
        ? 1
        : -1;
    });
  } else if (v == 2) {
    NotesList.value.sort((i, j) => {
      return new Date(i.lastUpDate).getTime() < new Date(j.lastUpDate).getTime()
        ? 1
        : -1;
    });
  } else {
    NotesList.value.sort((i, j) => {
      return new Date(i.lastUpDate).getTime() > new Date(j.lastUpDate).getTime()
        ? 1
        : -1;
    });
  }
}

export function SortByTitle(v) {
  if (v == 0) {
    NotesList.value.sort((i, j) => {
      return i.Title[0] > j.Title[0] ? 1 : -1;
    });
  } else if (v == 1) {
    NotesList.value.sort((i, j) => {
      return i.Title[0] < j.Title[0] ? 1 : -1;
    });
  }
}

export function SortByLength(v) {
  if (v == 0) {
    NotesList.value.sort((i, j) => {
      /* return (i.Text.length > j.Text.lenght) ? 1 : -1*/
      if (i.Text.length > j.Text.length) {
        return 1;
      }
      return -1;
    });
  } else if (v == 1) {
    //NotesList.value.sort((i, j) => { return (i.Text.length > j.Text.lenght) ? 1 : -1 })
    NotesList.value.sort((i, j) => {
      if (i.Text.length < j.Text.length) {
        return 1;
      }
      return -1;
    });
  }
}

export function getVisibleDate(date) {
  /* NotesList.value = NotesList.value.sort((i,j) => {
     
   } )*/

  //var no= NotesList.value[0].lastUpDate
  var str =
    new Date(date).toDateString() +
    " " +
    new Date(date).toTimeString().split(" ")[0];
  str = str.slice(0, -3);
  return str;
}