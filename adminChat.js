let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser":  "Приветствую, отправьте мне сообщение. Постараюсь ответить в ближайшее время.",
    "replyWrong": "Для ответа пользователю используйте функцию Ответить/Reply."
};
// Проверяем пользователя на права
let isAdmin = (userId) => {
    return userId == config.admin;
};
// Перенаправляем админу от пользователя или уведомляем админа об ошибке
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {        
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
    }
};
// Старт бота
bot.start((ctx) => {
    ctx.reply(isAdmin(ctx.message.from.id)
        ? replyText.helloAdmin
        : replyText.helloUser);
});
// Слушаем на наличие объекта message
bot.on('message', (ctx) => {
    // убеждаемся что это админ ответил на сообщение пользователя
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        // отправляем копию пользователю
        ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
    } else {
        // перенаправляем админу
        forwardToAdmin(ctx);
    }
});