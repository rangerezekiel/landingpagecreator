const notifier = require('node-notifier')

notifier.notify({
  title: 'Machine Reloaded',
  message: "Let's check this out! 🚀",
  sound: true,
  icon: './public/assets/adonis.png',
})
