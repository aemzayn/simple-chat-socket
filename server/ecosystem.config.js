module.exports = {
  apps: [
    {
      name: "simple-chat-server",
      script: "dist/index.js",
      exec_mode: "cluster",
      instances: 2,
      time: true,
    },
  ],
};
