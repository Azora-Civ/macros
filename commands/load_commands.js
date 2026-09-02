Time.sleep(100) // wait a bit so service closes
const manager = JsMacros.getServiceManager();
manager.unregisterService("Azora Bot")
manager.registerService("Azora Bot", __dirname + "/command_service.js", true)
