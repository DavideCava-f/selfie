function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
  

export async function useWordGenerator() {
    let word = "";
    await fetch(`https://random-word-api.herokuapp.com/word?lang=it&length=${getRandomInt(2, 7)}`)
        .then(response => response.json())
        .then(json => word = json[0]);
    return word;
}