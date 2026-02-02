const eventEmitter = {
    events: {},
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },
    emit(event, ...args) {
      if (this.events[event]) {
        this.events[event].forEach((callback) => callback(...args));
      }
    },
  };
  
  export default eventEmitter;