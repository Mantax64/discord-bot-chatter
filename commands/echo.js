module.exports = {
    name: 'echo',
    description: 'Repeats your message.',
    execute(message, args) {
      message.channel.send(args.join(' '));
    },
  };