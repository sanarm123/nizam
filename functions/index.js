import * as functions from 'firebase-functions';
import * as rssParser from 'react-native-rss-parser';
import  {TextToSpeechClient} from '@google-cloud/text-to-speech'



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
    const effectsProfileId = ['telephony-class-application'];
  
    const request = {
      input: {text: 'आपको शैलेन्द्र खाबले से 1000 रुपये मिले, धन्यवाद'},
      voice: {languageCode: 'hi-IN', ssmlGender:'MALE',name:'hi-IN-Standard-C'},
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    client.synthesizeSpeech(request).then(res=>{
    
    console.log(`Audio content written to file:`+JSON.stringify(res));
    console.log("Returning "+JSON.stringify(res));
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




