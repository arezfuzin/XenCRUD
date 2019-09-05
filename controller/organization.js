const chalk = require('chalk');
const Organization = require('../model/organization');

module.exports = {
  postData(req, res) {
    console.log(chalk.yellow('[postData]:'), chalk.cyanBright(req.path));
    const data = {
      organization: req.params.orgName,
      comment: req.body.comment
    }
    const newModel = new Organization(data);
    newModel.save()
      .then((data) => {
        res.status(200).json({
          message: 'Data Saved !',
          data,
        });
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR postData]: '), err.message);
        res.status(400).json({
          message: 'Can\'t save data',
        });
      });
  },
  getDataByOrganization(req, res) {
    console.log(chalk.yellow('[getDataByOrganization]:'), chalk.cyanBright(req.path));
    const organization = req.params.orgName
    Organization.find({organization, isDeleted: false})
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
        console.log(chalk.red('[ERROR getDataByOrganization]: '), err.message);
        res.status(400).json({
          message: 'Can\'t find data',
        });
      });
  },
  deleteData(req, res) {
    console.log(chalk.yellow('[deleteData]:'), chalk.cyanBright(req.path));
    const organization = req.params.orgName
    Organization.updateMany({organization, isDeleted: false}, {$set: {isDeleted: true}}, { multi: true })
      .then((data) => {
        res.status(200).json({
          message: 'Data deleted !',
          data,
        });
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR deleteData]: '), err.message);
        res.status(400).json({
          message: 'Can\'t delete data',
        });
      });
  },
};
