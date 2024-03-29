const SibApiV3Sdk = require("sib-api-v3-sdk");

const API_KEY =
  "sending blue API key";

/**
   * 
 * @param {object} emailObject
 * 
 * {
  'subject':'Hello from the Node SDK!',
  'sender' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
  'replyTo' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
  'to' : [{'name': 'John Doe', 'email':'example@example.com'}],
  'htmlContent' : '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>',
  'params' : {'bodyMessage':'Made just for you!'}
  } 
 */
exports.sendTransactionEmail = (emailObject, req) => {
  
  req.headers['api-key'] = API_KEY;
  req.headers['content-type'] = "application/json";
  req.headers['accept'] = "application/json";
  
  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = API_KEY;

  new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(emailObject).then(
    (data) => {
      console.log(data);
    },
    (error) => {
      // console.error(error);
    }
  );

  // const defaultClient = SibApiV3Sdk.ApiClient.instance;

  // const apiKey = defaultClient.authentications["api-key"];
  // apiKey.apiKey = API_KEY;

  // console.log("defaultClient : ", defaultClient)

  // const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // console.log("apiInstance : ", apiInstance)

  // const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  // console.log("sendSmtpEmail : ", sendSmtpEmail)

  // sendSmtpEmail.subject = emailObject.subject;
  // sendSmtpEmail.htmlContent = emailObject.htmlContent;
  // sendSmtpEmail.sender = emailObject.sender;
  // sendSmtpEmail.to = emailObject.to;
  // sendSmtpEmail.replyTo = emailObject.replyTo;
  // sendSmtpEmail.headers = {
  //   "api-key": API_KEY,
  //   "content-type": "application/json",
  //   "accept": "application/json",
  // };

  // // console.log(sendSmtpEmail);
  // apiInstance.sendTransacEmail(sendSmtpEmail).then(
  //   (data) => {
  //     console.log(data);
  //   },
  //   (error) => {
  //     // console.error(error);
  //   }
  // );
};
