async function progress() {
  for (let i = 1; i <= 100; i++) {
    await new Promise(function (resolve) {
      setTimeout(resolve, 50);
    });
    postMessage(i);
    console.log(i);
  }
}

progress();
