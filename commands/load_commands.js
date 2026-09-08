GlobalVars.putBoolean("commands_quit", true)
Time.sleep(200) // wait a bit so service closes
GlobalVars.putBoolean("commands_quit", false)

const manager = JsMacros.getServiceManager();
manager.unregisterService("Azora Bot")
manager.registerService("Azora Bot", __dirname + "/command_service.js", true)
manager.save()
