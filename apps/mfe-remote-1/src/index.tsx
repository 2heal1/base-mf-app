import("./bootstrap").then(({ mount }) => {
  const localRoot = document.getElementById("root");
  if (!localRoot) {
    console.error("Unable to find root root element");
    return;
  }

  mount({
    mountPoint: localRoot,
    routingStrategy: "browser",
  });
});

export {};
