const chalk = require('chalk');
const Model = require('../model');

module.exports = {
  postData(req, res) {
    console.log(chalk.yellow('[PATH]:'), chalk.cyanBright(req.path));
    const data = {
      organization: req.params.orgName,
      comment: req.body.comment
    }
    const newModel = new Model(data);
    newModel.save()
      .then((data) => {
        res.status(200).json({
          message: 'Data Saved !',
          data,
        });
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR]: '), err.message);
        res.status(400).json({
          message: 'Can\'t save data',
        });
      });
  },
  getDataByOrganization(req, res) {
    console.log(chalk.yellow('[PATH]:'), chalk.cyanBright(req.path));
    const organization = req.params.orgName
    Model.find({organization})
      .then((data) => {
        if (data.length > 0) {
          res.status(200).json({
            message: 'Data found !',
            data,
          });
        } else {
          res.status(200).json({
            message: 'There is no data !',
            data,
          });
        }
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR]: '), err.message);
        res.status(400).json({
          message: 'Can\'t find data',
        });
      });
  },
};
