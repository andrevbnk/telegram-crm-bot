/** @type {typeof import('telegraf').Telegraf} */
const { Telegraf,Scenes,session,Stage} = require('telegraf');

let config = {
    "token": "1760195052:AAEm3L15LYb8WbZZeO7npKrXZyfpE-hB5nw", // Токен бота
    "admin": 611014829, // id владельца бота  9
    "chanel": -1001482780413, //Chanel id
};

const bot = new Telegraf(config.token);

const contactDataWizard = new Scenes.WizardScene(
    'sceneNewPost', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
      ctx.reply('Name tasks?');
      ctx.wizard.state.contactData = {};
      return ctx.wizard.next();
    },
    (ctx) => {
      ctx.wizard.state.contactData.nameTask = ctx.message.text;
      
      ctx.reply('Cost');
      return ctx.wizard.next();   
    },
    async (ctx) => {
      ctx.wizard.state.contactData.costTask = ctx.message.text;

      //   ctx.reply('Thank you for your replies, well contact your soon');
      //   await mySendContactDataMomentBeforeErase(ctx.wizard.state.contactData);
      const id =  ctx.message.from.id;
      ctx.telegram.sendMessage(config.chanel,
        `<b>${ctx.wizard.state.contactData.nameTask}</b> 
         <i>Cost</i>: ${ctx.wizard.state.contactData.costTask}`,{
        reply_markup:{
          inline_keyboard:[
              [{text:'Apply',callback_data:`Apply(${id})`}],
          ],
        },
        parse_mode:'HTML',
      });
     
      return ctx.scene.leave();
    },
  );

const stage = new Scenes.Stage([contactDataWizard]);

bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.use(stage.middleware());



const question = {
    'Name':'',
    'Description':'',
    'Cost':'',
    'Time':'',
};

const menuKeyboard = {
    reply_markup:{
        inline_keyboard:[
            [{text:'New Posts',callback_data:'newPost'},{text:'My Posts',callback_data:'newPost'}],
            [{text:'Cash',callback_data:'newPost'},{text:'Black List',callback_data:'newPost'}],
        ],
    },
    parse_mode:'HTML',
};

bot.start((ctx)=>{
    ctx.reply('Выберете',
        menuKeyboard)
});

bot.on('message',(ctx)=>{
    ctx.reply(`<b>Hello</b>. <i>How are you today?</i>`,
    menuKeyboard)
});

bot.action('newPost',(ctx)=>{
    ctx.scene.enter('sceneNewPost');
});

bot.action('Apply',(ctx)=>{
  console.log('apply');
  ctx.reply(config.chanel,ctx);
});























// запускаем бот
bot.launch();
