const notifier = require('node-notifier')

notifier.notify({
  title: 'Migration Done',
  message: 'Migration & seeding is successfuly 📂',
  sound: true,
  icon: './public/assets/adonis.png',
})
