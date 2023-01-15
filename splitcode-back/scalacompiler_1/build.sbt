enablePlugins(ScalaJSPlugin)

name := "CrossCompiler"
scalaVersion := "2.13.1"

// This is an application with a main method
scalaJSUseMainModuleInitializer := true
serverConnectionType := ConnectionType.Tcp