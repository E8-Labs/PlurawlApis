const getRandomColor = () => {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const Pink = Math.floor(Math.random() * 256);
  
    // Return the random color in hexadecimal format
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}${Pink.toString(16)}`;
  };



  export {getRandomColor}