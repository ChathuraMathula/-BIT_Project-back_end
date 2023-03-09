const { Server } = require("socket.io");

let io;

module.exports = {
  /**
   *
   * @param {object} httpServer HTTP server instance
   * @returns A new socket server instance
   */
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    return io;
  },

  /**
   * 
   * @returns existing socket server instance if already initialized
   */
  getIO: () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
  }
};
