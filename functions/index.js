import * as functions from 'firebase-functions';
import * as rssParser from 'react-native-rss-parser';
import  {TextToSpeechClient} from '@google-cloud/text-to-speech'
import {OpenAI} from 'openai'
import { translate } from '@vitalets/google-translate-api';

//Chat gpt key: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
//bar api key :AIzaSyDd04i58X-gQ9opKzKwrV7y_fngLNZKitQ
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//"https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=YOUR_API_KEY"

export const helloWorld = functions.https.onRequest((request, response) => {

  let name = request.body.name || request.query.name;
  response.status(200).send(`Hello ${name}!`);
  
});



export const textToSpeech = functions.https.onRequest((request, response) => {
  
  try {

    const client = new TextToSpeechClient();
    // Add one or more effects profiles to array.
    // Refer to documentation for more details:
    // https://cloud.google.com/text-to-speech/docs/audio-profiles
    // const effectsProfileId = ['telephony-class-application'];
  
    const request = {
      input: {text: 'आपको शैलेन्द्र खाबले से 1000 रुपये मिले, धन्यवाद'},
      voice: {languageCode: 'hi-IN', ssmlGender:'MALE',name:'hi-IN-Standard-C'},
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    client.synthesizeSpeech(request).then(res=>{
    //console.log(`Audio content written to file:`+JSON.stringify(res));
    //console.log("Returning "+JSON.stringify(res));
    response.setHeader('Content-Type','audio/mpeg')
    response.send(res[0].audioContent);


    }).catch(err=>{
      console.log("Returning "+JSON.stringify(err));
      response.send(err);
    });
   
  }
  catch(e){

    response.send('fail');
  }
    
   

});


export const ChatService = functions.https.onRequest(async (request, response) => {
  
  try {

    const items = [];

    const openaiClient=new OpenAI({apiKey:'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'});

    const params=OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'user', content: 'Who is telangana chief minister' }],
      model: 'gpt-3.5-turbo',
    };

    const chatCompletion = await openaiClient.chat.completions.create(params);

    items.push({
      role:'assistant',
      content:chatCompletion.choices[0].message.content
    });

    response.send(chatCompletion.choices[0].message.content);
    
  }
  catch(e){
    response.send(e);
  }  

});


export const ConvertTeluguToEnglish = functions.https.onRequest(async (request, response) => {
  
  
  let description = request.body.text || request.query.text;

  const { text } = await translate(description, { to: 'en' });


  try {

    console.log(text);
    
    response.send(text);



  } catch (error) {

    console.log(error);
    response.send(error);

  }
  

});






