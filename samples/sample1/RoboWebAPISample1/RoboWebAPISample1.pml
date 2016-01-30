<?xml version="1.0" encoding="UTF-8" ?>
<Package name="RoboWebAPISample1" format_version="4">
    <Manifest src="manifest.xml" />
    <BehaviorDescriptions>
        <BehaviorDescription name="behavior" src="init" xar="behavior.xar" />
    </BehaviorDescriptions>
    <Dialogs />
    <Resources>
        <File name="__init__" src="lib/paho/__init__.py" />
        <File name="__init__" src="lib/paho/mqtt/__init__.py" />
        <File name="client" src="lib/paho/mqtt/client.py" />
        <File name="publish" src="lib/paho/mqtt/publish.py" />
        <File name="PKG-INFO" src="lib/paho_mqtt-1.1-py2.7.egg-info/PKG-INFO" />
        <File name="SOURCES" src="lib/paho_mqtt-1.1-py2.7.egg-info/SOURCES.txt" />
        <File name="dependency_links" src="lib/paho_mqtt-1.1-py2.7.egg-info/dependency_links.txt" />
        <File name="installed-files" src="lib/paho_mqtt-1.1-py2.7.egg-info/installed-files.txt" />
        <File name="top_level" src="lib/paho_mqtt-1.1-py2.7.egg-info/top_level.txt" />
        <File name="lnetatmo" src="lib/lnetatmo.py" />
        <File name="printAllLastData" src="lib/printAllLastData.py" />
        <File name="index" src="html/init_robowebapi.html" />
        <File name="button57" src="init/button57.mp3" />
        <File name="icon" src="icon.png" />
    </Resources>
    <Topics />
    <IgnoredPaths>
        <Path src="html/.DS_Store" />
        <Path src="lib/paho_mqtt-1.1-py2.7" />
        <Path src="lib/paho_mqtt-1.1-py2" />
        <Path src=".metadata" />
        <Path src="lib/paho_mqtt-1" />
        <Path src=".DS_Store" />
    </IgnoredPaths>
</Package>
