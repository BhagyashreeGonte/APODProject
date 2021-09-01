const Joi = require("joi");
const Request = require("wreck");
const fs = require('fs')
const request = require('request');
const { DownloaderHelper } = require('node-downloader-helper');
const path = require("path")

const getAPODDetails = {
  auth: false,
  tags: ["api", "User"],
  description: "Get APOD Details",
  validate: {
    payload: {
      selectedDate: Joi.string().required(),
    }
  },
  async handler(req, h) {
    try {
      let getQuery = `SELECT imageurl,description,title,astrodate,mediatype from astrologydetails where astrodate = '${req.payload.selectedDate}'`;
      const getQueryResult = await req.pool.query(getQuery);

      if (getQueryResult.rowCount == 0) {
        let responseShipmentDetails = await Request.get(`https://api.nasa.gov/planetary/apod?api_key=3QCeeKtGpCoiN2RQ3z8u0W4xvc73ixSolcI3YLRV&&date=${req.payload.selectedDate}`);
        let shipmentDetailsResponse = JSON.parse(responseShipmentDetails.payload.toString());
        let explanation = shipmentDetailsResponse.explanation.replace(/'/g, '');
        let title = shipmentDetailsResponse.title.replace(/'/g, '');
        let localPath;
        let file = shipmentDetailsResponse.url;
        let filePath = '/home/bhagyashreegonte/Videos/VueProject/myproject/src/assets'
        const dl = new DownloaderHelper(file , filePath);
        dl.on('end', () => {
          localPath =  dl.getDownloadPath()
        } )
        let res=await dl.start();
        if(res){
          let insertQuery=`INSERT INTO astrologydetails (imageurl,description,astrodate,title,mediatype)
          VALUES ('${localPath}','${explanation}','${shipmentDetailsResponse.date}','${title}','${shipmentDetailsResponse.media_type}')`;
          console.log(insertQuery);
          let insertQueryResult=await req.pool.query(insertQuery);
          if(insertQueryResult){
            let getQuery1 = `SELECT imageurl,description,title,astrodate,mediatype from astrologydetails where astrodate = '${req.payload.selectedDate}'`;
            const getQueryResult1 = await req.pool.query(getQuery1);
            return{
              ResultCode: 100,
              ReturnMessage: `Successful`,
              ResponseData: getQueryResult1.rows
            }
          }else{
            return {
              ResultCode: 101,
              ReturnMessage: "Failed Insertion"
            };
          }
        }else{
          return {
            ResultCode: 101,
            ReturnMessage: "Error while downloading"
          };
        }
      }
      return{
        ResultCode: 100,
        ReturnMessage: `Successful`,
        ResponseData: getQueryResult.rows
      }
    } catch (err) {
      return {
        ResultCode: 103,
        ReturnMessage: err.message
      };
    }
  }
};

exports.routes = [
  {
    method: "POST",
    path: "/getAPODDetails",
    config: getAPODDetails
  }
]
