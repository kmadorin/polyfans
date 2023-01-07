const chunkArray = (arr, chunkSize) => {
  const out = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    out.push(chunk);
  }

  return out;
};

export default chunkArray;
