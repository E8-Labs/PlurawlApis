const SpotifySongModel = (sequelize, Sequelize) => {
    const SpotifySongModel = sequelize.define("SpotifySongModel", {
      title: {
        type: Sequelize.STRING,
        default: ''
      },
      artImage: {
        type: Sequelize.STRING,
        default: ''
      },
      description: {
        type: Sequelize.STRING,
        default: ''
      },
      trackId: {
        type: Sequelize.STRING,
        default: ''
      },
      previewUrl: {
        type: Sequelize.STRING,
        default: ''
      },
      
    },
    );
  
    return SpotifySongModel;
  };

  export default SpotifySongModel;