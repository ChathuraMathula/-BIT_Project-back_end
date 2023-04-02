const Sib = require('sib-api-v3-sdk');

const API_KEY =
  "Your sendinblue API KEY";

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
exports.sendTransactionEmail = (emailObject) => {
  Sib.ApiClient.instance.authentications["api-key"].apiKey = API_KEY;
  new Sib.TransactionalEmailsApi().sendTransacEmail(emailObject).then(
    (data) => {
      console.log(data);
    },
    (error) => {
      console.error("------>", error);
    }
  );
};
