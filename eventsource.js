var EventSource = require('eventsource');

module.exports = function(RED) {
    function EventSourceOutNode(config) {
      RED.nodes.createNode(this, config);
      
      var es = new EventSource(config.url, { rejectUnauthorized: false });

      var context = this;

      es.addEventListener("error", function(error) {
        context.error("Event Source error", error);
        context.status({ fill: "red", shape: "ring", text: "Error" });  
      });

      es.addEventListener("open", function() {
        context.status({ fill: "green", shape: "dot", text: "Connected" });  
      });

      es.addEventListener(config.event_name, function(msg) {
        var payload = msg.data;
        try {
          payload = JSON.parse(msg.data);
        } catch(err) {};

        context.send({ payload: payload });
      });

      this.on('close', function() {
        es.close();
        context.status({ fill: "red", shape: "ring", text: "Disconnected" });  
      });
    }
    
    RED.nodes.registerType("eventsource", EventSourceOutNode);
}
