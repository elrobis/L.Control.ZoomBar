import os

print "Building L.Control.ZoomBar.."

pathToYUICompressor = "C:/xDev/yuicompressor-2.4.7.jar"					 					# System-specific..

pathToSRC = "C:/xDev/Projects/GMEDemo3/server/leaflet-plugins/zoom-bar/src/"				# Source folder
pathToMIN = "C:/xDev/Projects/GMEDemo3/server/leaflet-plugins/zoom-bar/build/"				# Minified folder..


# First clear the min folder..
for file in os.listdir(pathToMIN):
    filePath = pathToMIN + file
    if os.path.isfile(filePath):
        os.remove(filePath)


# Now run YUICompressor on all the source files..
for file in os.listdir(pathToSRC):
    if str(file[-3:]).upper() == ".JS":
        print "Compressing " + file + ".."
        instr = 'java -jar ' + pathToYUICompressor + ' --type js "' + pathToSRC + file + '" -o "'+ pathToMIN + file + '"'
        #print instr
        os.system(instr)
    
    if str(file[-4:]).upper() == ".CSS":
        print "Compressing " + file + ".."
        instr = 'java -jar ' + pathToYUICompressor + ' --type css "' + pathToSRC + file + '" -o "'+ pathToMIN + file + '"'
        #print instr
        os.system(instr)


print "Finished!"