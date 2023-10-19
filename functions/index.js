import * as functions from 'firebase-functions';
import * as rssParser from 'react-native-rss-parser';
import  {TextToSpeechClient} from '@google-cloud/text-to-speech'
import {OpenAI} from 'openai'
import { translate } from '@vitalets/google-translate-api';

//Chat gpt key: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
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

export const helloWorld = functions.https.onRequest((request, response) => {

      const client = new TextToSpeechClient();

      fetch('https://www.theguardian.com/uk/london/rss')
      .then((responseData) =>{
      // const data= responseData.rss.channel;
        //const channel = rssParser.parse(responseData.rss);

        const items = []
        const item = {
          title: 'Santosh Armoor',
          description: 'test description',
          date: '10/08/2023',
          creator:'Reddy'
          }

          items.push(item)

      // const itemsdata=JSON.parse(JSON.stringify(data._j)).items;
          response.status(201)
          .type('application/json')
          .send(items);

      })
      .then((rss) => {
      // console.log(rss.title);
        response.send(rss); 
    });
  
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
  
  const { text } = await translate('The current Chief Minister of Telangana is K. Chandrashekar Rao, also known as KCR. He is the founder and president of the Telangana Rashtra Samithi (TRS) party. He was elected as the first Chief Minister of Telangana in 2014 and was re-elected in 2018. KCR was born in Karimnagar district of Telangana in 1952. He started his political career as a member of the Indian National Congress (INC) in 1982. He served as the Minister of Irrigation and Power in the INC government of Andhra Pradesh from 1984 to 1989. He left the INC in 1989 and formed the TRS party. The TRS party campaigned for the creation of a separate Telangana state. In 2014, the TRS won the Telangana Assembly elections and KCR became the first Chief Minister of Telangana. He has been re-elected as the Chief Minister of Telangana in 2018.KCR is a controversial figure. He has been accused of corruption and nepotism. However, he is also popular among the people of Telangana for his development work. He is known for his aggressive style of politics and his populist schemes. ', { to: 'te' });


  try {
    response.send(text);

  } catch (error) {
    response.send(error);

  }
  

});






